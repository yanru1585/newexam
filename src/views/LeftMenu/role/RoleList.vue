<template>
  <div class="box">
    <div style="display: flex;justify-content: space-between;margin-top: 10px;">
    <h3>角色管理</h3>
    <div>
    <el-button type="primary" @click="Addexam">添加角色</el-button>
  </div>
  </div>
  
    <el-table :data="data.tableData" stripe style="width: 100%;" >
      <el-table-column prop="name" label="姓名" >
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
import { rolelist,roledel } from '../../../api/admin'
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()//跳转路由


//列表数据
interface Iparams {
  page: number; //页码 默认是1
  psize: number; //每页显示多少条 默认是2
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
 },
 tableData:[],
 total:0,

})
//列表请求
const getlist =async()=>{
let res:any = await rolelist(data.params)
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
  const res:any= await roledel(id).catch(()=>{})
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
