<template>
  <div>
    <el-page-header @back="goBack">
    <template #content>
      <span class="text-large font-600 mr-3"> 数据分析：有阅卷的 </span>
    </template>
  </el-page-header>
  <div style="margin-top: 20px;">
    <span>总分：{{ AnalyseData.scores }}</span>
    <el-divider direction="vertical" style="margin: 0px 20px;"/>
    <span>通过分数：{{AnalyseData.pastscores  }}</span>
    <el-divider direction="vertical" style="margin: 0px 20px;"/>
    <span>考试时长：{{AnalyseData.limittime  }}分钟</span>
    <el-divider direction="vertical" style="margin: 0px 20px;"/>
    <span>考试时间：{{ AnalyseData.isshow===1?'时间不限':'限时'}}</span>
  </div>
  <Echat :passData="passData" :pieItems="pieItems"></Echat>
  <div class="line">
    <span>学员统计</span>
  </div>
  <el-form :inline="true" :model="seachData" class="demo-form-inline" style="width: 90%;margin-left: 2%;margin-top: 20px;">
    <el-form-item label="学员姓名">
      <el-input v-model="seachData.key" placeholder="考试名称" />
    </el-form-item>
    <el-form-item label="部门">
    <el-cascader v-model="seachData.depid" :options="options" @change="handleChange"  :props="props"/>
    </el-form-item>
    <el-form-item label="班级">
      <el-select v-model="seachData.classid"  placeholder="请选择" >
        <el-option v-for="item in classlist" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="状态">
      <el-select v-model="seachData.pass" placeholder="请选择">
        <el-option label="所有" value="1" />
        <el-option label="通过" value="2" />
        <el-option label="未通过" value="3" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="getSeach">查询</el-button>
      <el-button  @click="exportFile">导出</el-button>
    </el-form-item>
  </el-form>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="name" label="学员姓名"  align="center"/>
    <el-table-column prop="depname" label="部门"  align="center"/>
    <el-table-column prop="classname" label="班级" align="center"/>
    <el-table-column prop="scores" label="分数" align="center"/>
    <el-table-column prop="pass" label="通过情况" align="center" #default="scope">
      <span :style="scope.row.pass===1?'color:#67c23a':'color:#f56c6c'">{{ scope.row.pass===1?'通过':'未通过' }}</span>
    </el-table-column>
    <el-table-column prop="readtime" label="用时" align="center"/>
    <el-table-column prop="stuBeginTime" label="考试时间" align="center"/>
    <el-table-column prop="stuEndTime" label="交卷时间" align="center"/>
    <el-table-column fixed="right" label="操作"  align="center">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="getLook(scope.row.id)">查看</el-button>
      </template>
    </el-table-column>
  </el-table>
  </div>
  <student v-if="studentShow" @showEmit="showEmit"  :studentInfo="studentInfo"></student>

</template> 

<script setup lang="ts">
import {Downblob} from '../../../utils/down'
import student from '../../../components/test/StudentTest.vue'
import {departmentList} from '../../../api/department'
import Echat from '../../../components/test/EchatTest.vue'
import {onMounted,reactive,toRefs,ref} from 'vue'
import { useRoute,useRouter } from 'vue-router';
import{TextAnalyse,classeslist,testStudent} from '../../../api/admin'
import {studentExportExcel} from '../../../api/database'
const route=useRoute()
const router=useRouter()
// interface Istu{
//   testid:string,
//   studentid:string
// }
interface Idata{
  AnalyseData:any,
  passData:any,
  pieItems:any,
  options:any,
  props:any,
  classlist:Array<any>,
  tableData:Array<any>,
  seachData:any,
  studentShow:boolean,
  studentInfo:any

}
const data:Idata=reactive({

  studentShow:false,//控制显示隐藏
  AnalyseData:{},
  passData:{},
  pieItems:{},
  options :[],
  props:{
    value:'id',
    label:'name',
    children:'children',
    emitPath:false
  },
  classlist:[],
  tableData:[],
  seachData:{
    key:'',//搜索关键字
    depid:'',//部门id
    classid:'',//班级id
    pass:'',//是否通过
    testid:route.query.id,//试卷id
  },
  studentInfo:{
    testid:route.query.id,
    studentid:''
  }
 

})

const exportFile =async () => {
  const res:any=await studentExportExcel( route.query.id).catch(()=>{})
  Downblob(res,'成绩单.xlsx')
  console.log('导出',res)
}
const {AnalyseData,passData,pieItems,options,props,classlist,tableData,seachData,studentShow,studentInfo }=toRefs(data)
// 获取部门列表
const getDepartmentList=async ()=>{
  const res:any=await departmentList().catch(()=>{})
  console.log('部门列表',res);
  if(res.errCode!==10000){
    return false
  }
  options.value=res.data.list
  
}
// 获取班级列表
const getClasseslist=async (id:any)=>{
  const res:any=await classeslist({depid:id}).catch(()=>{})
  console.log('班级列表',res);
  if(res.errCode!==10000){
    return false
  }
  classlist.value=res.data.list

}
// 获取学生考试列表
const getStudentList=async()=>{
  const res:any=await testStudent(seachData.value).catch(()=>{})
  console.log('学生考试列表',res);
  if(res.errCode!==10000){
    return false
  }
  tableData.value=res.data.list
}
// 获取分析数据详情
const getTextAnalyse=async()=>{
  // console.log(route.query.id);
  
  const res:any=await TextAnalyse({testid:route.query.id}).catch(()=>{})
  // console.log('数据分析',res);
  if(res.errCode!==10000){
    return false
  }
  AnalyseData.value=res.data.model
  passData.value=res.data.passCounts
  pieItems.value=res.data.pieItems
 
}
// 触发自定义事件接收子组件传值
const showEmit=(data:any)=>{
  studentShow.value=data
}
onMounted(()=>{
  getTextAnalyse()
  getDepartmentList()
  getStudentList()
 
})
// 点击返回
const goBack = () => {
  router.push('/test')
}
// 点击部门
const handleChange = (value: any) => {
  console.log('点击部门',value)
  seachData.value.depid=value
  getClasseslist(value)
}
// 点击查询
const getSeach=()=>{
  getStudentList()

}
// 点击查看
const getLook=(data:any)=>{
  studentInfo.value.studentid=data
  console.log('点击查看',data);
  
  
  
  studentShow.value=true

}

</script>

<style lang="less" scoped>
.line{
  width: 99%;
  margin: 0 auto;
  height: 40px;

  border-bottom: 2px solid rgb(178, 177, 177);
  span{
    color:var(--el-color-primary) ;
    height: 40px;
    display: inline-block;
    line-height: 40px;
    margin-left: 50px;
    padding: 0px 10px;
    border-bottom: 2px solid var(--el-color-primary);
  }
}
.el-form-item{
  width: 230px;
}
</style>