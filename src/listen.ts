import {BaseConfig, Config, DirectiveConfig, ExtComponentPublicInstance, ExtHTMLElement, Status, ViewStatus, Vm_El} from "./types";

const defaultKey = 'default'
export const elLazyKeySetMap = new Map<HTMLElement, Set<string>>()
export const lazyKeyVmMap = new Map<string, Set<ExtComponentPublicInstance>>()
export const lazyKeyElMap = new Map<string, Set<ExtHTMLElement>>()
export const baseConfig: BaseConfig = {
  error: '',
  loading: '',
  errorClassList: [],
  loadingClassList: [],
  loadedClassList: [],
  onError: undefined,
  onLoad: undefined,
  watchUpdate: true
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

const enum HandleType {
  component,
  directive
}

export const listener = throttle((sorted, handleType, set, top, right, bottom, left, y, x): void => {
  const checkFn = top !== undefined ?
    (el: HTMLElement) => inParentView(el, top, right as number, bottom as number, left as number, y as number, x as number) :
    inViewPort
  handleType === HandleType.component ?
    handler(sorted, set as Set<ExtComponentPublicInstance>, checkFn, e => e.$el, updateComponentVm) :
    handler(sorted, set as Set<ExtHTMLElement>, checkFn, e => e, updateDirectiveEl)
})

window.addEventListener('scroll', listener)

export function inViewPort(el: HTMLElement): ViewStatus {
  const {left, right, top, bottom} = el.getBoundingClientRect()
  return top <= window.innerHeight && bottom > 0 && left <= window.innerWidth && right > 0 ? ViewStatus.in : (left !== 0 || top !== 0) ? ViewStatus.notIn : ViewStatus.noView
}

function inParentView(el: HTMLElement, pTop: number, pRight: number, pBottom: number, pLeft: number, y: number, x: number): ViewStatus {
  const {left, right, top, bottom} = el.getBoundingClientRect()
  return top <= pBottom + y && bottom >= pTop - y && left <= pRight + x && right >= pLeft - x ? ViewStatus.in : (left !== 0 || top !== 0) ? ViewStatus.notIn : ViewStatus.noView
}

function handler<T extends Vm_El>(sorted: boolean, targetSet: Set<T>, checkFn: (el: HTMLElement) => ViewStatus, getEl: (e: T) => HTMLElement, updateFn: (e: T, isDelete: boolean, targetSet?: Set<T>) => void): void {
  let flag = false
  for (const e of targetSet) {
    if (getEl(e).compareDocumentPosition(document) & Node.DOCUMENT_POSITION_DISCONNECTED) { // unmount
      targetSet.delete(e)
      continue
    }
    const viewStatus = checkFn(getEl(e))
    if (viewStatus === ViewStatus.in) {
      flag = true
      updateFn(e, true, targetSet)
    } else if (viewStatus === ViewStatus.notIn && sorted && flag) break
  }
}

export function updateDirectiveEl(el: ExtHTMLElement, isDelete: boolean, targetElSet?: Set<ExtHTMLElement>): void {
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
  } else if (isDelete) {
    for (const [, elSet] of lazyKeyElMap) {
      if (elSet.delete(el)) break
    }
  }
}

export function updateComponentVm(vm: ExtComponentPublicInstance, isDelete: boolean, targetVmSet?: Set<ExtComponentPublicInstance>): void {
  vm.isLoaded = true
  if (targetVmSet) {
    targetVmSet.delete(vm)
  } else if (isDelete) {
    for (const [, vmSet] of lazyKeyVmMap) {
      if (vmSet.delete(vm)) break
    }
  }
}

export function addComponentRecords(vm: ExtComponentPublicInstance): void {
  const lazyKey = vm.$props.lazyKey ?? defaultKey
  const lazyVmSet = lazyKeyVmMap.get(lazyKey) || new Set()
  if (lazyVmSet.has(vm)) return
  const viewStatus = inViewPort(vm.$el)
  if (viewStatus === ViewStatus.in) return updateComponentVm(vm, false)
  if (viewStatus === ViewStatus.noView) return
  lazyVmSet.add(vm)
  lazyKeyVmMap.set(lazyKey, lazyVmSet)
  addListener(vm.$el.parentElement, lazyKey)
}

export function addDirectiveRecords(el: ExtHTMLElement, lazyKey: string | undefined): void {
  lazyKey = lazyKey ?? defaultKey
  const lazyVmSet = lazyKeyElMap.get(lazyKey) || new Set()
  if (lazyVmSet.has(el)) return
  const viewStatus = inViewPort(el)
  if (viewStatus === ViewStatus.in) return updateDirectiveEl(el, false)
  if (viewStatus === ViewStatus.noView) return
  el.setAttribute('status', Status.waitingLoad)
  lazyVmSet.add(el)
  lazyKeyElMap.set(lazyKey, lazyVmSet)
  addListener(el.parentElement, lazyKey)
}

function addListener(parent: HTMLElement | null, lazyKey: string) {
  while (parent) {
    const lazyKeySet = elLazyKeySetMap.get(parent) || new Set<string>()
    if (!lazyKeySet.has(lazyKey)) {
      lazyKeySet.add(lazyKey)
      elLazyKeySetMap.set(parent, lazyKeySet)
      parent.addEventListener('scroll', e => listener(e, {lazyKey}))
    } else break
    parent = parent.parentElement
  }
}

function throttle(cb: (sorted: boolean, handleType: HandleType, targetVmSet: Set<Vm_El>, top?: number, right?: number, bottom?: number, left?: number, y?: number, x?: number) => void) {
  let flag = false, lastScrollLeft = 0, lastScrollTop = 0, timer: number
  const handler = (sorted: boolean, event: Event | undefined, lazyKey: string | undefined) => {
    console.log({lazyKey, event}, elLazyKeySetMap)
    if (event && ![window, document].includes(event.target as Document)) {
      const target = event.target as HTMLElement
      const targetVmSets: Set<ExtComponentPublicInstance>[] = findSet(target, lazyKeyVmMap, vm => vm.$el, lazyKey)
      const targetElSets: Set<ExtHTMLElement>[] = findSet(target, lazyKeyElMap, el => el, lazyKey)
      const {left, right, top, bottom} = target.getBoundingClientRect()
      const {scrollLeft, scrollTop} = target
      const y = Math.abs(scrollTop - lastScrollTop) * config.preLoad
      const x = Math.abs(scrollLeft - lastScrollLeft) * config.preLoad
      for (const targetVmSet of targetVmSets) cb(sorted, HandleType.component, targetVmSet, top, right, bottom, left, y, x)
      for (const targetElSet of targetElSets) cb(sorted, HandleType.directive, targetElSet, top, right, bottom, left, y, x)
      lastScrollLeft = scrollLeft
      lastScrollTop = scrollTop
    } else {
      for (const [, vmSet] of lazyKeyVmMap) cb(sorted, HandleType.component, vmSet)
      for (const [, elSet] of lazyKeyElMap) cb(sorted, HandleType.directive, elSet)
    }
    flag = false
    config.afterListen && config.afterListen(event, lazyKeyElMap, lazyKeyVmMap)
  }
  return (event?: Event, {lazyKey, sorted}: { lazyKey?: string, sorted?: boolean } = {}) => {
    sorted = sorted ?? config.sorted
    if (config.debounce) {
      clearTimeout(timer)
      timer = setTimeout(() => handler(sorted as boolean, event, lazyKey), config.timeout + 50) // debounce
    }
    if (flag) return
    flag = true
    setTimeout(() => handler(sorted as boolean, event, lazyKey), config.timeout) // throttle
  }
}

function findSet<T extends Vm_El>(target: HTMLElement, map: Map<string, Set<T>>, getEl: (e: T) => HTMLElement, lazyKey: string | undefined): Set<T>[] {
  const elLazyKeySet = elLazyKeySetMap.get(target) as Set<string>
  const res = []
  for (const lazyKey of elLazyKeySet) {
    if (map.has(lazyKey)) res.push(map.get(lazyKey) as Set<T>)
  }
  // if (lazyKey !== undefined) return map.has(lazyKey) ? [map.get(lazyKey) as Set<T>] : []
  // if (map.size === 1) return map.has(defaultKey) ? [map.get(defaultKey) as Set<T>] : [] // just one key
  // const res = []
  // for (const [, set] of map) {
  //   if (!set.size) continue
  //   for (const e of set) {
  //     if (getEl(e).compareDocumentPosition(document) & Node.DOCUMENT_POSITION_DISCONNECTED) set.delete(e)
  //     else {
  //       if (getEl(e).compareDocumentPosition(target) & Node.DOCUMENT_POSITION_CONTAINS) res.push(set)
  //       break
  //     }
  //   }
  // }
  return res
}
