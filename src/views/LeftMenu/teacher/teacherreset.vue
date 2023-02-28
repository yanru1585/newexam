<template>
  <el-dialog title="重置密码" width="30%">
    <span>
      <el-form
        ref="ruleFormRef"
        :model="parmas"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        :size="formSize"
        status-icon
      >
        <el-form-item label="姓名">
          {{ parmas.name }}
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input v-model="parmas.pass" />
        </el-form-item>
        <el-form-item label="确认密码" prop="oldpass">
          <el-input v-model="parmas.oldpass" />
        </el-form-item>
      </el-form>
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { teacher } from '../../../api/admin';
import { ElMessage } from 'element-plus';

const formSize = ref('default');
const ruleFormRef = ref<FormInstance>();
// 接受父组件传过来的数据
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

const rules = reactive<FormRules>({
  pass: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 16, message: '请输入6-16位的密码', trigger: 'blur' },
  ],
  oldpass: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { min: 6, max: 16, message: '请输入6-16位的密码', trigger: 'blur' },
  ],
});
// 点击取消
const cancel = () => {
  a.fal();
};
// 点击确定
interface Iparmas {
  confirmPass: string;
  depid: number;
  id: number;
  name: string;
  oldpass: string;
  pass: string;
  qq: string;
  roleid: number;
  searchDepa: Array<any>;
  tel: string;
  username: string;
}
interface Iteacher {
  parmas: Iparmas;
}
const datat: Iteacher = reactive({
  parmas: {
    confirmPass: '',
    depid: a.carr.depid,
    id: a.carr.id,
    name: a.carr.name,
    oldpass: '',
    pass: '',
    qq: '',
    roleid: a.carr.roleid,
    searchDepa: [],
    tel: a.carr.tel,
    username: a.carr.username,
  },
});
const { parmas } = toRefs(datat);

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (parmas.value.pass !== parmas.value.oldpass) {
        ElMessage.error('两次密码不一致');
      } else {
        const res: any = await teacher(datat.parmas);
        console.log(res);
        if (res.errCode === 10000) {
          ElMessage({
            message: '重置密码成功',
            type: 'success',
          });
          a.fal();
        } else {
          ElMessage.error('重置密码失败');
        }
      }
    } else {
      console.log('error submit!', fields);
    }
  });
};
</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
