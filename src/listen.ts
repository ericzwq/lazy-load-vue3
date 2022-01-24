import {ComponentPublicInstance} from "vue";
import {BaseConfig, ExtComponentPublicInstance, ExtHTMLElement, Config, DirectiveConfig, Status} from "./types";

const defaultKey = 'default'
export const parentElSet = new Set()
export const lazyVmMap = new Map<string, Set<ComponentPublicInstance>>()
export const lazyElMap = new Map<string, Set<ExtHTMLElement>>()
export const data = {
  componentTotal: 0,
  directiveTotal: 0,
  componentCount: 0,
  directiveCount: 0
}
export const baseConfig: BaseConfig = {
  error: '',
  loading: '',
  errorClassList: [],
  loadingClassList: [],
  loadedClassList: [],
  onError: undefined,
  onLoad: undefined
}
export const config: Config = Object.assign({
  timeout: 200,
  preLoad: 0.3,
  component: false,
  sorted: true,
  debounce: false,
  afterListen: undefined
}, baseConfig)
export const directiveConfig: DirectiveConfig = Object.assign({
  src: '',
  lazyKey: defaultKey
}, baseConfig)
export const listener = throttle((sorted, targetVmSet, targetElSet, top, right, bottom, left, y, x): void => {
  lazyHandler(sorted, targetVmSet, targetElSet, top !== undefined ? (el) => inParentView(el, top, right as number, bottom as number, left as number, y as number, x as number) : inViewPort)
})

window.addEventListener('scroll', listener)

export function inViewPort(el: HTMLElement): boolean {
  const {left, right, top, bottom} = el.getBoundingClientRect()
  return top <= window.innerHeight && bottom > 0 && left <= window.innerWidth && right > 0
}

function inParentView(el: HTMLElement, pTop: number, pRight: number, pBottom: number, pLeft: number, y: number, x: number): boolean {
  const {left, right, top, bottom} = el.getBoundingClientRect()
  return top <= pBottom + y && bottom >= pTop - y && left <= pRight + x && right >= pLeft - x
}

function lazyHandler(sorted: boolean, targetVmSet: Set<ComponentPublicInstance>, targetElSet: Set<ExtHTMLElement>, checkFn: (el: HTMLElement) => boolean): void {
  // components
  let flag = false
  for (const vm of targetVmSet) {
    if (vm.$el.compareDocumentPosition(document) & Node.DOCUMENT_POSITION_DISCONNECTED) { // unmount
      targetVmSet.delete(vm)
      data.componentTotal--
      data.componentCount--
      continue
    }
    if (checkFn(vm.$el)) {
      flag = true;
      (vm as ExtComponentPublicInstance).isLoaded = true
      targetVmSet.delete(vm)
      data.componentTotal--
      data.componentCount--
    } else if (sorted && flag) break
  }
  // directives
  flag = false
  for (const el of targetElSet) {
    if (el.compareDocumentPosition(document) & Node.DOCUMENT_POSITION_DISCONNECTED) {
      targetElSet.delete(el)
      data.directiveTotal--
      data.directiveCount--
      continue
    }
    if (checkFn(el)) {
      flag = true
      updateDirectiveEl(el, targetElSet)
    } else if (sorted && flag) break
  }
}

export function updateDirectiveEl(el: ExtHTMLElement, targetElSet?: Set<ExtHTMLElement>): void {
  if (el.getAttribute('status') !== Status.waitingLoad) return
  const {src, loadingClassList, errorClassList, error, loadedClassList, onError, onLoad} = el.lazy as DirectiveConfig
  el.setAttribute('status', Status.loading)
  el.setAttribute('src', src)
  el.addEventListener('error', () => {
    el.setAttribute('status', Status.error)
    el.classList.add(...errorClassList)
    el.classList.remove(...loadingClassList)
    if (error) el.setAttribute('src', error)
    onError?.(el, el.lazy as DirectiveConfig)
    el.lazy = undefined
  })
  el.addEventListener('load', () => {
    el.setAttribute('status', Status.loaded)
    el.classList.add(...loadedClassList)
    el.classList.remove(...loadingClassList)
    onLoad?.(el, el.lazy as DirectiveConfig)
    el.lazy = undefined
  })
  if (targetElSet) {
    targetElSet.delete(el)
    data.directiveTotal--
    data.directiveCount--
  } else {
    for (const [, elSet] of lazyElMap) {
      if (elSet.delete(el)) {
        data.directiveTotal--
        data.directiveCount--
      }
    }
  }
}

export function addComponentRecords(vm: ComponentPublicInstance): void {
  const lazyVmSet = lazyVmMap.get((vm.$props as { lazyKey: string }).lazyKey ?? defaultKey) || new Set()
  if (lazyVmSet.has(vm)) return
  lazyVmSet.add(vm)
  lazyVmMap.set((vm.$props as { lazyKey: string }).lazyKey ?? defaultKey, lazyVmSet)
  let parent = vm.$el.parentElement as HTMLElement
  while (parent) {
    if (parentElSet.has(parent)) break
    parentElSet.add(parent)
    parent.addEventListener('scroll', listener)
    parent = parent.parentElement as HTMLElement
  }
  if (++data.componentCount === data.componentTotal && data.directiveCount === data.directiveTotal) listener()
}

export function addDirectiveRecords(el: ExtHTMLElement, key: string): void {
  const lazyVmSet = lazyElMap.get(key) || new Set()
  if (lazyVmSet.has(el)) return
  el.setAttribute('status', Status.waitingLoad)
  lazyVmSet.add(el)
  lazyElMap.set(key, lazyVmSet)
  let parent = el.parentElement as HTMLElement
  while (parent) {
    if (parentElSet.has(parent)) break
    parentElSet.add(parent)
    parent.addEventListener('scroll', listener)
    parent = parent.parentElement as HTMLElement
  }
  if (++data.directiveCount === data.directiveTotal && data.componentCount === data.componentTotal) listener()
}

function throttle(cb: (sorted: boolean, targetVmSet: Set<ComponentPublicInstance>, targetElSet: Set<ExtHTMLElement>, top?: number, right?: number, bottom?: number, left?: number, y?: number, x?: number) => void) {
  let flag = false, lastScrollLeft = 0, lastScrollTop = 0, timer: number
  const handler = (sorted: boolean, event?: Event) => {
    if (event && ![window, document].includes(event.target as Document)) {
      const targetVmSet: Set<ComponentPublicInstance> = findVmSet(event.target as HTMLElement)
      const targetElSet: Set<ExtHTMLElement> = findElSet(event.target as HTMLElement)
      const {left, right, top, bottom} = ((event.target as HTMLElement).getBoundingClientRect())
      const {scrollLeft, scrollTop} = (event.target as HTMLElement)
      cb(sorted, targetVmSet, targetElSet, top, right, bottom, left, Math.abs(scrollTop - lastScrollTop) * config.preLoad, Math.abs(scrollLeft - lastScrollLeft) * config.preLoad) // 大于0向上滚动
      lastScrollLeft = scrollLeft
      lastScrollTop = scrollTop
    } else {
      for (const [, vmSet] of lazyVmMap) cb(sorted, vmSet, new Set())
      for (const [, elSet] of lazyElMap) cb(sorted, new Set(), elSet)
    }
    flag = false
    config.afterListen && event && config.afterListen(event)
  }
  return (event?: Event | boolean, sorted?: boolean) => {
    if (event === undefined || event instanceof Object) { // default config
      sorted = config.sorted
    } else if (typeof event === 'boolean') { // manual call
      sorted = event
      event = undefined
    }
    if (config.debounce) {
      clearTimeout(timer)
      timer = setTimeout(() => handler(sorted as boolean, event as Event), config.timeout + 50) // debounce
    }
    if (flag) return
    flag = true
    setTimeout(() => handler(sorted as boolean, event as Event), config.timeout) // throttle
  }
}

function findVmSet(target: HTMLElement): Set<ComponentPublicInstance> {
  if (lazyVmMap.size === 1) return lazyVmMap.get(defaultKey) || new Set() // just one key
  for (const [, lazyVmSet] of lazyVmMap) {
    if (!lazyVmSet.size) continue
    for (const vm of lazyVmSet) {
      if (vm.$el.compareDocumentPosition(document) & Node.DOCUMENT_POSITION_DISCONNECTED) {
        data.componentTotal--
        data.componentCount--
        lazyVmSet.delete(vm)
      } else {
        if (vm.$el.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_CONTAINS) return lazyVmSet
        break
      }
    }
  }
  return new Set()
}

function findElSet(target: HTMLElement): Set<ExtHTMLElement> {
  if (lazyElMap.size === 1) return lazyElMap.get(defaultKey) || new Set() // just one key
  for (const [, lazyElSet] of lazyElMap) {
    if (!lazyElSet.size) continue
    for (const el of lazyElSet) {
      if (el.compareDocumentPosition(document) & Node.DOCUMENT_POSITION_DISCONNECTED) {
        data.directiveTotal--
        data.directiveCount--
        lazyElSet.delete(el)
      } else {
        if (el.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_CONTAINS) return lazyElSet
        break
      }
    }
  }
  return new Set()
}
