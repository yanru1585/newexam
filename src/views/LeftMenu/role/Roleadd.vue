<template>

  <el-dialog
    v-model="dialogVisible"
    title="添加角色"
    width="40%"
  >
  <el-form
    ref="ruleFormRef"
    :model="addData"
    :rules="rules"
    label-width="120px"
    class="demo-ruleForm"
    :size="formSize"
    status-icon
  >
  <el-form-item label="角色名称" prop="name">
      <el-input v-model="addData.name" style="width: 300px;"/>
    </el-form-item>
  </el-form>
  <el-form-item  prop="menus">
  <div v-for="(item,index) in data.list" :key="item.id" style="margin-left: 40px;">
    <el-checkbox @change="handleCheckAllChange(index)"
    v-model="item.ced" :indeterminate="item.isIndeterminate">
      {{ item.name }}
    </el-checkbox>
    {{ item.checkedCities }}
    <el-checkbox-group v-model="item.checkedCities" style="margin: 10px;">
      <el-checkbox 
   v-for="subitem in item.children" :key="subitem.id" :label="subitem.id"    @change="handleCheckedCitiesChange(index)">
        {{ subitem.name }}
      </el-checkbox>
    </el-checkbox-group>
  </div>
  </el-form-item>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="roleAdd">
         确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus';
import { ref,onMounted} from 'vue'
import { ElMessageBox } from 'element-plus'
import { defineExpose } from 'vue';
import { reactive } from 'vue';
import type { FormInstance, FormRules } from 'element-plus'
import {menulsit} from '../../../api/admin'
import {roleadd} from '../../../api/admin'
import { useRouter } from 'vue-router';
const router = useRouter()
const dialogVisible = ref(false)
defineExpose({
  dialogVisible
})

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>();

const addData: any = reactive({
  name: '',
  menus:""
});


//角色校验
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 3, max: 5, message: '长度在三到五', trigger: 'blur' },
  ],
})
//列表数据
interface Iparams {
  roleid:string
}
//定义表格
interface Istate{
  params:Iparams,
  list:Array<any>
}
//表格
const data = reactive<Istate>({
 params:{
  roleid:'',
 },
 list:[]
})
//列表请求
const getlist =async()=>{
let res:any = await menulsit(data.params)
console.log(res);
 data.list=res.data.list
//  console.log(data.list);
}

onMounted(()=>{
getlist()
})
//多选框
const handleCheckAllChange =(index:number)=>{
  let ids = data.list[index].children.map((item:any)=>item.id);
  if(data.list[index].checkedCities && data.list[index].checkedCities.length>0){
    data.list[index].checkedCities=[]
  }else{
    data.list[index].checkedCities=ids
  }
}
const handleCheckedCitiesChange =(index:number)=>{
 let checklen = data.list[index].checkedCities.length;
 let alllen = data.list[index].children.length;
 data.list[index].isIndeterminate=false
 if(checklen==alllen){
  data.list[index].ced=true;
 }else if(checklen>0){
  data.list[index].isIndeterminate=true;
 }else{
  data.list[index].ced=false
 }

}

// 点击确认添加
const roleAdd = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async(valid, fields) => {
    if (valid) {
      const res:any=await roleadd(addData).catch(()=>{})
      console.log('添加',res);
    //   if (res.code != 10000) {
    //   return false;
    //   }
    //   ElMessage.success('添加成功')
    //   router.push('/admin/list')
      
    // } else {
    //   ElMessage.error('请正确输入添加信息')
    //   console.log('请正确输入', fields)
    }
  })
}


</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
