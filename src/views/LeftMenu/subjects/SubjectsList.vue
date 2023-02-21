<template>
  <div>
   <!-- 试卷 -->
   <h3>试卷管理</h3>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
    <el-form-item label="关键字">
      <el-input v-model="formInline.key" placeholder="考试名称" />
    </el-form-item>
    <el-form-item label="创建人">
      <el-input v-model="formInline.admin" placeholder="创建人" />
    </el-form-item>
    <el-form-item >
      <el-checkbox-group v-model="formInline.ismy">
        <el-checkbox  label="true" value="只看我创建的" name="type" >
          只看我创建的
          </el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
    </el-form-item>
  </el-form>
  <el-table :data="tableData" border style="width: auto">
    <el-table-column prop="title" label="试卷名称" align="center" />
    <el-table-column prop="counts" label="题量" align="center"  />
    <el-table-column prop="singles" label="单选" align="center" />
    <el-table-column prop="multiples" label="多选" align="center" />
    <el-table-column prop="judges" label="判断" align="center" />
    <el-table-column prop="blanks" label="填空" align="center" />
    <el-table-column prop="qas" label="问答" align="center" />
    <el-table-column prop="scores" label="总分" align="center" />
    <el-table-column prop="admin" label="创建人" align="center" />
    <el-table-column prop="addtime" label="更新时间" align="center" />
    <el-table-column fixed="right" label="Operations" align="center" >
      <template #default>
        <el-button link type="primary" size="small">编辑</el-button>
        <span>|</span>
        <el-button link type="primary" size="small">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
      v-model:current-page="formInline.page"
      v-model:page-size="formInline.psize"
      :page-sizes="[5, 10, 15, 20]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total=total
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script lang="ts" setup>
import {subjectList}from '../../../api/subjects'
import { reactive,toRefs,onMounted,ref } from 'vue';
const small = ref(false)
const background = ref(false)
const disabled = ref(false)
interface Iform{
  key:String
  admin:String
  ismy:Array<any>
  page:Number
  psize:Number
}

interface Idata{
  formInline:Iform
  tableData:Array<any>
  total:Number
}
const data:Idata=reactive({
  formInline:{//搜索框数据
    key:'',//搜素关键字
    admin:'',//创建人
    ismy:[],//只看我的
    page:1,//页码
    psize:5,//显示数量
  },
  tableData:[],//表格数据
  total:0,//共计多少条
})



const {formInline,tableData,total}=toRefs(data)
// 点击查询
const onSubmit=()=>{
  console.log(formInline.value);
}
// 获取试卷列表
const getList= async ()=>{
  const res:any=await subjectList(formInline.value).catch(()=>{})
  console.log('试卷列表',res);
  if(res.errCode!==10000){
    return false
  }
  tableData.value=res.data.list
  total.value=res.data.counts
  console.log(tableData.value);
  
}
// 分页触发事件
const handleSizeChange = (val: number) => {
  // console.log(`${val} items per page`)
  formInline.value.psize=val
  getList()
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
  formInline.value.page=val
  getList()
}
onMounted(()=>{
  getList()
})

</script>
<style lang="less" scoped>
h3{
  font-size: 20px;
  color: rgb(33, 33, 33);
  font-weight: normal;
  line-height: 50px;
}
.el-form{
  margin-top: 10px;
}
.el-table{
  font-size: 12px;
}
/deep/.el-pagination{
  position: absolute;
  right: 30px;
}
</style>

