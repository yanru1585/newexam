<template>
  <el-dialog
    :model-value="dialogVisible"
    v-if="ifShow"
    title="题库添加"
    width="40%"
    :before-close="handleClose"
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
      <el-form-item label="题库名称" prop="title">
        <el-input v-model="title" />
      </el-form-item>
      <el-form-item label="被他人使用" prop="isshow">
        <el-row>
          <el-radio-group v-model="isshow" @change="radioChange">
            <el-col>
              <el-radio :label="1" size="large">允许所有老师使用</el-radio>
            </el-col>
            <el-col>
              <el-radio :label="2" size="large">不允许任何老师使用</el-radio>
            </el-col>
            <el-col>
              <el-radio :label="3" size="large" @click="portion"
                >允许部分老师使用<el-badge
                  v-if="isshow == 3"
                  :value="limits.length"
                  class="item"
                  type="primary"
                >
                </el-badge
              ></el-radio>
            </el-col>
          </el-radio-group>
        </el-row>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm(ruleFormRef)">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog
    v-else
    :model-value="dialogVisible"
    title="可见老师"
    width="50%"
    :before-close="handleCloseFn"
  >
    <el-form
      ref="ruleFormRef"
      :model="data"
      label-width="120px"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
    >
      <el-form-item label="部门">
        <el-select
          v-model="teacherArr.depid"
          @change="buMenchange"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in list"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <!-- 穿梭框 -->
      <el-transfer
        v-model="addData.limits"
        :props="{
          key: 'id',
          label: 'name',
        }"
        :data="teacherData"
      />
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="ifShow = true">取消</el-button>
        <el-button type="primary" @click="ok"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  ref,
  defineProps,
  watch,
  defineEmits,
  reactive,
  toRefs,
  onMounted,
  defineExpose,
} from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { teacherList, databaseAdd } from '../../api/database';
import { departmentList } from '../../api/department';
import type { FormInstance, FormRules } from 'element-plus';

const props = defineProps({
  getListDialog: {
    type: Function,
    required: true,
  },
  editList: {
    type: Object,
    required: true,
  },
});
const ifShow = ref(true);

const formSize = ref('default');
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({});

const addData: any = reactive({
  id: 0,
  title: '',
  isshow: 1,
  limits: [],
});
const { title, isshow, limits } = toRefs(addData);
// 获取单选框的值
const radioChange = (val: any) => {
  console.log(val);
  addData.isshow = val;
};

const rules = reactive<FormRules>({
  title: [{ required: true, message: '请输入题库名称', trigger: 'blur' }],
});

const dialogVisible = ref<any>(false);

// 暴露
defineExpose({
  dialogVisible,
});

const handleClose = (done: () => void) => {
  dialogVisible.value = false;
};

const handleCloseFn = (done: () => void) => {
  ifShow.value = true;
};

// 部门发生变化时
const buMenchange = (val: any) => {
  console.log('部门发生变化', val);
  data.teacherArr.depid = val;
  getList();
};

// 允许部分老师使用
const portion = () => {
  ifShow.value = false;
};

interface IteacherArr {
  page: number;
  psize: number;
  depid: string;
  key: string;
}

interface Idata {
  list: Array<any>;
  teacherArr: IteacherArr;
  teacherData: Array<any>;
}

const data: Idata = reactive({
  list: [],
  teacherArr: {
    page: 1,
    psize: 20,
    depid: '',
    key: '',
  },
  teacherData: [],
});

const { list, teacherArr, teacherData } = toRefs(data);

onMounted(() => {
  getList();
  // Object.assign(props.editList, addData);
});
// 编辑回显
watch(
  [() => props.editList.title, () => props.editList.id],
  (newValue, oldValue) => {
    // console.log('person的job变化了', newValue, oldValue);
    addData.title = newValue[0];
    addData.id = newValue[1];
  },
  { immediate: true, deep: true }
);

const getList = async () => {
  let res: any = await departmentList();
  console.log('部门列表', res);
  if (res.errCode !== 10000) {
    return false;
  }
  data.list = res.data.list;

  let result: any = await teacherList(data.teacherArr);
  console.log('获取老师信息', result);
  if (result.errCode !== 10000) {
    return false;
  }
  data.teacherData = result.data.list;
};

// 取消
const cancel = () => {
  dialogVisible.value = false;
  addData.title = '';
};

// 确定
const confirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log(addData);
      let res: any = await databaseAdd(addData);
      console.log('添加题库', res);
      if (res.errCode !== 10000) {
        ElMessage({
          message: '操作失败！',
          type: 'error',
        });
        return false;
      }
      if (addData.id == 0) {
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
    } else {
      console.log('error submit!', fields);
      ElMessage('请输入题库名称！');
    }
    props.getListDialog(); //调用父级的列表  刷新
    formEl.resetFields(); //重置表单
  });
};

// 点部分老师里的确定
const ok = () => {
  console.log(addData);
  addData.limits = addData.limits.map((item: any) => {
    return { id: item };
  });
  addData.isshow = 3;
  console.log(addData.limits);

  ifShow.value = true;
};
</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
.item {
  margin-top: -15px;
  margin-right: 70px;
}
</style>
