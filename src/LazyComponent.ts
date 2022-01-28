import {defineComponent, getCurrentInstance, h, nextTick, onBeforeUnmount, onUpdated, ref} from "vue";
import {addComponentRecords, config, inViewPort, lazyVmMap, updateComponentVm} from "./listen";
import {ExtComponentPublicInstance, ViewStatus} from "./types";

export default defineComponent({
  render() {
    if (!this.isLoaded) {
      nextTick().then(() => addComponentRecords(this as ExtComponentPublicInstance))
      return this.$slots.loading ? h('div', this.$slots.loading()) : h('div')
    } else {
      return this.$slots.default ? h('div', this.$slots.default()) : h('div')
    }
  },
  props: ['lazyKey', 'watchUpdate'],
  setup(props) {
    onUpdated(() => {
      if (!(props.watchUpdate === undefined ? config.watchUpdate : props.watchUpdate !== false)) return
      const vm = getCurrentInstance()?.proxy as ExtComponentPublicInstance
      setTimeout(() => {
        if (vm.isLoaded) return // it's necessary
        if (inViewPort(vm?.$el) === ViewStatus.in) updateComponentVm(vm, true)
      })
    })
    onBeforeUnmount(() => lazyVmMap.forEach(vmSet => vmSet.delete(getCurrentInstance()?.proxy as ExtComponentPublicInstance)))
    const isLoaded = ref(false)
    return {
      isLoaded
    }
  }
})
