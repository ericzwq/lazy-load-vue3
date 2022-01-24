# lazy-load-vue3

## A lazy loading plugin based on vue3. Load when element is visible.

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

<div style="text-align: left">

| key              | description                                                                                                                                                                                                                                                                                                                                                                                                                             | default   | type                                                     |
|------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|----------------------------------------------------------|
| src              | The real image URL                                                                                                                                                                                                                                                                                                                                                                                                                      | -         | string                                                   |
| loadedClassList  | List of class names for loaded state                                                                                                                                                                                                                                                                                                                                                                                                    | -         | string                                                   |
| loading          | The image URL of the loading and waitingLoad state                                                                                                                                                                                                                                                                                                                                                                                      | -         | string                                                   |
| loadingClassList | List of class names for loading and waitingLoad state                                                                                                                                                                                                                                                                                                                                                                                   | []        | string[]                                                 |
| error            | The image URL of the error state                                                                                                                                                                                                                                                                                                                                                                                                        | -         | string                                                   |
| errorClassList   | List of class names for error state                                                                                                                                                                                                                                                                                                                                                                                                     | []        | string[]                                                 |
| onError   | Hook for image loading failure, the type DirectiveConfig is this element's config                                                                                                                                                                                                                                                                                                                                                       | -         | function(el: HTMLElement, config: DirectiveConfig): void |
| onLoad   | Hook for image loading complete                                                                                                                                                                                                                                                                                                                                                                                                         | -         | function(el: HTMLElement, config: DirectiveConfig): void                                                 |
| lazyKey          | When there are multiple scrolling elements (such as two tables on one page), in order to improve the update efficiency, they can be marked with different keys. Of course you can ignore him. But if it is enabled, please **strictly** distinguish different keys, otherwise the update may fail. **Remember, this is a dangerous operation if you don't know how to use it.** If you only have one form, then you can just ignore it. | 'default' | string                                                   |

</div>

## The installation options are as follows

<div style="text-align: left">

| key                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | default | type                         |
|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:--------|:-----------------------------|
| **<span style="color: red;">*sorted</span>**                                                                                                                                                                                                                                                                                                                                                                                                                                       | Whether all lazy loaded elements are ordered from top to bottom.                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | true    | boolean                      |
| *debounce                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Whether it is necessary to actively trigger another monitoring within a certain period of time after each scrolling (config.timeout + 50) (some special cases may cause individual elements in the view to fail to trigger the update, as a backup solution, generally not used arrive)                                                                                                                                                                                                                                                   | false   | boolean                      |
| *afterListen                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Hook that fires every time the listener completes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | -       | function(event: Event): void |
| component                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Whether to register the lazy component, If on, **                                                                                                                                                                                                                                                     lazy-components** can be used                                                                                                                                                                                                       | false                                                                                                                                                                                                                                                                                                 | boolean                      |
| preLoad                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | The range of the preload distance when scrolling, calculated by multiplying the current scroll distance by this value                                                                                                                                                                                                                                                                                                                                                                                                                     | 0.3     | number                       |
| timeout                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Throttling interval(unit:milliseconds)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 200     | number                       |
| loadedClassList                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Same as command, **and the priority is lower than theinstructionmethod**                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | []      | string[]                     |
| loading                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Same as command                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | -       | string                       |
| loadingClassList                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Same as command                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | []      | string[]                     |
| error                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Same as command                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | -       | string                       |
| errorClassList                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Same as command                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | []      | string[]                     |
| onError                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Same as command                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | -       | function                     |
| onLoad                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Same as command                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | -       | function                     |

</div>

As for lazy-component, it looks like this:

```vue

<template>
  <lazy-component>
    <some-componet/>
  </lazy-component>
</template>
```

You can specify a loading slot to show when the element is waiting to load or is loading.

```vue

<template>
  <lazy-component>
    <some-componet/>
    <template #loading>
      <span>loading...</span>
    </template>
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
    <tr>...</tr>
    <tr>...</tr>
    <tr>...</tr>
    <tr>...</tr>
  </table>

  <table>
    <tr>
      <td>
        <!--    The keys of the same scroll ancestor should be the same    -->
        <img v-lazy="URL" lazy-key="table2"/>
      </td>
      <td>
        <lazy-component lazy-key="table2">
          <some-componet2/>
        </lazy-component>
      </td>
    </tr>
    <tr>...</tr>
    <tr>...</tr>
    <tr>...</tr>
    <tr>...</tr>
  </table>
</template>
```

The components have strong scalability, and you can define advanced functions yourself.

## <span style="color: red">Better</span>

In general, if your lazy loaded elements (including instructions) are placed in a simple (get data and display) list, then all lazy loaded elements are theoretically ordered when registering
listeners, at this time we can reduce some Unnecessary monitoring, such as: my list has 1000 elements, but only a few dozen need to trigger the update display each time I scroll, obviously we do not
need to check whether these 1000 elements are in the view, but I only need to know a certain When the element is not in the view, the element behind him is definitely not in the view (in the case of
ordered elements), so the latter check is not necessary, I think it is necessary to save these performance, so I strongly recommend you to use him , of course, if you are not sure whether these
elements are registered in order, please set sorted to false, sorted defaults to true. **You can freely change the sorted in config later, it will take effect dynamically.**

## Exposed
<div style="text-align: left">

| key      | description                                                                   |
|----------|-------------------------------------------------------------------------------|
| config   | The global configuration when registering the plugin, you can modify it later |
| listener | Listener to manually force a check to be triggered                            |
| default  | Whole plugin                                                                  |

</div>

As for listener, you can just call such as listener(). You can pass a boolean value to the listener to specify whether your manual listener is checked in an ordered manner. This parameter will not
change the sorted order of the original config.

## 1.2.6 Changelog
1. Parameter default value judgment modification.
2. Add sorted way check.
3. Debounce from default on to configuration.
4. Add afterListen hook.

### If you have any questions, please add an issue on. Life is better with you

https://github.com/ericzwq/lazy-load-vue3
