<template>
  <div class="box">
    <h3>考试管理</h3>
    <el-form
      :inline="true"
      :model="formInline"
      class="demo-form-inline"
      style="display: flex"
    >
      <el-form-item label="关键字">
        <el-input v-model="data.params.key" placeholder="考试名称" />
      </el-form-item>
      <el-form-item label="创建人">
        <el-input v-model="data.params.admin" placeholder="创建人" />
      </el-form-item>
      <el-checkbox-group>
        <el-checkbox label="我创建的 开放时间" />
      </el-checkbox-group>
      <el-radio-group
        v-model="radio"
        style="margin-top: -16px; margin-left: 20px"
      >
        <el-radio :label="3">永久开放</el-radio>
        <el-radio :label="6">部分时段</el-radio>
      </el-radio-group>
      <div class="block">
        <el-date-picker
          style="margin-left: 20px; width: 200px;"
          v-model="value1"
          type="monthrange"
          range-separator="To"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </div>
      <el-form-item label="状态" prop="region" style="margin-left: 10px">
        <el-select style="width: 100px" placeholder="请选择">
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
    </el-form>
    <el-table :data="data.tableData" stripe style="width: 100%;">
      <el-table-column type="selection" />
      <el-table-column prop="title" label="考试名称" #default="scope">
        <span  style=" color: #409eff;">{{ scope.row.title}} </span>
        </el-table-column>
      <el-table-column prop="state" label="状态" #default="scope">
          <span  style=" color: #409eff;">{{ scope.row.state === 1 ? "已发布" : "未发布" }}</span>
      </el-table-column>
      <el-table-column prop="scores" label="总分" />
      <el-table-column prop="pastscores" label="通过分数" />
      <el-table-column prop="studentcounts" label="考试人数" />
      <el-table-column prop="passCounts" label="通过人数" />
      <el-table-column prop="limittime" label="开放时间" #default="scope">
        <span>{{ scope.row.state === 0 ? "1小时" : "不限" }}</span>
        </el-table-column>
      <el-table-column prop="admin" label="创建人" />
      <el-table-column prop="addtime" label="更新时间" width="200"/>
      <el-table-column fixed="right" label="操作" width="200">
      <template #default>
        <p>
        <el-button link type="primary" size="small" >学生</el-button>
        <el-button link type="primary" size="small">可见</el-button>
        <el-button link type="primary" size="small">阅卷老师</el-button>
        </p>
        <p>
          <el-button link type="primary" size="small" >分析</el-button>
        <el-button link type="primary" size="small">编辑</el-button>
        <el-button link type="danger" size="small">删除</el-button>
        </p>
      </template>
     
    </el-table-column>
    </el-table>
    <div class="pigeBox">
      <el-pagination
      v-model:current-page="currentPage1"
      v-model:page-size="pageSize2"
      :page-sizes="[5,10,15,20]"
      style="float: right;"
      layout="total, sizes, prev, pager, next, jumper"
      :total="data.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted} from 'vue'
import { reactive } from 'vue';
import { ref } from 'vue';
import { list } from '../../../api/admin'

const formInline:Iform = reactive({
  personType:[//访客类型列表
    {id:1,type_name:'外来人员'},
    {id:2,type_name:'老师'},
    {id:3,type_name:'学生'},
  ],
});
const radio = ref(3);
//列表数据
interface Iparams {
  page: number; //页码 默认是1
  psize: number; //每页显示多少条 默认是2
  key: string; //搜索关键字(名称)
  admin: string; //创建人
  ismy: string; //只看我的 >0
  opentime: string; //opentime>0 开放时间：永久开放
  begindate: string; //开放时间：开始日期
  enddate: string; //开放时间：截止日期
  state: number; //状态 0:所有，1已发布，2未发布
  isread: number; //1考试列表（判卷）
  result: string; //学生考试结果 “已通过”，”未通过”，”待阅卷”，”未考试”
}
//定义表格
interface Istate{
  tableData:Array<any>
  params:Iparams
  total:Number
}
//数据
interface Iform {//数据对象接口
  personType:Array<any>
}
//表格
const data = reactive<Istate>({
 params:{
  page:1,//页码 默认是1
  psize:4,//每页显示多少条 默认是2
  key: '', //搜索关键字(名称)
  admin: '', //创建人
  ismy: '', //只看我的 >0
  opentime: '', //opentime>0 开放时间：永久开放
  begindate: '', //开放时间：开始日期
  enddate: '', //开放时间：截止日期
  state: 1, //状态 0:所有，1已发布，2未发布
  isread: 1, //1考试列表（判卷）
  result: '', //学生考试结果 “已通过”，”未通过”，”待阅卷”，”未考试”
 },
 tableData:[],
 total:0
})
const getlist =async()=>{
let res:any = await list(data.params)
console.log(res);
if(res.errCode ===10000){
  data.tableData=res.data.list
  data.total = res.data.counts
  console.log(data.total);
  
}
}
onMounted(()=>{
getlist()
})

//分页
const pageSize2 =ref(4)
const currentPage1= ref(1)
const handleSizeChange =(val:number)=>{
  console.log(val);
data.params.psize=val
getlist()
}
const handleCurrentChange=(val:number)=>{
  console.log(1111,val);
  data.params.page=val
  getlist()
}

//查询
const onSubmit=()=>{
  getlist()
}






//时间
const value1 = ref('');

const shortcuts = [
  {
    text: 'This month',
    value: [new Date(), new Date()],
  },
  {
    text: 'This year',
    value: () => {
      const end = new Date();
      const start = new Date(new Date().getFullYear(), 0);
      return [start, end];
    },
  },
  {
    text: 'Last 6 months',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 6);
      return [start, end];
    },
  },
];
</script>

<style lang="less" scoped>
.box h3 {
  padding: 10px;
}
.el-input {
  width: 100px;
}
.book{
  color: #409eff;
}
.el-table .cell{
  color: #409eff;
}
</style>
