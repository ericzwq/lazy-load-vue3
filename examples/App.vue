<template>
  <img style="width: 50px;height: 50px" v-lazy="'https://upfile2.asqql.com/upfile/hdimg/wmtp/wmtp/2015-12/30/9835VicmIhquvD.jpg'" v-if="show"/>
  <button style="padding: 8px;cursor: pointer; background: aqua;border: none;border-radius: 4px" @click="click">{{ show ? 'hidden' : 'show' }}</button>
  <Test/>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import Test from './Test.vue'

export default defineComponent({
  name: 'App',
  components: {
    Test
  },
  setup() {
    const show = ref(false)

    function click() {
      show.value = !show.value
    }

    return {
      show,
      click
    }
  }
});
</script>
