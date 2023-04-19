import {defineComponent, h, nextTick, ref} from "vue";
import {addComponentRecords} from "./listen";
import {ExtComponentPublicInstance} from "./types";

export default defineComponent({
  render() {
    if (!this.isLoaded) {
      nextTick().then(() => addComponentRecords(this as ExtComponentPublicInstance))
      return this.$slots.loading ? h('div', this.$slots.loading()) : h('div')
    } else {
      return this.$slots.default ? h(this.$slots.default) : h('div')
    }
  },
  props: ['lazyKey'],
  setup() {
    return {
      isLoaded: ref(false)
    }
  }
})
