import { ComponentPublicInstance } from 'vue';
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
    component: boolean;
    debounce: boolean;
    afterListen?: (event: Event | undefined, lazyKeyElSetMap: Map<string, Set<ExtHTMLElement>>, lazyKeyVmSetMap: Map<string, Set<ExtComponentPublicInstance>>) => void;
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
    };
}
export interface ExtHTMLElement extends HTMLElement {
    lazy: DirectiveConfig;
    __isLoaded?: boolean;
}
export declare type Vm_El = ExtComponentPublicInstance | ExtHTMLElement;
export declare const enum ViewStatus {
    in = 0,
    notIn = 1,
    below = 2,
    higher = 3,
    horizontalHide = 4,
    noView = 5
}
export interface UpdateInfo<T extends Vm_El> {
    tempSet: Set<T>;
    timer: number;
    sort: boolean;
}
