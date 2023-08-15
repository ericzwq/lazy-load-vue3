<template>
  <header>
    <button @click="toPage1">to page1</button>
    <button @click="toPage2">to page2</button>
    <p>{{ route }}</p>
  </header>
  <Page1 v-if="route === 'page1'"/>
  <Page2 v-if="route === 'page2'"/>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import Page1 from './Page1.vue'
import Page2 from './Page2.vue'

const route = ref('page1')

function toPage1() {
  route.value = 'page1'
}

function toPage2() {
  route.value = 'page2'
}
</script>

<style>
body, html {
  height: 100vh;
  /*overflow: hidden;*/
}

header {
  margin-top: 100px;
  margin-left: 50px;
}
</style>