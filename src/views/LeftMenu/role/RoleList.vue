<template>
  <div>
    <div style="display: flex; justify-content: space-between">
      <p class="toptitle">角色管理</p>
      <el-button type="primary" @click="isShowDialog = true"
        >添加角色</el-button
      >
    </div>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="名称" />
      <el-table-column label="操作" fixed="right" width="150">
        <template #default="scope">
          <el-button type="primary" link size="small" @click="edit(scope.row)"
            >编辑</el-button
          >
          <el-button type="primary" link size="small" @click="del(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="currentPage4"
      v-model:page-size="pageSize4"
      :page-sizes="[10, 20, 30, 40]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="counts"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <RoleDialog
      v-if="isShowDialog"
      @closeDialog="closeDialog"
      :getList="getList"
      style="margin-top: 18px"
      :editData="editData"
    />
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, toRefs, ref } from 'vue';
import { rolelist, roledel } from '../../../api/admin';
import { ElMessage, ElMessageBox } from 'element-plus';
import RoleDialog from './Roleadd.vue';

const isShowDialog = ref(false);

// 子组件传过来的
const closeDialog = (val: any) => {
  console.log(val);
  isShowDialog.value = val;
};

// 分页
const currentPage4 = ref(1);
const pageSize4 = ref(10);
const small = ref(false);
const background = ref(false);
const disabled = ref(false);

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
  params.psize = val;
  getList();
};
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  params.page = val;
  getList();
};

const params: any = reactive({
  page: 1,
  psize: 10,
});

interface Idata {
  tableData: Array<any>;
  counts: number;
  editData:Object;

}
const data: Idata = reactive({
  tableData: [],
  counts: 0,
  editData:{}
});
const { tableData, counts,editData } = toRefs(data);

onMounted(() => {
  getList();
});

const getList = async () => {
  let res: any = await rolelist(params);
  console.log('获取角色', res);
  if (res.errCode !== 10000) {
    ElMessage.error('角色列表请求失败!');
    return false;
  }
  data.tableData = res.data.list;
  data.counts = res.data.counts;
};
// 删除
const del = async (val: any) => {
  ElMessageBox.confirm('你确定要删除吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      let res: any = await roledel(val);
      console.log('删除角色', res);
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
  console.log(val);
  data.editData=val
  isShowDialog.value=true
};
</script>

<style scoped lang="less">
.toptitle {
  font-size: 22px;
  // font-weight: bold;
}
.el-pagination {
  display: flex;
  justify-content: right;
  margin-top: 15px;
}
</style>
