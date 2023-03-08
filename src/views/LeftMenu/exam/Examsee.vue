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
        <el-cascader :options="data.options" :props="props1" @change="cascaderChange" clearable />
      </el-form-item>
      <el-form-item label="班级:">
        <el-select placeholder="请选择" v-model="data.classid" :disabled="datsa.listdata.length === 0 ? true:false">
          <el-option
            v-for="item in datsa.listdata"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="reser">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="data.list" border style="width: 100%" >
      <el-table-column prop="name" label="姓名"  align="center"/>
      <el-table-column prop="depname" label="班级名称" align="center" />
      <el-table-column prop="scores" label="分数"  align="center"/>
      <el-table-column prop="readtime" label="考试时间"  align="center"/>
      <el-table-column prop="state" label="状态" align="center">
        <template #default="scope">
          <span :style="scope.row.state==='未阅卷' ? 'color:red' : '' ">{{ scope.row.state }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button link type="primary" size="small">
            <span @click="drawer(scope.row)">{{
              scope.row.incomplete === 0 ? '查看' : '阅卷'
            }}</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
<!-- 分页 -->
<el-pagination
              v-model:current-page="data.page"
              v-model:page-size="data.psize"
              :page-sizes="[5, 10, 15, 20]"
              :small="small"
              :disabled="disabled"
              :background="background"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              style="float: right;"
            />

    <drawerr v-if="user" v-model="user" :dda="data1.list" :carr="father" />
  </div>
</template>

<script setup lang="ts">
import {debounce}  from "../../../utils/throTtle"
import { onMounted, reactive, ref, toRefs } from 'vue';
import { useRoute } from 'vue-router';
import { ISee, IClasses ,classeslist} from '../../../api/admin';
import drawerr from './Examdrawer.vue';

import { ArrowLeft } from '@element-plus/icons-vue';
import router from '../../../router';

const route = useRoute();
// 分页
const total = ref(0);
const small = ref(false);
const background = ref(false);
const disabled = ref(false);

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
    classid:string
}
const data: Ise = reactive({
  page: 1,
  psize: 5,
  testid: route.query.id, //传过来的id
  state: '', //状态
  key: '', //value值
  list: [],
  classid:'',   //班级id
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
  total.value = res.data.counts
};
// 分页
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
  data.psize = val;
  getSee();
};
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  data.page = val;
  getSee();
};
// 获取部门下拉框数据
const props1 = {
  emitPath:false,
  value: 'id',
  label: 'name',
  children: 'children',
};
const getIClasses = async () => {
  const res = await IClasses({});
  console.log(res);
  data.options = res.data.list;
};
// 当部门发生变化时
interface Idata {
  listdata:Array<any>
}
const datsa:Idata=reactive({
  listdata:[]
})
const cascaderChange=async(val:any)=>{
  console.log('111',val);
  const res:any = await classeslist({depid:val})
  console.log(res);
  if (res.errCode !== 10000 || !res.data.list) {
    return false;
  }
  datsa.listdata = res.data.list
}

// 返回
const back = () => {
  router.push('/exam');
};
// 查询
const reser =debounce(() => {
  getSee();
},500) ;
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
  // console.log(row)
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
  width: 300px;
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
