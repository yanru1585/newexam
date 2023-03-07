<template>
  <div class="box">
    <div
      style="display: flex; justify-content: space-between; margin-top: 10px"
    >
      <h3>师资管理</h3>
      <div>
        <el-button>批量添加</el-button>
        <el-button type="primary" @click="reser">添加教资</el-button>
      </div>
    </div>
    <el-form
      :inline="true"
      :model="dataa"
      class="demo-form-inline"
      style="display: flex"
    >
      <el-form-item label="关键字">
        <el-input placeholder="请输入关键字" v-model="data.params.key" />
      </el-form-item>
      <el-form-item label="部门" prop="region" style="margin-left: 10px">
        <el-cascader :options="dataa.arr" :props="props" clearable />
      </el-form-item>
      <el-form-item label="角色" prop="region" style="margin-left: 10px">
        <el-select v-model="aa" placeholder="请选择" clearable>
          <el-option
            v-for="item in lisi.list"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
    </el-form>

    <el-table :data="data.tableData" stripe style="width: 100%">
      <el-table-column prop="name" label="姓名" align="center"> </el-table-column>
      <el-table-column prop="depname" label="部门" align="center"> </el-table-column>
      <el-table-column prop="tel" label="电话" align="center"> </el-table-column>
      <el-table-column prop="rolename" label="角色" align="center"> </el-table-column>
      <el-table-column prop="username" label="账号" align="center"> </el-table-column>
      <el-table-column fixed="right" label="操作" width="200" align="center">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="reset(scope.row)"
            >重置密码</el-button
          >
          <el-button link type="primary" size="small" @click="reser(scope.row)"
            >修改</el-button
          >
          <el-button
            link
            type="primary"
            size="small"
            @click="delId(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pigeBox">
      <el-pagination
        v-model:current-page="currentPage1"
        v-model:page-size="pageSize2"
        :page-sizes="[5, 10, 15, 20]"
        style="margin-top: 10px; float: right"
        layout="total, sizes, prev, pager, next, jumper"
        :total="data.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
  <teacherreset v-if="user" v-model="user" :carr="dat.list" :fal="father" />
  <teacherrevise v-if="use" v-model="use" :carr="reserdata.list"  :fal="fathe"/>
</template>

<script setup lang="ts">
import {debounce}  from "../../../utils/throTtle"
import { onMounted,onActivated } from 'vue';
import { reactive } from 'vue';
import { ref } from 'vue';
import {
  teacherlsit,
  teacherdele,
  IClasses,
  rolelistt,
} from '../../../api/admin';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import teacherreset from './teacherreset.vue';
import teacherrevise from './teacherrevise.vue';

const router = useRouter(); //跳转路由
const aa = ref('');

// 添加和修改
const use = ref();
const reserdata = reactive({
  list: {
    id: 0,
    username: '',
    pass: '',
    name: '',
    tel: '',
    depid: 0,
    roleid: 0,
  },
});
const reser = (row: any) => { 
  reserdata.list = row
  
  use.value = true;
};
const fathe = ()=>{
  use.value = false
  getlist();
}

// 重置密码
const user = ref();
const dat = reactive({
  list: {},
});
const reset = (row: any) => {
  // console.log(row);
  user.value = true;
  dat.list = row;
};
const father = () => {
  user.value = false;
  getlist();
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
onActivated(()=>{
  getlist()
})
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
//列表数据
interface Iparams {
  page: number; //页码 默认是1
  psize: number; //每页显示多少条 默认是2
  key: string; //搜索关键字(名称)
  depid: string; //部门id
}
//定义表格
interface Istate {
  tableData: Array<any>;
  params: Iparams;
  total: Number;
}
//数据
interface Iform {
  //数据对象接口
  personType: Array<any>;
}
//表格
const data = reactive<Istate>({
  params: {
    page: 1, //页码 默认是1
    psize: 5, //每页显示多少条 默认是2
    key: '', //搜索关键字(名称)
    depid: '', //部门id
  },
  tableData: [],
  total: 0,
});
//列表请求
const getlist =async () => {
  let res: any = await teacherlsit(data.params);
  // console.log(res);
  if (res.errCode === 10000) {
    data.tableData = res.data.list;
    data.total = res.data.counts;
  }
} ;
onMounted(() => {
  getlist();
});
//删除
const delId = (id: number) => {
  console.log('删除', id);
  ElMessageBox.confirm('是否确认删除？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const res: any = await teacherdele(id).catch(() => {});
      console.log('删除数据', res);
      if (res.errCode != 10000) {
        return false;
      }
      ElMessage({
        type: 'success',
        message: '删除成功',
      });
      getlist();
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消删除！',
      });
    });
};
//分页
const pageSize2 = ref(5);
const currentPage1 = ref(1);
const handleSizeChange = (val: number) => {
  console.log(val);
  data.params.psize = val;
  getlist();
};
const handleCurrentChange = (val: number) => {
  console.log(1111, val);
  data.params.page = val;
  getlist();
};
//查询
const onSubmit =debounce( () => {
  getlist();
},500);
</script>

<style lang="less" scoped>
.box h3 {
  padding: 10px;
}
.el-input {
  width: 200px;
}
.book {
  color: #409eff;
}
.el-table .cell {
  color: #409eff;
}
</style>
