import {defineComponent, h, nextTick, ref} from "vue";
import {addComponentRecord} from "./listen";
import {ExtComponentPublicInstance} from "./types";

export default defineComponent({
  render() {
    const {isMounted} = this.$
    nextTick().then(() => addComponentRecord(this as ExtComponentPublicInstance, isMounted))
    if (!this.isLoaded) {
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