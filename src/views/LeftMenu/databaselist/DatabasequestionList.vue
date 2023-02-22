<template>
  <div>
    <el-page-header :icon="ArrowLeft" @back="back">
      <template #content>
        <span class="text-large font-600 mr-3">
          《{{ obj.title }}》试题列表
        </span>
      </template>
      <template #extra>
        <div class="flex items-center">
          <el-button>添加试题</el-button>
          <el-button type="primary" class="ml-2">批量添加试题</el-button>
        </div>
      </template>
    </el-page-header>

    <el-form :inline="true" :model="data" class="demo-form-inline">
      <el-form-item label="题库名称：">
        <el-input v-model="key" placeholder="请输入题库名称" />
      </el-form-item>
      <el-form-item label="创建人：">
        <el-input v-model="admin" placeholder="请输入创建人" />
      </el-form-item>
      <el-form-item label="题目类型：">
        <el-select style="width: 160px" v-model="type" placeholder="请选择">
          <el-option
            v-for="(item, index) in types"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="danger">批量删除</el-button>
        <el-button>导出excel</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" size="small">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="title" label="题目名称" width="450">
        <template #default="scope">
          <span style="color: #409eff;" v-html="scope.row.title"></span>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="题目类型" width="180" />
      <el-table-column prop="addtime" label="创建时间" />
      <el-table-column prop="admin" label="创建人" />
      <el-table-column fixed="right" label="操作" width="110">
        <template #default="scope">
          <el-button link type="primary" size="small">编辑</el-button>
          <el-button link type="primary" size="small">删除</el-button>
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
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { ArrowLeft } from '@element-plus/icons-vue';

import { ElMessage } from 'element-plus';
import { reactive, toRefs, onMounted, ref } from 'vue';
import { databasequestionList } from '../../../api/database';
import { useRoute, useRouter } from 'vue-router';

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

const back = () => {
  console.log(12345);
  router.push('databaselist');
};

const route = useRoute();

const types: any = ref(['单选题', '多选题', '判断题', '填空题', '问答题']);

const data: any = reactive({
  databaseid: route.query.id, //题库id
  page: 1,
  psize: 10,
  key: '', //搜索关键字(名称)
  tags: '', //标签
  type: '', //类型
  admin: '', //创建人
});

const state: any = reactive({
  obj: {},
  tableData: [],
  total:0
});
const { key, type, admin } = toRefs(data);
const { obj, tableData,total } = toRefs(state);

onMounted(() => {
  getList();
});

const getList = async () => {
  let res: any = await databasequestionList(data);
  console.log('根据题库id获取试题列表', res);
  if (res.errCode !== 10000) {
    ElMessage.error('数据请求失败！');
    return false;
  }
  state.obj = res.data.database;
  state.tableData = res.data.list;
  state.total = res.data.counts;
};

// 查询
const search = () => {
  console.log(data);

  getList();
};
</script>

<style lang="less" scoped>
.el-form {
  margin: 20px 0;
}

// 分页
.el-pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
