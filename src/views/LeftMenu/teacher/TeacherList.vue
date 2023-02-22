<template>
  <div class="box">
    <div style="display: flex;justify-content: space-between;margin-top: 10px;">
    <h3>师资管理</h3>
    <div>
    <el-button>批量添加</el-button>
    <el-button type="primary" @click="Addexam">添加教资</el-button>
  </div>
  </div>
    <el-form
      :inline="true"
      :model="formInline"
      class="demo-form-inline"
      style="display: flex"
    >
      <el-form-item label="关键字">
        <el-input  placeholder="请输入关键字" v-model="data.params.key"/>
      </el-form-item>
      <el-form-item label="部门" prop="region" style="margin-left: 10px">
        <el-select style="width: 200px" placeholder="请选择"  >
            <el-option>11</el-option>
   
        </el-select>
      </el-form-item>
      <el-form-item label="角色" prop="region" style="margin-left: 10px">
        <el-select style="width: 200px" placeholder="请选择"  >
        <el-option  v-for="item in  formInline.personType" :key="item.id" :label="item.type_name" :value="item.id" />
   
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
    </el-form>


    <el-table :data="data.tableData" stripe style="width: 100%;" >
      <el-table-column prop="name" label="姓名" >
        </el-table-column>
        <el-table-column prop="depname" label="部门" >
        </el-table-column>
        <el-table-column prop="tel" label="电话" >
        </el-table-column>
        <el-table-column prop="rolename" label="角色" >
        </el-table-column>
        <el-table-column prop="nickname" label="账号" >
        </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
      <template #default="scope">
    
        <el-button link type="primary" size="small" >重置密码</el-button>
        <el-button link type="primary" size="small">修改</el-button>
        <el-button link type="primary" size="small" @click="delId(scope.row.id)">删除</el-button>
  
      </template>
     
    </el-table-column>
    </el-table>
    <div class="pigeBox">
      <el-pagination
      v-model:current-page="currentPage1"
      v-model:page-size="pageSize2"
      :page-sizes="[5,10,15,20]"
      style="margin-top: 10px;float: right;"
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
import { teacherlsit,teacherdele } from '../../../api/admin'
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()//跳转路由

const formInline:Iform = reactive({
  personType:[//访客类型列表
    {id:1,type_name:'vbfbgrbftb'},
    {id:2,type_name:'1111111111111111111'},
    {id:3,type_name:'4444444444'},
    {id:4,type_name:'admin'},
    {id:5,type_name:'超级管理员'},
  ],
});

//列表数据
interface Iparams {
  page: number; //页码 默认是1
  psize: number; //每页显示多少条 默认是2
  key: string; //搜索关键字(名称)
  depid: string; //部门id
}
//定义表格
interface Istate{
  tableData:Array<any>
  params:Iparams
  total:Number,
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
  depid:'',//部门id
 },
 tableData:[],
 total:0,

})
//列表请求
const getlist =async()=>{
let res:any = await teacherlsit(data.params)
console.log(res);
if(res.errCode ===10000){
  data.tableData=res.data.list
  data.total = res.data.counts
}
}

onMounted(()=>{
getlist()
})
//删除
const delId = (id:number)=>{
  console.log('删除',id);
  ElMessageBox.confirm(
    '是否确认删除？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then( async () => {
  const res:any= await teacherdele(id).catch(()=>{})
  console.log('删除数据',res);
  if (res.errCode != 10000) {
    return false;
  }
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
      getlist()
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消删除！',
      })
    })
  
}
//添加教资
const Addexam =()=>{

}
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
</script>

<style lang="less" scoped>
.box h3 {
  padding: 10px;
}
.el-input {
  width: 200px;
}
.book{
  color: #409eff;
}
.el-table .cell{
  color: #409eff;
}
</style>
