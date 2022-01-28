import {Directive, nextTick} from "vue";
import {DirectiveBinding} from "@vue/runtime-core";
import {addDirectiveRecords, directiveConfig, inViewPort, lazyElMap, updateDirectiveEl} from "./listen";
import {DirectiveConfig, ExtHTMLElement, Status, ViewStatus} from "./types";

export default {
  beforeMount(el: ExtHTMLElement, {value}: DirectiveBinding<DirectiveConfig>) {
    let key = 'default'
    if (typeof value === 'string') {
      el.lazy = Object.assign({...directiveConfig}, {src: value})
    } else {
      const {loading, loadingClassList = []} = value
      if (loading) el.setAttribute('src', loading)
      el.classList.add(...loadingClassList)
      if (value.lazyKey != null) key = value.lazyKey
      el.lazy = Object.assign({...directiveConfig}, value)
    }
    nextTick().then(() => addDirectiveRecords(el, key))
  },
  updated(el: ExtHTMLElement) {
    if (!el.lazy?.watchUpdate) return
    setTimeout(() => {
      if (el.getAttribute('status') !== Status.waitingLoad) return // it's necessary
      if (inViewPort(el) === ViewStatus.in) updateDirectiveEl(el, true)
    })
  },
  beforeUnmount(el: ExtHTMLElement) {
    for (const [, elSet] of lazyElMap) elSet.delete(el)
  }
} as Directive
