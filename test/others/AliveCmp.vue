<script setup lang="js">
import {onMounted, defineComponent} from "vue";

export default defineComponent({
  render() {
    console.log('render')
    return <div>alive cmp</div>
  },
  setup() {
    onMounted(() => console.log('alive amounted'))
  }
})
</script>

<style scoped>

</style>