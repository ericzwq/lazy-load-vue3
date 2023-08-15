import {App} from "vue";
import LazyComponent from "./LazyComponent";
import {LazyOptions} from "./types";
import LazyDirective from "./LazyDirective";
import {baseConfig, config, directiveConfig} from "./listen";

export {listener, config} from './listen'

export default {
  install(app: App, options: LazyOptions = {}): void {
    let v
    Object.keys(baseConfig).forEach(k => (v = options[k]) !== undefined && ((baseConfig[k] as typeof v) = v))
    Object.keys(config).forEach(k => (v = options[k]) !== undefined && ((config[k] as typeof v) = v))
    Object.assign(directiveConfig, baseConfig)
    if (config.component) app.component('lazy-component', LazyComponent)
    app.directive('lazy', LazyDirective)
  }
}