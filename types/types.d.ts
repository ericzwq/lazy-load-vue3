import { ComponentPublicInstance } from "vue";
export interface LooseObject {
    [k: string]: any;
}
export interface BaseConfig {
    error: string;
    loading: string;
    errorClassList: Array<string>;
    loadingClassList: Array<string>;
    loadedClassList: Array<string>;
    onError?: (el: ExtHTMLElement, lazy: DirectiveConfig) => void;
    onLoad?: (el: ExtHTMLElement, lazy: DirectiveConfig) => void;
}
export interface Config extends BaseConfig {
    timeout: number;
    preLoad: number;
    component: boolean;
}
export declare type LazyOptions = Partial<Config>;
export interface DirectiveConfig extends BaseConfig {
    lazyKey: string;
    src: string;
}
export interface ExtComponentPublicInstance extends ComponentPublicInstance {
    isLoaded: boolean;
}
export interface ExtHTMLElement extends HTMLElement {
    lazy?: DirectiveConfig;
}
export declare const enum Status {
    waitingLoad = "waitingLoad",
    loading = "loading",
    error = "error",
    loaded = "loaded"
}
