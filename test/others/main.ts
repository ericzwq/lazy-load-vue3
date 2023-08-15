import {createApp} from 'vue'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// import LazyLoad, {config} from '~/lazy-load-vue3.esm.js'
import LazyLoad from '../../src'
import App from './App.vue'
import {ExtComponentPublicInstance, ExtHTMLElement, DirectiveConfig} from "../../src/types";

createApp(App).use(ElementPlus)
  .use(LazyLoad, {
    component: true,
    onLoad: (el: HTMLElement, lazy: DirectiveConfig) => console.log(el, lazy),
    debounce: false,
    afterListen: (e: Event, lazyKeyElSetMap: Map<string, Set<ExtHTMLElement>>, lazyKeyVmSetMap: Map<string, Set<ExtComponentPublicInstance>>) => console.log(e, lazyKeyElSetMap, lazyKeyVmSetMap)
  })
  .mount('#app')
