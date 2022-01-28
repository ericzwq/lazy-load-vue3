<template>
  <div style="height: 100vh; overflow:auto;">
    <div>
      <div style="height: 200px"></div>
      <el-tooltip content="<p>The content can be <strong>HTML</strong></p>" raw-content>
        <template #content>
          <img style="height: 300px;width: 300px" v-lazy="{src: 'sadfa', error: 'https://upfile2.asqql.com/upfile/hdimg/wmtp/wmtp/2015-12/30/9835VicmIhquvD.jpg'}"/>
        </template>
        <el-button>hover me</el-button>
      </el-tooltip>
      <!--    <img style="width: 100px;height: 100px" v-show="show" v-lazy="'https://upfile2.asqql.com/upfile/hdimg/wmtp/wmtp/2015-12/30/9835VicmIhquvD.jpg'"/>-->
      <div v-show="num > 4">div</div>
      <el-table :data="tableData" style="width: 100%" max-height="400" size="large" class="table2">
        <el-table-column fixed type="index" width="50"></el-table-column>
        <el-table-column width="100">
          <template v-slot>
            <lazy-component lazy-key="table1" watch-update>
              <div>div</div>
              <template #loading>
                <span>load...</span>
              </template>
            </lazy-component>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="Date" width="150"/>
        <el-table-column prop="name" label="Name" width="120"/>
        <el-table-column prop="state" label="State" width="120"/>
        <!--      <el-table-column prop="city" sortable label="City" width="420"/>-->
        <el-table-column prop="address" label="Address" width="400"/>
        <!--      <el-table-column prop="img" label="Address" width="300"/>-->
        <el-table-column prop="img" label="Address" width="100">
          <template v-slot="{ row, $index }">
            <img v-lazy="{src: $index % 2 === 0 ? row.img : 'un', lazyKey: 'table1',
            loading: 'https://upfile2.asqql.com/upfile/hdimg/wmtp/wmtp/2015-12/30/9835VicmIhquvD.jpg', loadingClassList: ['lo' + $index],
            onError:(el) => el.style.background = 'red'}" style="display: block;height: 40px;width: 40px"/>
          </template>
        </el-table-column>
        <el-table-column label="Operations" width="120">
          <template v-slot="{ row, $index }">
            <!--          <span :row="row" :index="$index"></span>-->
            <lazy-component :row="row" out="2" :index="$index" :lazy-key="'table1'">
              <View2 :d="$index"/>
              <template #loading>
                <div style="height: 40px" loading>loading</div>
              </template>
            </lazy-component>
          </template>
        </el-table-column>
      </el-table>
      <div style="height: 100px;background: red" @click="click">1</div>
      <div style="height: 700px"></div>
      <el-table :data="tableData" style="width: 100%" max-height="400" size="large">
        <el-table-column fixed prop="date" label="Date" width="150"/>
        <el-table-column prop="name" label="Name" width="120"/>
        <el-table-column prop="state" label="State" width="120"/>
        <el-table-column prop="city" label="City" width="120"/>
        <el-table-column prop="address" label="Address" width="500"/>
        <el-table-column label="Operations" width="120">
          <template v-slot="{ $index }">
            <lazy-component :lazy-key="'table2'" :index="$index + 13">Lazy</lazy-component>
          </template>
        </el-table-column>
      </el-table>
      <lazy-component ref="lazyRef" :watch-update="num">
        <div></div>
      </lazy-component>
      <img style="width: 100px;height: 100px" id="img" v-lazy="{src: 'https://upfile2.asqql.com/upfile/hdimg/wmtp/wmtp/2015-12/30/9835VicmIhquvD.jpg', lazyKey: 'body'}"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, onUpdated, ref} from 'vue'
import View2 from "./View2.vue";
import {config, listener} from "../src/index";

const show = ref(false)
const tableData = ref([
  {
    date: '2016-05-03',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
    img: 'https://v3.cn.vuejs.org/logo.png'
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
    img: 'https://v3.cn.vuejs.org/logo.png'
  }
])
const num = ref(5)
Array.from({length: 6}).forEach(() => tableData.value.push(...tableData.value))

function click() {
  // tableData.value = tableData.value.sort(() => Math.random() - .5)
  // num.value = 5 + Math.random()

  test()
  function test() {
    let el = document.getElementById('img'), t = Date.now()
    for (let i = 0; i < 100000; i++) {
      // window.getComputedStyle(el).display
      el.computedStyleMap().get('display')
    }
    console.log(Date.now() - t)
  }
}

onUpdated(() => console.error('updated'))
onMounted(() => {
//
})
</script>

<style>
body, html {
  height: 100vh;
  overflow: hidden;
}
</style>
