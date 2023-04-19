import {Directive, nextTick} from "vue";
import {DirectiveBinding} from "@vue/runtime-core";
import {addDirectiveRecords, directiveConfig} from "./listen";
import {DirectiveConfig, ExtHTMLElement} from "./types";

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
  updated(el: ExtHTMLElement, {value}: DirectiveBinding<Partial<DirectiveConfig> | string>) {
    if (!el.lazy?.watchUpdate) return
    const oldSrc = el.lazy!.src
    let lazyKey: string | undefined
    if (typeof value === 'string') {
      if (value === oldSrc) return;
      el.lazy = Object.assign({...directiveConfig}, {src: value})
    } else {
      if (value.src === oldSrc) return;
      const {loading, loadingClassList = []} = value
      if (loading) el.setAttribute('src', loading)
      el.classList.add(...loadingClassList)
      el.lazy = Object.assign({...directiveConfig}, value)
      lazyKey = value.lazyKey
    }
    addDirectiveRecords(el, lazyKey)
  }
} as Directive
