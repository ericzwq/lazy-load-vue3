import { ComponentPublicInstance } from "vue";
import { BaseConfig, ExtHTMLElement, Config, DirectiveConfig } from "./types";
export declare const parentElSet: Set<unknown>;
export declare const lazyVmMap: Map<string, Set<ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, import("vue").ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>>>>;
export declare const lazyElMap: Map<string, Set<ExtHTMLElement>>;
export declare const data: {
    componentTotal: number;
    directiveTotal: number;
    componentCount: number;
    directiveCount: number;
};
export declare const baseConfig: BaseConfig;
export declare const config: Config;
export declare const directiveConfig: DirectiveConfig;
export declare const listener: (event?: Event | undefined) => void;
export declare function inViewPort(el: HTMLElement): boolean;
export declare function updateDirectiveEl(el: ExtHTMLElement, targetElSet?: Set<ExtHTMLElement>): void;
export declare function addComponentRecords(vm: ComponentPublicInstance): void;
export declare function addDirectiveRecords(el: ExtHTMLElement, key: string): void;
