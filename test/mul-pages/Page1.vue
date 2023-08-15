<template>
  <button @click="show = !show">change show</button>
  <button @click="changeSort">change sort</button>
  <button @click="changeData">change data</button>
  <table v-show="show" style="width: 100%;margin-top: 100px;max-height: 300px;display: block;overflow:scroll;min-width: 1500px">
    <tr>
      <td>index</td>
      <td>lazy-component</td>
      <td>date</td>
      <td>adress</td>
      <td>Operations</td>
    </tr>
    <tr v-for="(row, $index) of tableData" :key="row.id">
      <td type="index" width="100">{{ $index }}</td>
      <td width="200">
        <!--        <div>{{ row.a + 1 }}</div>-->
        <lazy-component lazy-key="table1">
          <div v-if="row.flag" style="color: red">div-{{ row.id }}-{{ row.loaded }}</div>
          <div v-else style="color: aqua">div-{{ row.id }}-{{ row.loaded }}</div>
          <template #loading>
            <span>load...</span>
          </template>
        </lazy-component>
      </td>
      <td width="800">{{ row.date }}</td>
      <td width="100">
        <!--        <div>{{ row.a + $index }}</div>-->
        <img :id="row.id" v-lazy="{src: $index % 2 === 0 ? row.src : '__', id: row.id,
                                        loading: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.6dhCi0vkKzEP3qg3NAK5wQAAAA?w=180&h=180&c=7&r=0&o=5&pid=1.7', loadingClassList: ['loading' + $index], loadedClassList: [row.loaded],
                                        errorClassList: ['error', row.error],
                                        lazyKey: 'cd',
                                        onError:(el) => el.style.background = 'red'}"/>
      </td>
      <td width="120">
        <lazy-component :id="row.id" :key="row.id" lazyKey="table2">
          <div v-if="!row.hidden" :style="{color: $index % 2 === 0 ? 'red' : 'blue'}">Operations{{ row.id }}</div>
          <template #loading>
            <div style="height: 40px">loading{{ row.id }}</div>
          </template>
        </lazy-component>
      </td>
    </tr>
  </table>

  <table v-show="show" style="width: 100%;margin-top: 100px;max-height: 300px;display: block;overflow:scroll;min-width: 1500px">
    <tr>
      <td>index</td>
      <td>lazy-component</td>
      <td>date</td>
      <td>adress</td>
      <td>Operations</td>
    </tr>
    <tr v-for="(row, $index) of tableData" :key="row.id">
      <td type="index" width="100">{{ $index }}</td>
      <td width="200">
        <!--        <div>{{ row.a + 1 }}</div>-->
        <lazy-component lazyKey="table3">
          <div v-if="row.flag" style="color: red">div-{{ row.id }}-{{ row.loaded }}</div>
          <div v-else style="color: aqua">div-{{ row.id }}-{{ row.loaded }}</div>
          <template #loading>
            <span>load...</span>
          </template>
        </lazy-component>
      </td>
      <td width="800">{{ row.date }}</td>
      <td width="100">
        <!--        <div>{{ row.a + $index }}</div>-->
        <img :id="row.id" v-lazy="{src: $index % 2 === 0 ? row.src : '__', id: row.id,
                                        loading: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.6dhCi0vkKzEP3qg3NAK5wQAAAA?w=180&h=180&c=7&r=0&o=5&pid=1.7', loadingClassList: ['loading' + $index], loadedClassList: [row.loaded],
                                        errorClassList: ['error', row.error],
                                        lazyKey: 'cd2',
                                        onError:(el) => el.style.background = 'red'}"/>
      </td>
      <td width="120">
        <lazy-component :id="row.id" :key="row.id" lazy-key="table4">
          <div v-if="!row.hidden" :style="{color: $index % 2 === 0 ? 'red' : 'blue'}">Operations{{ row.id }}</div>
          <template #loading>
            <div style="height: 40px">loading{{ row.id }}</div>
          </template>
        </lazy-component>
      </td>
    </tr>
  </table>
</template>

<script lang="ts" setup>
import {ref} from "vue";

const show = ref(false)
const originData = [
  {
    id: 0,
    date: '2016-05-03',
    src: 'data:image/jpeg;base64,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',
    error: 'error',
    loaded: 'loaded'
  },
  {
    id: 1,
    date: '2016-05-02',
    src: 'data:image/jpeg;base64,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',
    error: 'error',
    loaded: 'loaded'
  }
]
const tableData = ref(JSON.parse(JSON.stringify(originData)))
Array.from({length: 9}).forEach(() => tableData.value.push(...tableData.value))
tableData.value = JSON.parse(JSON.stringify(tableData.value))
tableData.value.forEach((v, i) => v.id = i)

const changeSort = () => {
  tableData.value.sort((v) => 0.5 - Math.random())
}

let srcIndex = 0
const changeData = () => {
  const srcList = ['https://ts1.cn.mm.bing.net/th?id=OIP-C.G5m45gb0F1xFl8Q0WGxrEQHaEo&w=316&h=197&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2', 'https://ts3.cn.mm.bing.net/th?id=OIP-C.E6m4s0dlHQhce_kPus5WJAHaEo&w=316&h=197&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2']
  const data = JSON.parse(JSON.stringify(originData))
  Array.from({length: 4}).forEach(() => tableData.value.push(...data))
  tableData.value = JSON.parse(JSON.stringify(tableData.value))
  // const plus = Math.floor(Math.random() * 1000 + 100)
  const plus = Math.floor(Math.random() * 10)
  tableData.value.forEach((v, i) => {
    v.id = i + plus
    v.src = srcList[srcIndex]
  })
  ++srcIndex === srcList.length && (srcIndex = 0)
}

// Test update when some elements hidden.
/*onMounted(() => {
  setTimeout(() => {
    console.log('hidden some elements')
    tableData.value.forEach(v => {
      v.hidden = Math.random() > 0.5
    })
  }, 3000)
})*/
</script>

<style scoped>
[class^="loading"] {
  display: block;
  width: 40px;
  height: 40px;
}

.loaded, .error {
  display: block;
  width: 60px;
  height: 60px;
}

</style>