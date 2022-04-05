import {createApp} from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// import LazyLoad, {config} from '~/lazy-load-vue3.esm.js'
import LazyLoad from '../src/index'
import App from './App.vue'

createApp(App).use(ElementPlus).use(LazyLoad, {
  component: true, onLoad: (el: HTMLElement, lazy: any) => 1, sorted: false, debounce: false, watchUpdate: false, afterListen: (e: Event, lazyElMap, lazyVmMap) => console.log(e, lazyElMap, lazyVmMap)
}).mount('#app')
