<template>
  <div>
    <div class="top" @click="back">
      <el-icon><ArrowLeft /></el-icon>
      <p>返回</p>
      <span>丨</span>
      <span>{{route.query.title}}</span>
    </div>
    <el-form :inline="true" :model="data" class="demo-form-inline">
    <el-form-item label="考生姓名:">
      <el-input v-model="data.key" placeholder="请输入考试姓名" />
    </el-form-item>
    <el-form-item label="状态:">
      <el-select v-model="data.state" placeholder="全部">
        <el-option label="已阅卷" value="shanghai" />
        <el-option label="未阅卷" value="beijing" />
      </el-select>
    </el-form-item>
    <el-form-item label="部门:">
      <el-select  placeholder="请选择">
        <el-option label="已阅卷" value="shanghai" />
        <el-option label="未阅卷" value="beijing" />
      </el-select>
    </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { ISee } from '../../../api/admin';
import {
  ArrowLeft
} from '@element-plus/icons-vue';
import router from '../../../router';

const route = useRoute();
// console.log(route.query.id);

// 根据id渲染列表
interface Ise {
  page: number;
  psize: number;
  testid: any;
  state: string;
  key: string;
}
const data:Ise = reactive({
  page: 1,
  psize: 5,
  testid: route.query.id,       //传过来的id
  state: '',        //状态
  key: '',          //value值
});
// 获取列表
const getSee = async ()=>{
  const res = await ISee(data.page,data.psize,data.testid,data.state,data.key)
  console.log(res);
  
}
// 返回
const back=()=>{
  router.push('/exam')
}
onMounted(()=>{
  getSee()
})
</script>

<style scoped>
.top{
  width: 100%;
  height: 50px;
  display: flex;
  line-height: 50px;
  cursor:pointer;
}
.el-icon{
  margin-top: 16px;
  margin-right: 10px;
}
</style>
