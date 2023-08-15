<template>
<!--  <img style="width: 50px;height: 50px" v-lazy="'https://tse3-mm.cn.bing.net/th/id/OIP-C.6dhCi0vkKzEP3qg3NAK5wQAAAA?w=180&h=180&c=7&r=0&o=5&pid=1.7'" v-if="show"/>-->
  <keep-alive>
    <alive-cmp v-if="showAliveCmp"/>
  </keep-alive>
  <button @click="toggleAliveCmp">toggle alive cmp</button>
  <button style="padding: 8px;cursor: pointer; background: aqua;border: none;border-radius: 4px" @click="click">{{ show ? 'hidden' : 'show' }}</button>
  <Test/>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import Test from './Test.vue'
import AliveCmp from "./AliveCmp.vue";

export default defineComponent({
  name: 'App',
  components: {
    AliveCmp,
    Test
  },
  setup() {
    const show = ref(false)
    const showAliveCmp = ref(true)

    function toggleAliveCmp() {
      showAliveCmp.value = !showAliveCmp.value
    }

    function click() {
      show.value = !show.value
    }

    return {
      show,
      click,
      toggleAliveCmp,
      showAliveCmp,
    }
  }
});
</script>
