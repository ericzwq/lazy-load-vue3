# lazy-load-vue3

## A lazy loading plugin based on vue3.

## Install

```sh
$ npm i lazy-load-vue3 -S
```

## Quick Start

main.js

```html
import {createApp} from 'vue'
import LazyLoad from 'lazy-load-vue3'
import App from './App.vue'

const app = createApp(App)
app.use(LazyLoad, {component: true}).mount('#app')
```

App.vue:

```html

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

| key              | description                           | default  | type   |
|------------------|---------------------------------------|----------|--------|
| src              | The real image URL                    | -        | string |
| loading          | The image URL of the loading state    | -        | string |
| loadingClassList | List of class names for loading state | []       | string[] |
| error            | The image URL of the error state      | -        | string |
| errorClassList   | List of class names for error state   | []       | string[] |
| lazyKey          | When there are multiple scrolling elements (such as two tables on one page), in order to improve the update efficiency, they can be marked with different keys   | 'default' | string |

## The install options are as follows


| key              | description                                                                                                           | default | type     |
|------------------|-----------------------------------------------------------------------------------------------------------------------|---------|----------|
| component        | Whether to register the lazy component, If on, **lazy-components** can be used                                                                                | false   | boolean  |
| preLoad          | The range of the preload distance when scrolling, calculated by multiplying the current scroll distance by this value | 0.3     | number   |
| timeout          | Throttling interval(unit:milliseconds)                                                                                | 200     | number   |
| loading          | Same as command, **and the priority is lower than the instruction method**                | -       | string   |
| loadingClassList | Same as command                                                                                                       | []      | string[] |
| error            | Same as command                                                                                                       | -       | string   |
| errorClassList   | Same as command                                                                                                       | []      | string[] |

## Exposed


| key      | description                                                                                                           |
|----------|-----------------------------------------------------------------------------------------------------------------------|
| config   | The global configuration when registering the plugin, you can modify it later                                                                                |
| listener | Listener to manually force a check to be triggered |

As for listener, you can just call such as listener()

### If you have any questions, please contact 1872757047@qq.com
