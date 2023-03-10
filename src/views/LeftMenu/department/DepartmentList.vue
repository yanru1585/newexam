<template>
  <div>
    <el-container>
      
      <el-aside width="380px" >
        <div class="top">
          <h3>部门管理</h3>
          <!-- <p></p> -->
          <el-button
            type="primary"
            @click="(isShowAdd = true), (isShowAdd2 = false)"
            >添加一级节点</el-button
          >
        </div>
        <div class="tree">
          <el-tree
            :data="list"
            :props="defaultProps"
            @node-click="handleNodeClick"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
          />
        </div>
      </el-aside>
      <el-main>
        <el-form
          ref="ruleFormRef"
          :model="addData"
          :rules="rules"
          label-width="120px"
          class="demo-ruleForm"
          :size="formSize"
          status-icon
          style="margin-top: 40px"
        >
          <div v-if="isShowAdd">
            <el-form-item label="节点名称" prop="name">
              <el-input style="width: 280px" v-model="addData.name" />
            </el-form-item>
            <el-form-item>
              <template #default="scope">
                <el-button
                  type="primary"
                  @click="addOne(ruleFormRef)"
                  size="small"
                  >添加一级节点</el-button
                >
              </template>
            </el-form-item>
          </div>
          <div v-if="isShowAdd2">
            <el-form-item label="当前节点">
              <span>{{ oneData.name }}</span>
            </el-form-item>
            <el-form-item label="节点名称" prop="name">
              <el-input style="width: 280px" v-model="addData.name" />
            </el-form-item>
            <el-form-item>
              <template #default="scope">
                <el-button type="info" @click="del">删除当前节点</el-button>
                <el-button type="success" @click="edit(ruleFormRef)"
                  >修改当前节点</el-button
                >
                <el-button type="primary" @click="add(ruleFormRef)"
                  >添加子节点</el-button
                >
              </template>
            </el-form-item>
          </div>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, toRefs, ref } from 'vue';
import {
  departmentList,
  departmentAdd,
  departmentDelete,
} from '../../../api/department';

import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus';

const formSize = ref('default');
const ruleFormRef = ref<FormInstance>();

const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入节点名称', trigger: 'blur' }],
});

interface Tree {
  label: string;
  children?: Tree[];
}

// 点击树形控件触发  获取当前行数据
const handleNodeClick = (val: Tree) => {
  // console.log(data);
  isShowAdd.value = false;
  isShowAdd2.value = true;
  data.oneData = val;
  console.log(data.oneData);
  console.log(data.oneData.pid);

  addData.pid = data.oneData.pid;
  addData.id = data.oneData.id;
  // data.editId = data.oneData.id;
};

interface Idata {
  list: Array<any>;
  oneData: any;
  editId: number;
}
const data: Idata = reactive({
  list: [],
  oneData: {},
  editId: 0,
});

const addData = reactive({
  id: 0,
  pid: 0,
  name: '',
});

const { list, oneData } = toRefs(data);

const defaultProps = {
  children: 'children',
  label: 'name',
};

onMounted(() => {
  getList();
});

const getList = async () => {
  let res: any = await departmentList();
  console.log('部门列表', res);
  if (res.errCode !== 10000) {
    return false;
  }
  data.list = res.data.list;
};

// 是否显示右侧一级添加
const isShowAdd = ref(false);
// 是否显示右侧子级添加
const isShowAdd2 = ref(false);

// 添加一级节点
const addOne = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      addData.pid = 0;
      addData.id = 0;
      addEdit(addData);
      getList();
      formEl.resetFields();
    } else {
      console.log('error submit!', fields);
    }
  });
};

// 添加子节点
const add = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      addData.pid = addData.id;
      addData.id = 0;
      console.log(addData.id);
      addEdit(addData);
      getList();
      formEl.resetFields();
    } else {
      console.log('error submit!', fields);
    }
  });
};

// 修改
const edit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      addEdit(addData);
      getList();
      formEl.resetFields();
    } else {
      console.log('error submit!', fields);
    }
  });
};

const addEdit = async (val: any) => {
  let res: any = await departmentAdd(val);
  console.log('修改部门', res);
  if (addData.id == 0) {
    if (res.errCode !== 10000) {
      ElMessage.error('添加失败！');
      return false;
    }
    ElMessage({
      message: '添加成功！',
      type: 'success',
    });
  } else {
    if (res.errCode !== 10000) {
      ElMessage.error('修改失败！');
      return false;
    }
    ElMessage({
      message: '修改成功！',
      type: 'success',
    });
  }
  getList();
};

// 删除当前节点
const del = () => {
  ElMessageBox.confirm('确定要删除该账号吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      let res = await departmentDelete(addData.id);
      console.log('删除当前节点', res);
      getList();
      ElMessage({
        type: 'success',
        message: '删除成功！',
      });
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '删除失败！',
      });
    });
};
</script>

<style lang="less" scoped>
.top {
  margin-bottom: 20px;
  h3 {
    font-size: 20px;
    color: rgb(33, 33, 33);
    font-weight: normal;
  }
  .el-button {
    margin-left: 20px;
  }
}

.tree {
  height: 80%;
  width: 360px;

  display: block;
  position: fixed;
  overflow-y: scroll;
}
</style>
