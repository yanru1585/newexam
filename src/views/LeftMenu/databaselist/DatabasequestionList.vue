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
        <el-button type="danger" @click="delAll">批量删除</el-button>
        <el-button @click="exportExcel">导出excel</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" @selection-change="selectionChange" size="small">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="title" label="题目名称" width="450">
        <template #default="scope">
          <span style="color: #409eff" v-html="scope.row.title"></span>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="题目类型" width="180" />
      <el-table-column prop="addtime" label="创建时间" />
      <el-table-column prop="admin" label="创建人" />
      <el-table-column fixed="right" label="操作" width="110">
        <template #default="scope">
          <el-button link type="primary" size="small">编辑</el-button>
          <el-button link type="primary" size="small" @click="del(scope.row.id)">删除</el-button>
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
// import FileSaver from 'file-saver';
// import XLSX from 'xlsx';
// import {exportExcel} from '../../../utils/exportExcel'
import { ArrowLeft } from '@element-plus/icons-vue';

import { ElMessage ,ElMessageBox} from 'element-plus';
import { reactive, toRefs, onMounted, ref,toRaw } from 'vue';
import { databasequestionList,databasequestionDelete,databasequestionDeleteall } from '../../../api/database';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();



const exportExcel = () => {
  console.log(1234544446);
  
  //因为此处有分页，每页展示14条数据，在方法调用的开始，展示所有数据，导出之后再把条数更改过来
  // data.psize = state.tableData.length;
  // setTimeout(() => {
  //   var wb = XLSX.utils.table_to_book(document.querySelector('.el-table'));
  //   /* get binary string as output */
  //   var wbout = XLSX.write(wb, {
  //     bookType: 'xlsx',
  //     bookSST: true,
  //     type: 'array',
  //   });
  //   try {
  //     FileSaver.saveAs(
  //       new Blob([wbout], { type: 'application/octet-stream' }),
  //       '汇总统计.xlsx'
  //     );
  //   } catch (e) {
  //     if (typeof console !== 'undefined') console.log(e, wbout);
  //   }
  //   //在此处更改回来
  //   data.psize = 10;
  //   return wbout;
  // }, 100);
};

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
  total: 0,
  ids:[]
});
const { key, type, admin } = toRefs(data);
const { obj, tableData, total } = toRefs(state);

// const titleArr = ['id','巡河次数','完成次数','巡河人员','时间']//表头中文名
// exportExcel(state.tableData, 'test', titleArr, 'sheetName');

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

// 题库试题删除(单删)
const del = (id: any) => {
  console.log(id);
  ElMessageBox.confirm('你确定要删除吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      let res: any = await databasequestionDelete(id);
      console.log('题库试题删除(单删)', res);
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
      let res: any = await databasequestionDeleteall(state.ids);
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
