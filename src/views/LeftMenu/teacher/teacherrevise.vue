<template>
  <el-dialog :title="a.carr.id === undefined ? '添加' : '修改'" width="30%">
    <span>
      <el-form
        ref="ruleFormRef"
        :model="params"
        :rules="rules"
        label-width="50px"
        class="demo-ruleForm"
        :size="formSize"
        status-icon
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="params.name" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="params.tel" />
        </el-form-item>
        <el-form-item label="部门" >
          <el-cascader v-model="params.depid" :options="dataa.arr" :props="props" @change="cascaderChange" clearable />
        </el-form-item>
        <el-form-item label="角色" >
          <el-select v-model="params.roleid" placeholder="请选择" clearable @change="optionChange">
            <el-option
              v-for="item in lisi.list"
              :label="item.name"
              :value="item.id"
              
            />
          </el-select>
        </el-form-item>
        <div v-if="xian">
          <el-form-item label="账号" prop="username">
            <el-input v-model="params.username" />
          </el-form-item>
          <el-form-item label="密码" prop="pass">
            <el-input v-model="params.pass" />
          </el-form-item>
        </div>
      </el-form>
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="fals">取消</el-button>
        <el-button type="primary" @click="ress(ruleFormRef)">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, toRefs } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { IClasses, rolelistt, teacher } from '../../../api/admin';
import { ElMessage } from 'element-plus';

const cascaderChange=(val:any)=>{
// console.log(val);
data.params.depid=val
}
const optionChange = (val:any)=>{
  // console.log(val);
  data.params.roleid=val
}

// 接受父组件传过来的值
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

const xian = ref(true); //显示或隐藏
const aa = ref('');

const formSize = ref('default');
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  pass: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 16, message: '请输入6-16位的密码', trigger: 'blur' },
  ],
});
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
// 角色
interface Irole {
  page: number;
  psize: number;
  list: Array<any>;
}
const lisi: Irole = reactive({
  page: 1,
  psize: 50,
  list: [],
});
const getrolelist = async () => {
  const res = await rolelistt(lisi.page, lisi.psize);
  // console.log(res);
  lisi.list = res.data.list;
};
onMounted(() => {
  getrolelist();
});
// 点击确定
interface Iparams {
  depid: number;
  id: number;
  name: string;
  pass: string;
  roleid: number;
  tel: string;
  username: string;
}
interface Idata {
  params: Iparams;
}
const data: Idata = reactive({
  params: {
    depid: a.carr.depid,
    id: a.carr.id,
    name: a.carr.name,
    pass: a.carr.pass,
    roleid: a.carr.roleid,
    tel: a.carr.tel,
    username: a.carr.username,
  },
});
const { params } = toRefs(data);
// const ress = async() => {
//   // a.fal()
//   const res = await teacher(data.params)
//   console.log(res);
// };
const ress = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const res: any = await teacher(data.params);
      console.log(res);
      if (res.errCode === 10000) {
        if (res.data.id === 0) {
          ElMessage({
            message: '添加成功',
            type: 'success',
          });
          a.fal();
        } else {
          ElMessage({
            message: '修改成功',
            type: 'success',
          });
          a.fal();
        }
      }
    } else {
      console.log('error submit!', fields);
    }
  });
};
// 点击取消
const fals = () => {
  a.fal();
};
</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
