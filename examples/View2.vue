<template>
  <div>view</div>
</template>

<script lang="js">
import {defineComponent, getCurrentInstance, onMounted} from "vue";

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'view2',
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
