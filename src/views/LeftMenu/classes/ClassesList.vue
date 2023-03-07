<template>
  <div class="box">
    <div
      style="display: flex; justify-content: space-between; margin-top: 10px"
    >
      <h3>班级管理</h3>
      <div>
        <el-button type="primary" @click="reser">添加班级</el-button>
      </div>
    </div>
    <el-form :inline="true" class="demo-form-inline" style="display: flex">
      <el-form-item label="班级名称">
        <el-input placeholder="请输入班级名称" v-model="data.params.key" />
      </el-form-item>
      <el-form-item label="部门">
        <el-cascader :options="dataa.arr" :props="props"  clearable />
      </el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
    </el-form>
    <div>
      <el-button type="danger" @click="deletelist">批量删除</el-button>
    </div>

    <el-table
      :data="data.tableData"
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" />
      <el-table-column prop="name" label="姓名" align="center" />
      <el-table-column prop="depname" label="部门" align="center">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200" align="center">
        <template #default="scope">
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
    <classdiglog v-if="user" v-model="user" :carr="daa.ar" :fal="father" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { reactive } from 'vue';
import { ref } from 'vue';
import {
  classeslist,
  classesdele,
  classesdeles,
  IClasses,
} from '../../../api/admin';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import classdiglog from '../classes/Classdialog.vue';

let ids = ref(''); //定义多选数据
const router = useRouter(); //跳转路由
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
    psize: 4, //每页显示多少条 默认是2
    key: '', //搜索关键字(名称)
    depid: '', //部门id
  },
  tableData: [],
  total: 0,
});
//列表请求
const getlist = async () => {
  let res: any = await classeslist(data.params);
  // console.log(res);
  if (res.errCode === 10000) {
    data.tableData = res.data.list;
    data.total = res.data.counts;
  }
};
onMounted(() => {
  getlist();
});
//多选获取id
const handleSelectionChange = (val: any) => {
  console.log(val);
  const arr = val.map((item: { id: any }) => {
    return item.id;
  });
  console.log(arr);
  ids = arr;
  // istop = true
};
//批量删除
const deletelist = () => {
  ElMessageBox.confirm('是否确定删除', '删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const res: any = await classesdeles(ids);
      console.log(res);
      ElMessage({
        type: 'success',
        message: '删除成功',
      });
      getlist();
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      });
    });
};
//删除
const delId = (id: number) => {
  console.log('删除', id);
  ElMessageBox.confirm('是否确认删除？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const res: any = await classesdele(id).catch(() => {});
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
// 部门三级联动
const props={
  value: 'id',
    label: 'name',
    children: 'children',
    checkStrictly: true, //点击单选框选中改点击整行选中
    emitPath: false, //只获取级联选择器中最后一项
}
const dataa = reactive({
  arr:[],
  information:[] as any 
})
const lists = async ()=>{
  const res = await IClasses({})
  // console.log(res);
  dataa.arr = res.data.list
}
onMounted(()=>{
  lists()
})
//添加班级和修改
const user = ref();
const daa = reactive({
  ar: {
    name: '',
    ids: '',
    id:0
  },
});
const reser = (row: any) => {
  // console.log(row);
  daa.ar.name = row.name; //名称
  daa.ar.ids = row.depid; //部门id
  daa.ar.id = row.id
  user.value = true;
};
const father = () => {
  user.value = false;
  getlist();
};

//分页
const pageSize2 = ref(4);
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
const onSubmit = () => {
  getlist();
};
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
