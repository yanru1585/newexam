<template>
  <el-dialog
    v-model="dialogVisible"
    title="重置密码"
    width="30%"
  >
  <el-form
    ref="ruleFormRef"
    :model="AddForm"
    :rules="rules"
    label-width="120px"
    class="demo-ruleForm"
    :size="formSize"
    status-icon
  >
    <el-form-item label="姓名" prop="name">
      <el-input v-model="AddForm.name" />
    </el-form-item>
    <el-form-item label="密码" prop="oldpass">
      <el-input v-model="AddForm.oldpass" type="password"/>
    </el-form-item>
    <el-form-item label="重置密码" prop="pass"  >
      <el-input v-model="AddForm.pass" type="password"/>
    </el-form-item>
    
    <el-form-item>
      <el-button type="primary" @click="Cancel">
        取消
      </el-button>
      <el-button @click="submitForm(ruleFormRef)">确定</el-button>
    </el-form-item>
  </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import {classesad } from  '../../../api/admin'
import { reactive, ref,watch,toRefs } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus'
const dialogVisible = ref(false)

const prop = defineProps({
  passlistt:{
    type:Object,
    required:true
  },
  getListDialog:{
    type:Function,
    required:true
  }
});

interface Iadd{//数据接口
 name:string,
 oldpass:string,
 pass:string
}
interface Idatss{
  AddForm:Iadd
}
const dats:Idatss = reactive({//添加数据
  AddForm:{
    name:'',
    oldpass:'',
    pass:''
  }
})
const {AddForm} =toRefs(dats)
defineExpose({
  dialogVisible
})
const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
//重置密码回限
// 编辑回显
watch(
  [ () => prop.passlistt],
  (newValue, oldValue) => {
    console.log('重置密码','person的job变化了', newValue, oldValue);
    Object.assign(AddForm.value, newValue[0])
    // AddForm=newValue[0]
  },
  { immediate: true, deep: true }
);
const rules = reactive<FormRules>({
  oldpass: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    // { min: 3, max: 5, message: 'Length should be 6 to 12', trigger: 'blur' },
  ],
  pass: [
    { required: true, message: '确认密码', trigger: 'blur' },
    // { min: 3, max: 5, message: 'Length should be 6 to 12', trigger: 'blur' },
  ],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async(valid, fields) => {
    if (valid) {
      if(AddForm.value.oldpass!==AddForm.value.pass){
        ElMessage({
          message: '密码是否一致',
          type: 'error',
        });
        return false
      }else{
        let res:any = await classesad(prop.passlistt)
      // console.log(res);
      
      if(res.errCode===10000){
        ElMessage({
          message: '修改成功！',
          type: 'success',
        });
        dialogVisible.value = false;
      prop.getListDialog(); //调用父级的列表  刷新
    formEl.resetFields(); //重置表单
      }
      }
    
    } else {
      console.log('error submit!', fields)
    }
  })
}

//取消
const Cancel = () => {
  dialogVisible.value = false;

};

</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
