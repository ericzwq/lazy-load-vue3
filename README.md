# lazy-load-vue3

## A lazy loading plugin based on vue3.

## Install

```sh
$ npm i lazy-load-vue3 -S
```

## Quick Start

main.js

```js
import {createApp} from 'vue'
import LazyLoad from 'lazy-load-vue3'
import App from './App.vue'

const app = createApp(App)
app.use(LazyLoad, {component: true}).mount('#app')
```

App.vue:

```vue

<template>
  <table>
    <tr>
      <td>
        <img v-lazy="'https://v3.cn.vuejs.org/logo.png'"/>
        <!--    or    -->
        <img v-lazy="{src: 'https://v3.cn.vuejs.org/logo.png', loadingClassList: ['loading']}"/>
      </td>
    </tr>
  </table>
</template>
```

## The complete command options are as follows

| key              | description                                                                                                                                                                                                                                                                                        | default   | type                                                     |
|------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|----------------------------------------------------------|
| src              | The real image URL                                                                                                                                                                                                                                                                                 | -         | string                                                   |
| loadedClassList  | List of class names for loaded state                                                                                                                                                                                                                                                               | -         | string                                                   |
| loading          | The image URL of the loading and waitingLoad state                                                                                                                                                                                                                                                 | -         | string                                                   |
| loadingClassList | List of class names for loading and waitingLoad state                                                                                                                                                                                                                                              | []        | string[]                                                 |
| error            | The image URL of the error state                                                                                                                                                                                                                                                                   | -         | string                                                   |
| errorClassList   | List of class names for error state                                                                                                                                                                                                                                                                | []        | string[]                                                 |
| onError   | Hook for image loading failure, the type DirectiveConfig is this element's config                                                                                                                                                                                                                  | -         | function(el: HTMLElement, config: DirectiveConfig): void |
| onLoad   | Hook for image loading complete                                                                                                                                                                                                                                                                    | -         | function(el: HTMLElement, config: DirectiveConfig): void                                                 |
| lazyKey          | When there are multiple scrolling elements (such as two tables on one page), in order to improve the update efficiency, they can be marked with different keys. Of course you can ignore him. But if it is enabled, please **strictly** distinguish different keys, otherwise the update may fail. | 'default' | string                                                   |

## The install options are as follows


| key              | description                                                                                                           | default | type     |
|------------------|-----------------------------------------------------------------------------------------------------------------------|---------|----------|
| component        | Whether to register the lazy component, If on, **lazy-components** can be used                                                                                | false   | boolean  |
| preLoad          | The range of the preload distance when scrolling, calculated by multiplying the current scroll distance by this value | 0.3     | number   |
| timeout          | Throttling interval(unit:milliseconds)                                                                                | 200     | number   |
| loadedClassList          | Same as command, **and the priority is lower than the instruction method**                | []      | string[] |
| loading          | Same as command                | -       | string   |
| loadingClassList | Same as command                                                                                                       | []      | string[] |
| error            | Same as command                                                                                                       | -       | string   |
| errorClassList   | Same as command                                                                                                       | []      | string[] |
| onError   | Same as command                                                                                                       | -       | function |
| onLoad   | Same as command                                                                                                       | -       | function |

As for lazy-component, it looks like this:

```vue
<template>
  <lazy-component>
    <some-componet/>
  </lazy-component>
</template>
```

You can also give lazy-component a lazyKey like a directive, it looks like this:

```vue
<template>
  <table>
    <tr>
      <td>
        <lazy-component lazy-key="table1">
          <some-componet1/>
        </lazy-component>
      </td>
    </tr>
  </table>
  
  <table>
    <tr>
      <td>
        <lazy-component lazy-key="table2">
          <some-componet2/>
        </lazy-component>
      </td>
    </tr>
  </table>
</template>
```

The components have strong scalability, and you can define advanced functions yourself.

## Exposed


| key      | description                                                                                                           |
|----------|-----------------------------------------------------------------------------------------------------------------------|
| config   | The global configuration when registering the plugin, you can modify it later                                                                                |
| listener | Listener to manually force a check to be triggered |

As for listener, you can just call such as listener()

### If you have any questions, please add an issue on
https://github.com/ericzwq/lazy-load-vue3
