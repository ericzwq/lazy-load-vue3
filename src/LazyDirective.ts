import {Directive, nextTick} from "vue";
import {DirectiveBinding} from "@vue/runtime-core";
import {addDirectiveRecords, directiveConfig, inViewPort, lazyKeyElMap, updateDirectiveEl} from "./listen";
import {DirectiveConfig, ExtHTMLElement, Status, ViewStatus} from "./types";

export default {
  beforeMount(el: ExtHTMLElement, {value}: DirectiveBinding<Partial<DirectiveConfig> | string>) {
    let lazyKey: string | undefined
    if (typeof value === 'string') {
      el.lazy = Object.assign({...directiveConfig}, {src: value})
    } else {
      const {loading, loadingClassList = []} = value
      if (loading) el.setAttribute('src', loading)
      el.classList.add(...loadingClassList)
      el.lazy = Object.assign({...directiveConfig}, value)
      lazyKey = value.lazyKey
    }
    nextTick().then(() => addDirectiveRecords(el, lazyKey))
  },
  updated(el: ExtHTMLElement) {
    if (!el.lazy?.watchUpdate) return
    setTimeout(() => {
      if (el.getAttribute('status') !== Status.waitingLoad) return // it's necessary
      if (inViewPort(el) === ViewStatus.in) updateDirectiveEl(el, true)
    })
  },
  beforeUnmount(el: ExtHTMLElement) {
    for (const [, elSet] of lazyKeyElMap) elSet.delete(el)
  }
} as Directive
