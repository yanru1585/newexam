<template>
  <el-dialog v-model="dialogTableVisible" :title="a.carr.ids === undefined ?'添加':'修改'">

    <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="rules"
    label-width="120px"
    class="demo-ruleForm"
    :size="formSize"
    status-icon
  >
    <el-form-item label="班级名称" prop="name">
      <el-input v-model="ruleForm.name" />
    </el-form-item>
    <el-form-item label="部门" prop="name">
      <el-cascader :options="dataa.arr" :props="props"   clearable />
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
import {  ref ,reactive,onMounted} from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import{IClasses,classesadd} from '../../../api/admin'

const dialogTableVisible = ref(false)
// defineExpose({
//   dialogTableVisible
// })
const a = defineProps({
  carr:{
    type:Object,
    required:true
  },
  fal:{
    type:Function,
    required:true
  }
})
console.log(a.carr);
const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  name: a.carr.name,
  depid:a.carr.ids
})
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入班级名称', trigger: 'blur' },
  ],
})
// 添加
const add =async()=>{
  const res = await classesadd(ruleForm.name,ruleForm.depid)
  // console.log(res);
  a.fal()     //关闭弹框
}
// 部门三级联动
const props={
    value: 'id',
    label: 'name',
    children: 'children',
    checkStrictly: true, //点击单选框选中改点击整行选中
    emitPath: false, //只获取级联选择器中最后一项
}
const dataa = reactive({
  arr:[],
  information:[] as any 
})
const lists = async ()=>{
  const res = await IClasses({})
  // console.log(res);
  dataa.arr = res.data.list
}
onMounted(()=>{
  lists()
})


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