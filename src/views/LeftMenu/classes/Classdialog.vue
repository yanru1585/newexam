<template>
  <el-dialog v-model="dialogTableVisible" title="添加">

    <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    label-width="120px"
    class="demo-ruleForm"
    :size="formSize"
    status-icon
  >
    <el-form-item label="Activity name" prop="name">
      <el-input v-model="ruleForm.name" />
    </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取消</el-button>
        <el-button type="primary" @click="add">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {  ref ,defineExpose,reactive} from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import{classesadd} from '../../../api/admin'

const dialogTableVisible = ref(false)
defineExpose({
  dialogTableVisible
})


const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  name: '',
  depid:0
})
// 添加
const add =async()=>{
  dialogTableVisible.value = false
  const res = await classesadd(ruleForm.name,ruleForm.depid)
  console.log(res);
  
}


</script>
<style scoped>
.el-button--text {
  margin-right: 15px;
}
.el-select {
  width: 300px;
}
.el-input {
  width: 300px;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>