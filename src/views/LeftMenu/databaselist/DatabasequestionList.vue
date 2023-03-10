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
          <el-button @click="addTest">添加试题</el-button>
          <el-button type="primary" class="ml-2" @click="isShowAdd=true">批量添加试题</el-button>
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
    <el-table
      :data="tableData"
      style="width: 100%"
      @selection-change="selectionChange"
      size="small"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="title" label="题目名称" width="450">
        <template #default="scope">
          <span @click="testDetail(scope.row)" style="color: #409eff;cursor: pointer" v-html="scope.row.title"></span>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="题目类型" width="180" />
      <el-table-column prop="addtime" label="创建时间">
        <template #default="scope">
          <el-popover
            placement="top"
            :width="100"
            trigger="hover"
            :content="scope.row.addtime.slice(0, 16)"
          >
            <template #reference>
              <span>{{ scope.row.addtime }}</span>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="admin" label="创建人" />
      <el-table-column fixed="right" label="操作" width="110">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="compile(scope.row)">编辑</el-button>
          <el-button link type="primary" size="small" @click="del(scope.row.id)"
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
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>

  <!-- 添加试题的抽屉 -->
  <AddtestDrawer
    v-if="isAddtestDrawer"
    :getList="getList"
    :questionData="questionData"
    @closeDrawer="closeDrawer"
  />
  <!-- 单条试题详情的抽屉 -->
  <DatabaseDetail v-if="isDatabaseDetail" :getEestDetail="getEestDetail" @closeDrawer="closeDrawer"/>

  <!-- 批量导入试题 -->
  <AlladdQuestion @closeDialog="closeDialog" :addUrl="addTestUrl" :getList="getList" v-if="isShowAdd"/>
</template>

<script lang="ts" setup>
import {Downblob} from '../../../utils/down'
import AddtestDrawer from '../../../components/database/AddtestDrawer.vue';
import DatabaseDetail from '../../../components/database/DatabaseDetail.vue'
import AlladdQuestion from '../../../components/database/AlladdQuestion.vue';
import { ArrowLeft } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { reactive, toRefs, onMounted, ref, toRaw } from 'vue';
import {
  databasequestionList,
  databasequestionDelete,
  databasequestionDeleteall,
  dataExportExcel
} from '../../../api/database';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const Data=reactive({
  questionData:{}

})
const {questionData} =toRefs(Data)
const addTestUrl=ref('http://estate.eshareedu.cn/exam/upload/question.xlsx')
const isAddtestDrawer = ref(false);
const isDatabaseDetail = ref(false);
const isShowAdd=ref(false)

// 接受子组件传过来的值  关闭弹窗
const closeDialog=(val:any)=>{
  isShowAdd.value=val
}

// 接收从子组件传过来的值  关闭抽屉
const closeDrawer = (val: any) => {
  isAddtestDrawer.value = val;
  isDatabaseDetail.value=val
};

// 点击展开单条试题详情的抽屉
const testDetail=(val:any)=>{
  isDatabaseDetail.value=true
  console.log(val);
  state.getEestDetail=val
}

// 添加试题
const addTest = () => {
  isAddtestDrawer.value = true;
};
// 点击编辑
const compile=(data:any)=>{
  console.log('点击题库编辑',data);
  questionData.value=data
  isAddtestDrawer.value = true;

}


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
  ids: [],
  compileData: {},
  getEestDetail:{}
});
const { key, type, admin ,databaseid} = toRefs(data);
const { obj, tableData, total, compileData,getEestDetail } = toRefs(state);

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
// 点击导出excel
const exportExcel = async() => {
  console.log(1234544446);
  let res = await dataExportExcel(databaseid.value).catch(()=>{})
  Downblob(res,obj.value.title+'.xlsx')

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
