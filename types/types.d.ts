import { ComponentPublicInstance } from 'vue';
export interface BaseConfig {
    error: string;
    loading: string;
    errorClassList: Array<string>;
    loadingClassList: Array<string>;
    loadedClassList: Array<string>;
    onError?: (el: ExtHTMLElement, lazy: DirectiveConfig) => void;
    onLoad?: (el: ExtHTMLElement, lazy: DirectiveConfig) => void;
    watchUpdate: boolean;
}
export interface Config extends BaseConfig {
    timeout: number;
    preLoad: number;
    component: boolean;
    sorted: boolean;
    debounce: boolean;
    afterListen?: (event: Event | undefined, lazyElMap: Map<string, Set<ExtHTMLElement>>, lazyVmMap: Map<string, Set<ExtComponentPublicInstance>>) => void;
}
export declare type LazyOptions = Partial<Config>;
export interface DirectiveConfig extends BaseConfig {
    lazyKey: string;
    src: string;
}
export interface ExtComponentPublicInstance extends ComponentPublicInstance {
    isLoaded: boolean;
    $props: {
        lazyKey: string;
        watchUpdate: boolean;
    };
}
export interface ExtHTMLElement extends HTMLElement {
    lazy?: DirectiveConfig;
}
export declare type Vm_El = ExtComponentPublicInstance | ExtHTMLElement;
export declare const enum Status {
    waitingLoad = "waitingLoad",
    loading = "loading",
    error = "error",
    loaded = "loaded"
}
export declare const enum ViewStatus {
    in = 0,
    notIn = 1,
    noView = 2
}
