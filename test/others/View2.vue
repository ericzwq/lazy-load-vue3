<template>
  <div v-if="flag" style="color: red">view-{{id}}-{{loaded}}</div>
  <div v-else style="color: blue">view-{{id}}-{{loaded}}</div>
</template>

<script lang="js">
import {defineComponent, getCurrentInstance, onMounted} from "vue";

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'view2',
  props: ['flag', 'id', 'loaded'],
  setup(props, {attrs}) {
    // console.log('view2', props, attrs)
    onMounted(() => {
      // const el = getCurrentInstance().proxy.$el
    })
  }
})
</script>

<style scoped>

</style>
