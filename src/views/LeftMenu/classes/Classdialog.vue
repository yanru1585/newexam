<template>
  <el-dialog
    v-model="dialogTableVisible"
    :title="a.carr.ids === undefined ? '添加' : '修改'"
  >
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
        <el-cascader :options="dataa.arr" :props="props" clearable @change="handleChange"/>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取消</el-button>
        <el-button type="primary" @click="add(ruleFormRef)">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { IClasses, classesadd } from '../../../api/admin';
import { ElMessage } from 'element-plus';

const dialogTableVisible = ref(false);
// defineExpose({
//   dialogTableVisible
// })
const a = defineProps({
  carr: {
    type: Object,
    required: true,
  },
  fal: {
    type: Function,
    required: true,
  },
});
console.log(a.carr);
const formSize = ref('default');
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  name: a.carr.name,
  depid: 0,
  id: a.carr.id,
});

const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入班级名称', trigger: 'blur' }],
});

// 级联选择器change事件
const handleChange = (value:any) => {
  console.log(value)
  ruleForm.depid=value
}

// 确定按钮
const add = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const res: any = await classesadd(
        ruleForm.name,
        ruleForm.depid,
        ruleForm.id
      );
      // console.log(res);
      if(res.errCode === 10000){
        if (res.data.id === 0) {
        ElMessage({
          message: '添加成功',
          type: 'success',
        });
        a.fal() 
      }else{
        ElMessage({
          message: '修改成功',
          type: 'success',
        });
        a.fal() 
      }
      }
    } else {
      console.log('error submit!', fields);
    }
  });
};
// 部门三级联动
const props = {
  value: 'id',
  label: 'name',
  children: 'children',
  checkStrictly: true, //点击单选框选中改点击整行选中
  emitPath: false, //只获取级联选择器中最后一项
};
const dataa = reactive({
  arr: [],
  information: [] as any,
});
const lists = async () => {
  const res = await IClasses({});
  // console.log(res);
  dataa.arr = res.data.list;
};
onMounted(() => {
  lists();
});
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
