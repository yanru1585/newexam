<template>
  <el-drawer v-model="drawer" :title='data.name' size="50%">
    
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref , reactive, onMounted,defineProps} from 'vue'
import {IQuestion} from '../../../api/admin'

const a = defineProps({
  dda:{
    type:Object,
    required:true
  }
})
// console.log(a.dda);

// 抽屉
const drawer = ref(true)

// 渲染数据
interface Iquestion{
  testid:any,
  studentid:any,
  list:Array<any>
  name:any
}
const data:Iquestion = reactive({
  testid:a.dda.ids,
  studentid:a.dda.id,
  list:[],
  name:a.dda.name
})
// 获取列表
const getIQuestion =async ()=>{
  const res = await IQuestion(data.studentid,data.testid)
  console.log(res);
  data.list = res.data.list
}
onMounted(()=>{
  getIQuestion()
})






</script>