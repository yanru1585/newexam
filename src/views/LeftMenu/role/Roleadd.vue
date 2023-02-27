<template>
  <el-dialog
    v-model="dialogVisible"
    title="添加"
    width="80%"
    :before-close="handleClose"
  >
    <el-form
      ref="ruleFormRef"
      :model="addList"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
    >
      <el-form-item label="角色名称:" prop="name">
        <el-input v-model="addList.name" />
      </el-form-item>
    </el-form>
    <div
      style="
        margin-left: 70px;
        height: 410px;
        display: block;
        overflow-y: scroll;
      "
    >
      <p style="margin-bottom: 15px">权限</p>
      <div>
        <div v-for="(item, index) in menuArr" :key="index">
          <el-checkbox
            v-model="item.checked"
            style="margin-left: 30px"
            @change="handleCheckAllChange(index)"
            :indeterminate="item.isIndeterminate"
            >{{ item.name }}</el-checkbox
          >
          <el-checkbox-group
            style="margin-left: 60px"
            v-model="item.checkedCities"
          >
            <el-checkbox
              v-for="(it, index1) in item.children"
              :key="index1"
              :label="it.id"
              @change="handleCheckedCitiesChange(index)"
              >{{ it.name }}</el-checkbox
            >
          </el-checkbox-group>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm(ruleFormRef)">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, toRefs, toRaw, watch } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { menulsit, roleadd, rolelist } from '../../../api/admin';
import { concat } from 'lodash';

const props = defineProps({
  getList: {
    type: Function,
    required: true,
  },
  editData: {
    type: Object,
    required: true,
  },
});
console.log(props.editData.id);

interface Idata {
  menuArr: Array<any>;
}
const data: Idata = reactive({
  menuArr: [],
});

interface IaddList {
  id: number;
  name: string;
  menus: Array<any>;
}
interface IaddData {
  addList: IaddList;
  roleid: number;
}
const addData: IaddData = reactive({
  addList: {
    id: 0,
    name: '',
    menus: [],
  },
  roleid: 0,
});
const { menuArr } = toRefs(data);
const { addList } = toRefs(addData);

const getList = async () => {
  let res: any = await menulsit(addData.roleid);
  console.log('角色权限',res);
  
  if (res.errCode !== 10000) {
    ElMessage.error('角色列表请求失败!');
    return false;
  }
  data.menuArr = res.data.list;
  data.menuArr.map((item: any) => {  //角色回显
    let menuEditArr = item.children.filter((i: any) => {
      if (i.checked === 1) {
        return i;
      }
    }).map((it:any)=>{
      // console.log(it.id);
      return it.id
    }) 
    item.checkedCities = menuEditArr;
    if(item.checkedCities.length==item.children.length){
      item.checked=true
    }
  });
};

watch(
  [() => props.editData.name, () => props.editData.id],
  (newValue, oldValue) => {
    addList.value.name = newValue[0];
    addList.value.id = newValue[1];
    addData.roleid = newValue[1];
  },
  { immediate: true, deep: true }
);

// 多选框组

// 点击全选反选
const handleCheckAllChange = (val: number) => {
  console.log(data.menuArr[val]);
  let ids = data.menuArr[val].children.map((item: any) => item.id); //拿到每一项所有的id   [66,65,29,30 ]
  // console.log(data.menuArr[val].checkedCities.length);

  if (
    data.menuArr[val].checkedCities &&
    data.menuArr[val].checkedCities.length > 0
  ) {
    data.menuArr[val].checkedCities = [];
  } else {
    data.menuArr[val].checkedCities = ids;
    console.log(ids);
  }
};
// 单选
const handleCheckedCitiesChange = (val: number) => {
  console.log(data.menuArr[val].checkedCities);
  let a = data.menuArr[val].children.length;
  let b = data.menuArr[val].checkedCities.length;
  data.menuArr[val].isIndeterminate = false;

  console.log(data.menuArr);

  if (a == b) {
    data.menuArr[val].checked = true;
  } else if (b > 0) {
    data.menuArr[val].isIndeterminate = true;
  } else {
    data.menuArr[val].checked = false;
  }
};

const formSize = ref('default');
const ruleFormRef = ref<FormInstance>();

const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
});

// 是否显示弹窗
const dialogVisible = ref(true);

const emits = defineEmits(['closeDialog']);

onMounted(() => {
  getList(); //获取权限功能列表
  // getRoleList(); //角色列表
});

// 关闭弹窗
const handleClose = (done: () => void) => {
  emits('closeDialog', false);
};
// 取消
const cancel = () => {
  emits('closeDialog', false);
};
// 确定
const confirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      data.menuArr.map((item: any, index: any) => {
        if (item.checkedCities) {
          let arrid = item.checkedCities.map((element: any) => ({
            id: element,
          }));
          addData.addList.menus = addData.addList.menus.concat(arrid);
          console.log(addData.addList.menus);
        }
      });

      let res: any = await roleadd(addData.addList);
      console.log('添加角色', res);
      if (addData.addList.id == 0) {
        if (res.errCode !== 10000) {
          ElMessage.error('添加失败！');
          return false;
        }
        ElMessage({
          message: '添加成功!',
          type: 'success',
        });
      } else {
        if (res.errCode !== 10000) {
          ElMessage.error('修改失败！');
          return false;
        }
        ElMessage({
          message: '修改成功!',
          type: 'success',
        });
      }

      emits('closeDialog', false);
      props.getList(); //调用父组件里的方法
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
.el-form {
  width: 400px;
}
</style>
