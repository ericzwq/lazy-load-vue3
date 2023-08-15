import {Directive, nextTick} from "vue";
import {DirectiveBinding} from "@vue/runtime-core";
import {addDirectiveRecord, directiveConfig} from "./listen";
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
    nextTick().then(() => addDirectiveRecord(el, lazyKey, false))
  },
  updated(el: ExtHTMLElement, {value}: DirectiveBinding<Partial<DirectiveConfig> | string>) {
    addDirectiveRecord(el, typeof value !== 'string' ? value.lazyKey : undefined, true)
  }
} as Directive