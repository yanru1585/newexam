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
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="roleAdd(ruleFormRef)">
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
import { defineExpose} from 'vue';
import { reactive } from 'vue';
import type { FormInstance, FormRules } from 'element-plus'
import {menulsit} from '../../../api/admin'
import {roleadd} from '../../../api/admin'
import { useRouter } from 'vue-router';
import {toRaw} from 'vue'
import {watch} from 'vue'
const router = useRouter()
const dialogVisible = ref(false)
const props = defineProps({
  getListDialog: {
    type: Function,
    required: true,
  },
  editlist:{
    type: Object,
    required: true,
  }
  
});

defineExpose({
  dialogVisible
})
const formSize = ref('default')
const ruleFormRef = ref<FormInstance>();

const addData: any = reactive({
  id: 0,
  name: '',
  menus:[],
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
Object.assign(props.editlist, addData);
console.log(props.editlist);

})
//监听
watch(
  [ () => props.editlist.id],
  (newValue, oldValue) => {
    console.log('person的job变化了', newValue, oldValue);
 
  },
  { immediate: true, deep: true }
);
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
 const roleAdd =async(ruleFormRef:any)=>{
  console.log(toRaw(data.list));

  let _list =toRaw(data.list)
  // console.log(_list);
 let _menus:Array<any>=[]
  _list.forEach((element:any)=>{
    if(element.checkedCities){
    let ids =  element.checkedCities.map((item:any)=>({id:item}))

      addData.menus=_menus.concat(ids)
      console.log(addData.menus);
      
      // element.checkedCities.forEach((item:any)=>{
      // _menus.push({id:item})
      // })
    }
  })
  console.log(addData.menus);
  
  const res:any=await roleadd(addData).catch(()=>{})
      console.log('添加',res);
      if(res.errCode!==10000){
        return false
      } if (addData.id == 0) {
        ElMessage({
          message: '添加成功！',
          type: 'success',
        });
      } else {
        ElMessage({
          message: '修改成功！',
          type: 'success',
        });
      }
      dialogVisible.value = false;
      props.getListDialog(); //调用父级的列表  刷新
      ruleFormRef.resetFields(); //重置表单

 }

 const cancel = () => {
  dialogVisible.value = false;

};
</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
