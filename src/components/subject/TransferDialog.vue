<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      :title="title"
      width="60%"
      :before-close="handleClose"
    >
      <div class="seleBox">
        <div>
          <span>部门</span>
          <el-select
            v-model="seleValue"
            class="m-2"
            placeholder="请选择"
            @change="selectChang"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.name"
              :value="item.id"
            />
            <!--  -->
          </el-select>
        </div>
        <div v-if="title == '学生考试列表'">
          <span>班级</span>
          <el-select
            v-model="classid"
            style="width: 200px"
            placeholder="请选择"
          >
            <el-option
              v-for="item in classList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </div>
      </div>
      <el-transfer
        v-model="value"
        :data="data"
        :titles="['未选', '全选']"
        :props="props"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelForm">取消</el-button>
          <el-button type="primary" @click="confirm"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { teacherlsit, classeslist, testGetmarkteachers } from '../../api/admin';
import { departmentList } from '../../api/department';
import { ref, onMounted, reactive, toRefs, defineEmits } from 'vue';
import { ElMessageBox } from 'element-plus';
const emit = defineEmits(['transferEmit', 'showEmit']);

const propsd = defineProps({
  title: {
    type: String,
    required: true,
  },
});
const title = ref();
title.value = propsd.title;
// console.log(propsd.title);

interface Idata {
  options: Array<any>;
  seleValue: string;
  props: Iprop;
  classid: string;
  classList: Array<any>;
  classData: IclassData;
}
interface IclassData {
  page: number; //页码 默认是1
  psize: number; //每页显示多少条 默认是2
  key: string; //搜索关键字(名称)
  depid: number; //部门id
}
interface Iprop {
  key: string;
  label: string;
}
const dialogData: Idata = reactive({
  seleValue: '',
  options: [],
  props: {
    key: 'id',
    label: 'name',
  },
  classid: '',
  classData: {
    page: 1,
    psize: 20,
    depid: 0,
    key: '',
  },
  classList: [],
});
// 穿梭框数据
const data = ref();
const value = ref([]);
const { options, seleValue, props, classid, classData, classList } =
  toRefs(dialogData);

const dialogVisible = ref(true);

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('是否要关闭弹窗?')
    .then(() => {
      // done()
      emit('showEmit', false);
    })
    .catch(() => {
      // catch error
    });
};
// 获取部门列表
const getList = async () => {
  const res: any = await departmentList().catch(() => {});
  console.log('部门列表', res);
  if (res.errCode !== 10000) {
    return false;
  }
  options.value = res.data.list;
  console.log(options.value);
};
// 下拉框点击事件
const selectChang = async (val: any) => {
  console.log(val);

  // options.value.forEach(item=>{
  // if(item.id===val){
  //   item.children==null?data.value=[]:data.value=[...item.children]
  // }
  // })
  if (title.value == '可见老师') {
    const res: any = await teacherlsit({ depid: val }).catch(() => {});
    console.log('可见老师', res);
    if (res.errCode !== 10000) {
      return false;
    }
    data.value = res.data.list;
  }
  // testGetmarkteachers
  // 班级
  if (title.value == '学生考试列表') {
    dialogData.classData.depid = val;
    let result: any = await classeslist(dialogData.classData);
    console.log('班级列表', result);
    if (result.errCode !== 10000 || !result.data.list) {
      return false;
    }
    dialogData.classList = result.data.list;
    data.value = result.data.list;
  }

  if (title.value == '阅卷老师') {
    dialogData.classData.depid = val;
    let result: any = await testGetmarkteachers(dialogData.classData);
    console.log('班级列表', result);
    if (result.errCode !== 10000 || !result.data.list) {
      return false;
    }
    dialogData.classList = result.data.list;
    data.value = result.data.list;
  }
};
onMounted(() => {
  getList();
});
// 点击确定
const confirm = () => {
  let data={
    tit:title.value,
    arr:value.value
  }
  console.log('确定', value.value);
  emit('transferEmit', data);
  emit('showEmit', false);
};
// 点击取消
const cancelForm = () => {
  emit('showEmit', false);
};
</script>

<style lang="less" scoped>
.seleBox {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  span {
    margin-right: 10px;
  }
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
