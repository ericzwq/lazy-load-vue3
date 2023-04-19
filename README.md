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
| lazyKey                                    | When there are multiple scrolling elements (such as two tables on one page), in order to improve the update efficiency, they can be marked with different keys. Of course you can ignore him. But if it is enabled, please **strictly** distinguish different keys, otherwise the update may fail. **Remember, this is a dangerous operation if you don't know how to useit.** If you only have one form, then you can just ignore it.     | 'default' | string                                                   |
| <span id="watchUpdate">watchUpdate</span> | Sometimes the list may hide some elements. When these elements are displayed, the update hook will be triggered. If watchUpdate is true, the lazy load monitoring will be performed after the update. However, due to the characteristics of vue update, if a row of data is updated, Then the rows of the entire table will enter the update hook, which may cause a lot of unnecessary waste, so it is not necessary to set it to false. | true      | boolean                                                  |

</div>

## watchUpdate
In some cases, it can be an important optimization tool, so it is necessary for you to understand it. There may be some lazy loaded elements in the same row in a list that are hidden (only some elements are displayed for the first time). The simplest example is a list in a table row. There are 10 elements in this list, but only 4 elements are displayed by default (the remaining elements are displayed). The display is none. If the rest is not rendered, it is not in line with this situation and can be ignored), click more to display all the content, then the next 6 elements will trigger an update, in these hidden elements It is not necessary to scroll and monitor these elements before displaying, because they are always hidden and never meet the rendering conditions. For elements like this, the plugin will automatically optimize, not add these elements to the element monitor list, but put them in the updated hook. watch it, so if you have lazy loaded elements that are partially hidden like this in your list, you should not set the watchUpdate option to false for those elements, otherwise the update will fail. If your list is not of this type, but simply displayed, then you can directly set it to false to reduce most of the unnecessary listening.

## <span id="instation">Installation Options<span>

<div style="text-align: left">

| key                                         | description                                                                                                                                                                                                                                                                             | default | type                         |
|:--------------------------------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:--------|:-----------------------------|
| sorted | Whether all lazy loaded elements are ordered from top to bottom. <a href="#better">Detail</a>                                                                                                                                                                                           | true    | boolean                      |
| debounce                                    | Whether it is necessary to actively trigger another monitoring within a certain period of time after each scrolling (config.timeout + 50) (some special cases may cause individual elements in the view to fail to trigger the update, as a backup solution, generally not used arrive) | false   | boolean                      |
| afterListen                                 | Hook that fires every time the listener completes                                                                                                                                                                                                                                       | -       | function(event: Event, lazyKeyElSetMap: Map<string, Set<ExtHTMLElement>>, lazyKeyVmSetMap: Map<string, Set<ExtComponentPublicInstance>>): void |
| component                                   | Whether to register the lazy component, If on, **lazy-components** can be used                                                                                                                                                                                                          | false   | boolean                      |
| preLoad                                     | The range of the preload distance when scrolling, calculated by multiplying the current scroll distance by this value                                                                                                                                                                   | 0.3     | number                       |
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

## <span style="color: red" id="better">Better</span>

In general, if your lazy loaded elements (including instructions) are placed in a simple (get data and display) list, then all lazy loaded elements are theoretically ordered when registering
listeners, at this time we can reduce some Unnecessary monitoring, such as: my list has 1000 elements, but only a few dozen need to trigger the update display each time I scroll, obviously we do not
need to check whether these 1000 elements are in the view, but I only need to know a certain When the element is not in the view, the element behind him is definitely not in the view and skip hidden elements(<a href="#watchUpdate">watchUpdate</a>) (in the case of
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
