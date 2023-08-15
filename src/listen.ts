import {BaseConfig, Config, DirectiveConfig, ExtComponentPublicInstance, ExtHTMLElement, UpdateInfo, ViewStatus, Vm_El} from "./types";

const defaultKey = 'default'
export const elLazyKeySetMap = new Map<HTMLElement, Set<string>>()
export const lazyKeyVmSetMap = new Map<string, Set<ExtComponentPublicInstance>>()
export const lazyKeyElSetMap = new Map<string, Set<ExtHTMLElement>>()
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
  component: false,
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

const mainHandler = (handleType: HandleType, set: Set<Vm_El>, sort?: boolean, top?: number, right?: number, bottom?: number, left?: number) => {
  const {clientWidth, clientHeight} = document.documentElement
  const checkFn = top !== undefined ?
    (el: HTMLElement) => inParentView(el, top, right as number, bottom as number, left as number) :
    (el: HTMLElement) => inViewPort(el, clientHeight, clientWidth)
  return handleType === HandleType.component ?
    handleUpdate(set as Set<ExtComponentPublicInstance>, checkFn, e => e.$el, updateComponentVm, sort) :
    handleUpdate(set as Set<ExtHTMLElement>, checkFn, e => e, updateDirectiveEl, sort)
}

export const listener = throttle(mainHandler)

window.addEventListener('scroll', listener)

export function inViewPort(el: HTMLElement, clientHeight: number, clientWidth: number): ViewStatus {
  const {left, right, top, bottom} = el.getBoundingClientRect()
  if (top <= clientHeight && bottom > 0 && left <= clientWidth && right > 0) return ViewStatus.in
  if (top > clientHeight) return ViewStatus.below
  if (bottom < 0) return ViewStatus.higher
  if (top <= clientHeight && bottom > 0) return ViewStatus.horizontalHide
  if (left === 0 && top === 0) return ViewStatus.noView
  return ViewStatus.notIn
}

function inParentView(el: HTMLElement, pTop: number, pRight: number, pBottom: number, pLeft: number): ViewStatus {
  const {left, right, top, bottom} = el.getBoundingClientRect()
  if (top <= pBottom && bottom >= pTop && left <= pRight && right >= pLeft) return ViewStatus.in
  if (top > pBottom) return ViewStatus.below
  if (bottom < pTop) return ViewStatus.higher
  if (top <= pBottom && bottom >= pTop) return ViewStatus.horizontalHide
  if (left === 0 && top === 0) return ViewStatus.noView
  return ViewStatus.notIn
}

function handleUpdate<T extends Vm_El>(targetSet: Set<T>, checkFn: (el: HTMLElement) => ViewStatus, getEl: (e: T) => HTMLElement, updateFn: (e: T, targetSet: Set<T>) => void, sort?: boolean) {
  let targets = Array.from(targetSet)
  if (sort) {
    targets.sort((a, b) => {
      const pos = getEl(a).compareDocumentPosition(getEl(b))
      if (!(pos & Node.DOCUMENT_POSITION_DISCONNECTED)) {
        return 1 - (pos & Node.DOCUMENT_POSITION_FOLLOWING)
      }
      return (getEl(a).compareDocumentPosition(document) & Node.DOCUMENT_POSITION_DISCONNECTED) ? -1 : 1
    })
    targetSet.clear()
    for (const target of targets) targetSet.add(target)
  } else {
    let i = 0, mountedTarget
    while ((mountedTarget = targets[i++]) && (getEl(mountedTarget).compareDocumentPosition(document) & Node.DOCUMENT_POSITION_DISCONNECTED)) void 0;
    if (!mountedTarget) {
      targetSet.clear()
      return new Set()
    }
    const unMountedTargets = targets.splice(0, i - 1)
    if (targets.length > 1 && !(getEl(mountedTarget).compareDocumentPosition(getEl(targets[1])) & Node.DOCUMENT_POSITION_FOLLOWING)) { // List rendering may be in reverse order.
      targets = targets.reverse()
      targetSet.clear()
      for (const target of targets) targetSet.add(target)
    } else {
      for (const target of unMountedTargets) targetSet.delete(target)
    }
  }

  const inViewIndex = binarySearch(targets)
  if (inViewIndex === -1) return targetSet
  updateFn(targets[inViewIndex], targetSet)
  for (let i = inViewIndex - 1; i > -1; i--) {
    if (checkFn(getEl(targets[i])) === ViewStatus.in) {
      updateFn(targets[i], targetSet)
    } else {
      break
    }
  }
  for (let i = inViewIndex + 1, l = targets.length; i < l; i++) {
    if (checkFn(getEl(targets[i])) === ViewStatus.in) {
      updateFn(targets[i], targetSet)
    } else {
      break
    }
  }

  return targetSet

  function binarySearch(list: T[], l = 0, r = list.length - 1): number {
    if (l > r) return -1
    const index = Math.floor((l + r) / 2)
    const viewStatus = checkFn(getEl(list[index]))
    if (viewStatus === ViewStatus.in) {
      return index
    } else if (viewStatus === ViewStatus.below) {
      return binarySearch(list, l, index - 1)
    } else if (viewStatus === ViewStatus.higher) {
      return binarySearch(list, index + 1, r)
    } else if ([ViewStatus.horizontalHide, ViewStatus.noView].includes(viewStatus)) {
      return -1
    } else {
      const leftSearchedIndex = binarySearch(list, l, index - 1)
      if (leftSearchedIndex > -1) return leftSearchedIndex
      return binarySearch(list, index + 1, r)
    }
  }
}

export function updateDirectiveEl(el: ExtHTMLElement, targetElSet?: Set<ExtHTMLElement>): void {
  const {src, loadingClassList, errorClassList, error, loadedClassList, onError, onLoad} = el.lazy
  el.__isLoaded = true
  el.setAttribute('src', src)
  el.addEventListener('error', () => {
    el.classList.remove(...loadingClassList)
    el.classList.remove(...loadedClassList)
    el.classList.add(...errorClassList)
    if (error) el.setAttribute('src', error)
    onError?.(el, el.lazy)
  }, {once: true})

  el.addEventListener('load', () => {
    el.classList.remove(...loadingClassList)
    el.classList.remove(...errorClassList)
    el.classList.add(...loadedClassList)
    onLoad?.(el, el.lazy)
  }, {once: true})
  targetElSet?.delete(el)
}

export function updateComponentVm(vm: ExtComponentPublicInstance, targetVmSet?: Set<ExtComponentPublicInstance>): void {
  vm.isLoaded = true
  targetVmSet?.delete(vm)
}

const lazyKeyComponentUpdateInfoMap = new Map<string, UpdateInfo<ExtComponentPublicInstance>>()

export function addComponentRecord(vm: ExtComponentPublicInstance, isMounted: boolean): void {
  const lazyKey = vm.$props.lazyKey ?? defaultKey
  let componentUpdateInfo: UpdateInfo<ExtComponentPublicInstance>
  if (lazyKeyComponentUpdateInfoMap.has(lazyKey)) {
    componentUpdateInfo = lazyKeyComponentUpdateInfoMap.get(lazyKey)!
  } else {
    componentUpdateInfo = {tempSet: new Set<ExtComponentPublicInstance>(), timer: -1, sort: false}
    lazyKeyComponentUpdateInfoMap.set(lazyKey, componentUpdateInfo)
  }
  const vmSet = lazyKeyVmSetMap.get(lazyKey) || new Set<ExtComponentPublicInstance>()
  vmSet.delete(vm)
  !vm.isLoaded && componentUpdateInfo.tempSet.add(vm)
  clearTimeout(componentUpdateInfo.timer)
  isMounted && (componentUpdateInfo.sort = true)
  componentUpdateInfo.timer = setTimeout(() => {
    const targetSet = mainHandler(HandleType.component, componentUpdateInfo.tempSet, componentUpdateInfo.sort)
    for (const target of targetSet) {
      vmSet.add(target as ExtComponentPublicInstance)
    }
    componentUpdateInfo.sort = false
    componentUpdateInfo.tempSet = new Set<ExtComponentPublicInstance>()
    lazyKeyVmSetMap.set(lazyKey, vmSet)
  }, 10)
  !isMounted && addListener(vm.$el.parentElement, lazyKey)
}

const lazyKeyDirectiveUpdateInfoMap = new Map<string, UpdateInfo<ExtHTMLElement>>()

export function addDirectiveRecord(el: ExtHTMLElement, lazyKey: string | undefined, isMounted: boolean): void {
  lazyKey = lazyKey ?? defaultKey
  let directiveUpdateInfo: UpdateInfo<ExtHTMLElement>
  if (lazyKeyDirectiveUpdateInfoMap.has(lazyKey)) {
    directiveUpdateInfo = lazyKeyDirectiveUpdateInfoMap.get(lazyKey)!
  } else {
    directiveUpdateInfo = {tempSet: new Set<ExtHTMLElement>(), timer: -1, sort: false}
    lazyKeyDirectiveUpdateInfoMap.set(lazyKey, directiveUpdateInfo)
  }
  const elSet = lazyKeyElSetMap.get(lazyKey) || new Set<ExtHTMLElement>()
  elSet.delete(el)
  !el.__isLoaded && directiveUpdateInfo.tempSet.add(el)
  isMounted && (directiveUpdateInfo.sort = true)
  clearTimeout(directiveUpdateInfo.timer)
  directiveUpdateInfo.timer = setTimeout(() => {
    const targetSet = mainHandler(HandleType.directive, directiveUpdateInfo.tempSet, directiveUpdateInfo.sort)
    for (const target of targetSet) {
      elSet.add(target as ExtHTMLElement)
    }
    directiveUpdateInfo.sort = false
    directiveUpdateInfo.tempSet = new Set<ExtHTMLElement>()
    lazyKeyElSetMap.set(lazyKey!, elSet)
  }, 10)
  !isMounted && addListener(el.parentElement, lazyKey)
}

function addListener(parent: HTMLElement | null, lazyKey: string) {
  while (parent) {
    const lazyKeySet = elLazyKeySetMap.get(parent) || new Set<string>()
    if (!lazyKeySet.has(lazyKey)) {
      elLazyKeySetMap.set(parent, lazyKeySet.add(lazyKey))
      parent.addEventListener('scroll', listener)
    } else break
    parent = parent.parentElement
  }
}

function throttle(fn: typeof mainHandler) {
  let flag = false, timer: number
  const handler = (event?: Event, sort?: boolean) => {
    if (event && ![window, document].includes(event.target as Document)) {
      const target = event.target as HTMLElement
      const targetVmSets: Set<ExtComponentPublicInstance>[] = findSet(target, lazyKeyVmSetMap)
      const targetElSets: Set<ExtHTMLElement>[] = findSet(target, lazyKeyElSetMap)
      const {left, right, top, bottom} = target.getBoundingClientRect()
      for (const targetVmSet of targetVmSets) fn(HandleType.component, targetVmSet, sort, top, right, bottom, left)
      for (const targetElSet of targetElSets) fn(HandleType.directive, targetElSet, sort, top, right, bottom, left)
    } else {
      for (const [, vmSet] of lazyKeyVmSetMap) fn(HandleType.component, vmSet, sort)
      for (const [, elSet] of lazyKeyElSetMap) fn(HandleType.directive, elSet, sort)
    }
    flag = false
    config.afterListen && config.afterListen(event, lazyKeyElSetMap, lazyKeyVmSetMap)
  }
  return (event?: Event, sort?: boolean) => {
    if (config.debounce) {
      clearTimeout(timer)
      timer = setTimeout(() => handler(event, sort), config.timeout + 50) // debounce
    }
    if (flag) return
    flag = true
    setTimeout(() => handler(event, sort), config.timeout) // throttle
  }
}

function findSet<T extends Vm_El>(target: HTMLElement, map: Map<string, Set<T>>): Set<T>[] {
  const lazyKeySet = elLazyKeySetMap.get(target) as Set<string>
  const res = []
  for (const lazyKey of lazyKeySet) {
    if (map.has(lazyKey)) res.push(map.get(lazyKey) as Set<T>)
  }
  return res
}