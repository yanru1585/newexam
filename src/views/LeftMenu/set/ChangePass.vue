<template>
  <div class="box">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
    >
      <el-form-item label="旧密码" prop="oldpass">
        <el-input v-model="ruleForm.oldpass" />
      </el-form-item>
      <el-form-item label="新密码" prop="pass">
        <el-input v-model="ruleForm.pass" />
      </el-form-item>
      <el-form-item label="确认新密码" prop="passOk">
        <el-input v-model="ruleForm.passOk" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          修改密码
        </el-button>
        <el-button @click="resetForm(ruleFormRef)">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref,onMounted,toRefs } from 'vue';
import {teacherChangePass} from '../../../api/admin'
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus'

const data: any = reactive({
  info: {},
});
const { info } = toRefs(data);

onMounted(() => {
  console.log(sessionStorage.getItem('model'));
  let obj: any = sessionStorage.getItem('model');
  data.info = JSON.parse(obj);
});


const formSize = ref('default');
const ruleFormRef = ref<FormInstance>();

const ruleForm = reactive({
  oldpass: '',
  pass: '',
  passOk: '',
});

let validateNewPassword = (rule: any, value: any, callback: any) => {
  if (value === ruleForm.oldpass) {
    callback(new Error('新密码不能与原密码相同!'));
  } else {
    callback();
  }
};
let validateNewPassword2 = (rule: any, value: any, callback: any) => {
  if (value !== ruleForm.pass) {
    callback(new Error('与新密码不一致!'));
  } else {
    callback();
  }
};

const rules = reactive<FormRules>({
  oldpass: [
    { required: true, message: '原密码必填', trigger: 'blur' },
    { min: 6, max: 15, message: '密码长度在6-15个字符', trigger: 'blur' },
  ],
  pass: [
    { required: true, message: '新密码必填', trigger: 'blur' },
    { validator: validateNewPassword, trigger: 'blur' },
  ],
  passOk: [
    { required: true, message: '确认新密码必填', trigger: 'blur' },
    { validator: validateNewPassword2, trigger: 'blur' },
  ],
});

// 修改密码
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async(valid, fields) => {
    if (valid) {
      if(data.info.pass!==ruleForm.oldpass){
        ElMessage.error('旧密码不正确!')
        return false
      }
      
      let res:any = await teacherChangePass(ruleForm.oldpass,ruleForm.pass)
      console.log('修改密码',res);
      if(res.errCode!==10000){
        ElMessage.error('修改失败!')
        return false
      }
      data.info.pass=ruleForm.pass
      sessionStorage.setItem('model',JSON.stringify(data.info))
      ElMessage.success('密码修改成功!')
      formEl.resetFields();
      
    } else {
      console.log('error submit!', fields);
    }
  });
};

// 重置
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>

<style lang="less" scoped>
.box {
  height: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
  .el-form {
    width: 400px;
  }
}
</style>
