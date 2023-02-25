<template>
  <div>
    <div class="top" @click="back">
      <el-icon><ArrowLeft /></el-icon>
      <p>返回</p>
      <span>丨</span>
      <span>{{ route.query.title }}</span>
    </div>
    <el-form
      :inline="true"
      :model="data"
      class="demo-form-inline"
      @keyup.enter="reser"
    >
      <el-form-item label="考生姓名:">
        <el-input v-model="data.key" placeholder="请输入考试姓名" />
      </el-form-item>
      <el-form-item label="状态:">
        <el-select v-model="data.state" placeholder="全部">
          <el-option label="已阅卷" value="shanghai" />
          <el-option label="未阅卷" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门:">
        <el-cascader :options="data.options" :props="props1" clearable />
      </el-form-item>
      <el-form-item label="班级:">
        <el-select placeholder="请选择" disabled> </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="reser">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="data.list" border style="width: 100%">
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="depname" label="班级名称" />
      <el-table-column prop="scores" label="分数" />
      <el-table-column prop="readtime" label="考试时间" />
      <el-table-column prop="state" label="状态">
        <template #default="scope">
          <span class="state">{{ scope.row.state }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button link type="primary" size="small">
            <span @click="drawer(scope.row)">{{
              scope.row.incomplete === 0 ? '查看' : '阅卷'
            }}</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <drawerr v-if="user" v-model="user" :dda="data1.list" :carr="father" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { ISee, IClasses } from '../../../api/admin';
import drawerr from './Examdrawer.vue';

import { ArrowLeft } from '@element-plus/icons-vue';
import router from '../../../router';

const route = useRoute();
// console.log(route.query.id);

// 根据id渲染列表
interface Ise {
  page: number;
  psize: number;
  testid: any;
  state: string;
  key: string;
  list: Array<any>;
  options: Array<any>;
}
const data: Ise = reactive({
  page: 1,
  psize: 5,
  testid: route.query.id, //传过来的id
  state: '', //状态
  key: '', //value值
  list: [],
  options: [],
});
// 获取列表
const getSee = async () => {
  const res = await ISee(
    data.page,
    data.psize,
    data.testid,
    data.state,
    data.key
  );
  // console.log(res);
  data.list = res.data.list;
};
// 获取部门下拉框数据
const props1 = {
  checkStrictly: true,
  value: 'id',
  label: 'name',
  children: 'children',
};
const getIClasses = async () => {
  const res = await IClasses({});
  console.log(res);
  data.options = res.data.list;
};
// 返回
const back = () => {
  router.push('/exam');
};
// 查询
const reser = () => {
  getSee();
};
// 点击出现抽屉
const user = ref();
// console.log(user.value);
const data1 = reactive({
  list: {
    id: route.query.id,
    ids: 0,
    name: '',
  },
});
const drawer = (row: any) => {
  // console.log(row);

  // let ids = [row.id,route.query.id]
  // console.log(ids);

  data1.list.ids = row.id;
  data1.list.name = row.name;
  console.log(data1.list);
  user.value = true;
};

onMounted(() => {
  getSee();
  getIClasses();
});
const father = () => {
  user.value = false;
  getSee();
};
</script>

<style scoped>
.top {
  width: 150px;
  height: 50px;
  display: flex;
  line-height: 50px;
  cursor: pointer;
}
.el-icon {
  margin-top: 16px;
  margin-right: 10px;
}
.state {
  color: red;
}
</style>
