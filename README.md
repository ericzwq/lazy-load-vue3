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

## <span id="command">Command Options</span>

<div style="text-align: left">

| key                                        | description                                                                                                                                                                                                                                                                                                                                                                                                                                | default   | type                                                     |
|:-------------------------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:----------|:---------------------------------------------------------|
| src                                        | The real image URL                                                                                                                                                                                                                                                                                                                                                                                                                         | -         | string                                                   |
| loadedClassList                            | List of class names for loaded state                                                                                                                                                                                                                                                                                                                                                                                                       | -         | string                                                   |
| loading                                    | The image URL of the loading and waitingLoad state                                                                                                                                                                                                                                                                                                                                                                                         | -         | string                                                   |
| loadingClassList                           | List of class names for loading and waitingLoad state                                                                                                                                                                                                                                                                                                                                                                                      | []        | string[]                                                 |
| error                                      | The image URL of the error state                                                                                                                                                                                                                                                                                                                                                                                                           | -         | string                                                   |
| errorClassList                             | List of class names for error state                                                                                                                                                                                                                                                                                                                                                                                                        | []        | string[]                                                 |
| onError                                    | Hook for image loading failure, the type DirectiveConfig is this element's config                                                                                                                                                                                                                                                                                                                                                          | -         | function(el: HTMLElement, config: DirectiveConfig): void |
| onLoad                                     | Hook for image loading complete                                                                                                                                                                                                                                                                                                                                                                                                            | -         | function(el: HTMLElement, config: DirectiveConfig): void |
| lazyKey                                    | When there are multiple scrolling lists on the same page, set different values to differentiate. <span style="color: red;">Otherwise, it may cause the update to fail</span>                                                                                                                                                                                                                                                               | 'default' | string                                                   |

</div>

## <span id="instation">Installation Options<span>

<div style="text-align: left">

| key                                         | description                                                                                                                                                                                                                                                                             | default | type                         |
|:--------------------------------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:--------|:-----------------------------|
| debounce                                    | Is it necessary to actively trigger another monitoring (config. timeout+50) within a certain period of time after each scrolling (some special circumstances may cause individual elements in the view to be unable to trigger updates, such as the height of the loading component being higher than the height of the real component) | false   | boolean                      |
| afterListen                                 | Hook that fires every time the listener completes                                                                                                                                                                                                                                       | -       | function(event: Event, lazyKeyElSetMap: Map<string, Set<ExtHTMLElement>>, lazyKeyVmSetMap: Map<string, Set<ExtComponentPublicInstance>>): void |
| component                                   | Whether to register the lazy component, If on, **lazy-components** can be used                                                                                                                                                                                                          | false   | boolean                      |
| timeout                                     | Throttling interval(unit:milliseconds)                                                                                                                                                                                                                                                  | 200     | number                       |
| loadedClassList                             | Same as command, **and the priority is lower than the <a href="#command">Command Options</a>**                                                                                                                                                                                          | []      | string[]                     |
| loading                                     | Same as command and ditto                                                                                                                                                                                                                                                               | -       | string                       |
| loadingClassList                            | Same as command and ditto                                                                                                                                                                                                                                                               | []      | string[]                     |
| error                                       | Same as command and ditto                                                                                                                                                                                                                                                               | -       | string                       |
| errorClassList                              | Same as command and ditto                                                                                                                                                                                                                                                               | []      | string[]                     |
| onError                                     | Same as command and ditto                                                                                                                                                                                                                                                               | -       | function                     |
| onLoad                                      | Same as command and ditto                                                                                                                                                                                                                                                               | -       | function                     |

</div>


### As for lazy-component, it looks like this:

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
  <div class="container">
    <table>
      <tr>
        <td>
          <lazy-component lazy-key="column1">
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
          <img v-lazy="URL" lazy-key="column2"/>
        </td>
        <td>
          <lazy-component lazy-key="column3">
            <some-componet2/>
          </lazy-component>
        </td>
      </tr>
      <tr>...</tr>
      <tr>...</tr>
      <tr>...</tr>
      <tr>...</tr>
    </table>
  </div>
</template>
```

The components have strong scalability, and you can define advanced functions yourself.

## Component Attributes

<div style="text-align: left">

| key           | description                                                                                            | default   | type    |
|:--------------|:-------------------------------------------------------------------------------------------------------|:----------|:--------|
| lazy-key      | Same as command, **and the priority is higher than the <a href="#instation">Installation Options</a>** | 'default' | string  |

</div>

## Component Slots

<div style="text-align: left">

| name    | description                                                   |
|:--------|:--------------------------------------------------------------|
| default | The real element or component to display                      |
| loading | The element or component of the loading and waitingLoad state |

</div>

## Exposed

<div style="text-align: left">

| key      | description                                                                   |     |
|----------|-------------------------------------------------------------------------------|-----|
| config   | The global configuration when registering the plugin, you can modify it later |     |
| listener | Listener to manually force a check to be triggered                            |     |
| default  | Whole plugin                                                                  |     |

</div>

As for listener, you can just call such as `listener()`. You can pass a boolean value to the listener to specify whether your manual listener is checked in an ordered manner. This parameter will not
change the sorted order of the original config.

If there is an update exception, you can also call the listener to force sorting and update effectively, like this.

```js
import {listener} from 'lazy-load-vue3'

listener(undefined, true)
```

## <span style="color: red">Dangerous</span>
Do not hide the target element and lazy component of the instruction.

unsafe:
```vue
<template>
  <table v-for="item of list">
    <tr>
      <td>
        <!--   Don't use like this.     -->
        <lazy-component v-show="item.show">
          <template #loading>
            loading...
          </template>
          <div>{{item.content}}</div>
        </lazy-component>
      </td>
    </tr>
  </table>
</template>

<script setup lang="js">

const list = ref([])
for(let i = 0; i < 100; i++) {
    list.value[i] = {show: i % 2 === 0, content: 'content' + i}
}

</script>
```

safe:
```vue

<template>
  <table v-for="item of list">
    <tr>
      <td>
        <lazy-component>
          <template #loading>
            loading...
          </template>
          <!--    Use like this.      -->
          <div v-show="item.show">{{item.content}}</div>
        </lazy-component>
      </td>
    </tr>
  </table>
</template>

<script setup lang="js">

const list = ref([])
for (let i = 0; i < 100; i++) {
  list.value[i] = {show: i % 2 === 0, content: 'content' + i}
}

</script>
```

## 2.0.1 Changelog

1. Greatly optimized update performance.
2. Removed installation options for sorted, and preLoad.
3. Remove the watchUpdate of the directive.

## 1.3.0 Changelog

1. Remove the watchUpdate of the component.

## 1.2.9 Changelog

1. The lazy-key performance optimization.

## 1.2.8 Changelog

1. `afterListen` hook change parameters.

## 1.2.7 Changelog

1. Add `watchUpdate` option.
2. Monitoring logic optimization.
3. Fix some bugs

## 1.2.6 Changelog

1. Parameter default value judgment modification.
2. Add sorted way check.
3. Debounce from default on to configuration.
4. Add `afterListen` hook.

### If you have any questions, please add an issue on. Life is better with you

https://github.com/ericzwq/lazy-load-vue3
