<template>
  <div>
    <div
      style="display: flex; justify-content: space-between; margin-top: 10px"
    >
      <h3>题库管理</h3>
      <el-button type="primary" @click="add">创建考试</el-button>
    </div>

    <div>
      <el-form :inline="true" :model="data" class="demo-form-inline">
        <el-form-item label="题库名称：">
          <el-input v-model="key" placeholder="请输入题库名称" />
        </el-form-item>
        <el-form-item label="创建人：">
          <el-input v-model="admin" placeholder="请输入创建人" />
        </el-form-item>
        <el-form-item>
          <el-checkbox
            v-model="ismy"
            true-label="1"
            false-label="0"
            label="只看我创建的"
            size="large"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="danger" @click="delAll">批量删除</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div>
      <el-table
        :data="tableData"
        style="width: 100%"
        size="small"
        @selection-change="selectionChange"
        v-loading="loading"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="title" label="题库" #default="scope" width="450" align="center">
          <span
            style="color: #409eff; cursor: pointer"
            @click="toQuestions(scope.row.id)"
            >{{ scope.row.title }}
          </span>
        </el-table-column>
        <el-table-column prop="counts" label="题目数量" width="180" align="center"/>
        <el-table-column prop="addtime" label="创建时间" align="center">
          <template #default="scope">
          <span>{{ moment(scope.row.addtime).format('YYYY-MM-DD HH:mm') }}</span>
        </template>
          </el-table-column>
        <el-table-column prop="admin" label="创建人" align="center"/>
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="small"
              @click="toQuestions(scope.row.id)"
              >试题</el-button
            >
            <el-button link type="primary" size="small" @click="edit(scope.row)"
              >编辑</el-button
            >
            <el-button
              link
              type="primary"
              size="small"
              @click="del(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="currentPage4"
      v-model:page-size="pageSize4"
      :page-sizes="[10, 20, 30, 40]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      style="float: right;"
    />
  </div>

  <DatabaseDialog
    ref="dialogRef"
    :getListDialog="getList"
  ></DatabaseDialog>
</template>

<script lang="ts" setup>
import  moment  from "moment"
import {debounce}  from "../../../utils/throTtle"
import DatabaseDialog from '../../../components/database/DatabaseDialog.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { reactive, toRefs, onMounted, ref, watch, toRaw, nextTick,onActivated } from 'vue';
import {
  databaseList,
  databaseDelete,
  databaseDeleteall,
  
} from '../../../api/database';
import { useRouter } from 'vue-router';
const loading = ref(true)
const router = useRouter();

// 分页
const currentPage4 = ref(1);
const pageSize4 = ref(10);
const small = ref(false);
const background = ref(false);
const disabled = ref(false);

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
  data.psize = val;
  getList();
};
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  data.page = val;
  getList();
};
const data: any = reactive({
  page: 1,
  psize: 10,
  key: '', //搜索关键字(名称)
  admin: '', //创建人
  ismy: 0, //只看我的
});

const state: any = reactive({
  tableData: [],
  total: 0,
  ids: [],
});

const { key, admin, ismy } = toRefs(data);
const { tableData, total, ids } = toRefs(state);

onMounted(() => {
  getList(); //题库列表
});
onActivated(()=>{
  getList()
})
const dialogRef = ref<any>();
// 创建题库
const add = () => {
  dialogRef.value.dialogVisible = true;
};

const getList = async () => {
  let res: any = await databaseList(data);
  console.log('题库列表', res);
  if (res.errCode !== 10000) {
    ElMessage.error('数据请求失败！');
    return false;
  }
  state.tableData = res.data.list;
  state.total = res.data.counts;
  loading.value=false
};

// 查询
const search =debounce( () => {
  getList();
},500);

// 删除题库(单删)
const del = (id: any) => {
  console.log(id);
  ElMessageBox.confirm('你确定要删除吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      let res: any = await databaseDelete(id);
      console.log('删除题库(单删)', res);
      if (res.errCode !== 10000) {
        return false;
      }
      ElMessage({
        type: 'success',
        message: '删除成功!',
      });
      getList();
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      });
    });
};

// 获取批删的id
const selectionChange = (val: any) => {
  console.log(val);
  state.ids = val.map((item: any) => {
    console.log(item.id);
    // state.ids=item.id
    return item.id;
  });
  console.log(toRaw(state.ids));
};

// 批量删除
const delAll = async () => {
  console.log(toRaw(state.ids));

  ElMessageBox.confirm('你确定要删除选中的吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      let res: any = await databaseDeleteall(state.ids);
      console.log('批量删除题库', res);
      if (res.errCode !== 10000) {
        return false;
      }
      ElMessage({
        type: 'success',
        message: '删除成功!',
      });
      getList();
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      });
    });
};

// 编辑
const edit = (val: any) => {
  console.log('编辑', val);
  dialogRef.value.dialogVisible = true;
  nextTick(() => {
    //延迟函数  回显
    dialogRef.value.addData.title = val.title;
    dialogRef.value.addData.id = val.id;
    dialogRef.value.name = '题库修改';
  });
};

// 点击跳转到试题列表
const toQuestions = (id: any) => {
  router.push({ path: 'databasequestionlist', query: { id: id } });
};
</script>

<style lang="less" scoped>
.top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  p {
    font-size: 20px;
  }
}
// 分页
.el-pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
