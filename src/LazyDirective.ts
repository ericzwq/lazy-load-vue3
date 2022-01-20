import {Directive, nextTick} from "vue";
import {DirectiveBinding} from "@vue/runtime-core";
import {data, addDirectiveRecords, inViewPort, updateDirectiveEl, directiveConfig, lazyElMap} from "./listen";
import {DirectiveConfig, ExtHTMLElement} from "./types";

export default {
  beforeMount(el: ExtHTMLElement, {value}: DirectiveBinding<DirectiveConfig>) {
    data.directiveTotal++
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
    setTimeout(() => {
      if (inViewPort(el)) updateDirectiveEl(el)
    })
  },
  beforeUnmount(el: ExtHTMLElement) {
    for (const [, elSet] of lazyElMap) {
      if (elSet.delete(el)) {
        data.directiveTotal--
        data.directiveCount--
      }
    }
  }
} as Directive
