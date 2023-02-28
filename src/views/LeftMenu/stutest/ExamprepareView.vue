<template>
  <div class="box">
    <div class="contentBox">
      <el-page-header @back="goBack">
        <template #content>
          <span class="text-large font-600 mr-3">{{testData.title}}</span>
        </template>
      </el-page-header>
      <p class="line"></p>
      <div style="height: 180px;display: flex;justify-content: space-around; align-items: center;">
        <div>
          <p class="titletop">题目数量</p>
          <p class="titlebot">{{testData.subjectnum}}题</p>
        </div>
        <div>
          <p class="titletop">考试时长</p>
          <p class="titlebot">{{testData.limittime}}min</p>
        </div>
        <div>
          <p class="titletop">考试总分</p>
          <p class="titlebot">{{testData.scores}}分</p>
        </div>
        <div>
          <p class="titletop">通过分数</p>
          <p class="titlebot">{{testData.pastscores}}分</p>
        </div>
      </div>
      <div class="btn">
        <el-button  type="primary">开始考试</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter,useRoute } from 'vue-router';
import {onMounted,reactive,toRefs} from 'vue'
import {testGet} from '../../../api/admin'
import { ElMessage } from 'element-plus'
const router=useRouter()
const route=useRoute()

const goBack = () => {
  console.log('go back');
  router.push('stutest')
};

interface Idata{
  testData:any
}
const data:Idata=reactive({
  testData:{}
})
const {testData} = toRefs(data)

onMounted(() => {
  getList();
});

const getList=async()=>{
  let res: any = await testGet(route.query.id);
  console.log('根据id获取单个考试信息', res);
  if(res.errCode!==10000){
    ElMessage.error(res.errMsg)
    return false
  }
  data.testData=res.data
}
</script>

<style lang="less" scoped>
.box {
  height: 100vh;
  background: url('../../../assets/images/testGetbjt.jpg') no-repeat;
  background-size: cover;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.contentBox {
  width: 650px;
  height: 280px;
  padding: 50px 60px;
  background-color: #fff;
  .line {
    margin-top: 25px;
    border-bottom: 1px solid #e7e4e4;
  }
}
.titletop {
  color: #999b9d;
  font-size: 14px;
  text-align: center;
}
.titlebot {
  font-size: 32px;
  margin-top: 5px;
}
.btn{
  
  display: flex;
  justify-content: center;
  .el-button{
    width: 240px;
  height: 45px;
  }
}
</style>
