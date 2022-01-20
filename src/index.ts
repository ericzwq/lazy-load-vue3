import {App} from "vue";
import LazyComponent from "./LazyComponent";
import {LazyOptions, LooseObject} from "./types";
import LazyDirective from "./LazyDirective";
import {baseConfig, config, directiveConfig} from "./listen";

export {listener, config} from './listen'

type OptionsKey = keyof LazyOptions

export default {
  install(app: App, options: LazyOptions = {}): void {
    Object.keys(baseConfig).forEach(k => options[k as OptionsKey] && ((baseConfig as LooseObject)[k] = options[k as OptionsKey]))
    Object.keys(config).forEach(k => options[k as OptionsKey] && ((config as LooseObject)[k] = options[k as OptionsKey]))
    Object.assign(directiveConfig, baseConfig)
    if (config.component) app.component('lazy-component', LazyComponent)
    app.directive('lazy', LazyDirective)
  }
}
