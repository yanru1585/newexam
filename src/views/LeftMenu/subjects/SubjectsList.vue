<template>
  <div>
    <div
      style="display: flex; justify-content: space-between; margin-top: 10px"
    >
      <h3>试卷管理</h3>
      <el-button type="primary" @click="addSubject">创建考试</el-button>
    </div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="关键字">
        <el-input v-model="formInline.key" placeholder="考试名称" />
      </el-form-item>
      <el-form-item label="创建人">
        <el-input v-model="formInline.admin" placeholder="创建人" />
      </el-form-item>
      <el-form-item>
        <el-checkbox-group v-model="checkIsmy" @change="checkoutIsmy">
          <el-checkbox
            label="true"
            value="只看我创建的"
            name="type"
            :checked="ischeck"
          >
            只看我创建的
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="seacher">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" style="width: auto" v-loading="loading">
      <el-table-column label="试卷名称" align="center">
        <template #default="scope">
          <span
            style="color: #409eff; cursor: pointer"
            @click="getDetail(scope.row.id)"
            >{{ scope.row.title }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="counts" label="题量" align="center" />
      <el-table-column prop="singles" label="单选" align="center" />
      <el-table-column prop="multiples" label="多选" align="center" />
      <el-table-column prop="judges" label="判断" align="center" />
      <el-table-column prop="blanks" label="填空" align="center" />
      <el-table-column prop="qas" label="问答" align="center" />
      <el-table-column prop="scores" label="总分" align="center" />
      <el-table-column prop="admin" label="创建人" align="center" />
      <el-table-column prop="addtime" label="更新时间" align="center" />
      <el-table-column fixed="right" label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            size="small"
            @click="compile(scope.row.id)"
            >编辑</el-button
          >
          <span>|</span>
          <el-button
            link
            type="primary"
            size="small"
            @click="getDel(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="formInline.page"
      v-model:page-size="formInline.psize"
      :page-sizes="[5, 10, 15, 20]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <Test
      :getData="getData"
      v-if="testShow"
      @isshowDialog="isshowDialog"
    ></Test>
  </div>
</template>

<script lang="ts" setup>
import { debounce } from '../../../utils/throTtle';
import Test from '../../../components/test/TestgetDialog.vue';
import { subjectList, DelSubject } from '../../../api/subjects';
import {
  reactive,
  toRefs,
  onMounted,
  ref,
  watchEffect,
  onActivated,
} from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
const loading = ref(true);
const router = useRouter();
const small = ref(false);
const background = ref(false);
const disabled = ref(false);
interface Iform {
  key: string;
  admin: string;
  ismy: number;
  page: number;
  psize: number;
}
interface Igetdata {
  getId: number;
  type: string;
}
interface Idata {
  formInline: Iform;
  tableData: Array<any>;
  total: number;
  checkIsmy: Array<any>;
  ischeck: Boolean;
  // getId:number,
  testShow: boolean;
  getData: Igetdata;
}
const data: Idata = reactive({
  getData: {
    getId: 0,
    type: '试卷',
  },
  formInline: {
    //搜索框数据
    key: '', //搜素关键字
    admin: '', //创建人
    ismy: 0, //只看我的
    page: 1, //页码
    psize: 5, //显示数量
  },
  checkIsmy: [], //多选框
  tableData: [], //表格数据
  total: 0, //共计多少条
  ischeck: false,
  // getId:0,//试卷详情id
  testShow: false, //控制试卷详情显示隐藏
});

const { formInline, tableData, total, checkIsmy, ischeck, getData, testShow } =
  toRefs(data);
// 点击查询
const seacher = debounce(() => {
  getList();
  // console.log(formInline.value);
}, 500);
// 获取试卷列表
const getList = async () => {
  const res: any = await subjectList(formInline.value).catch(() => {});
  console.log('试卷列表', res);
  if (res.errCode !== 10000) {
    return false;
  }
  tableData.value = res.data.list;
  total.value = res.data.counts;
  console.log(tableData.value);
  loading.value = false;
};
// 分页触发事件
const handleSizeChange = (val: number) => {
  // console.log(`${val} items per page`)
  formInline.value.psize = val;
  getList();
};
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  formInline.value.page = val;
  getList();
};
onMounted(() => {
  getList();
}),
  onActivated(() => {
    getList();
  });
// 触发只看我创建的
const checkoutIsmy = () => {
  console.log(checkIsmy.value);
  formInline.value.admin = '';
  formInline.value.ismy = 1;
  console.log(formInline.value.admin);
};
// 触发创建人输入框时
watchEffect(() => {
  if (formInline.value.admin) {
    checkIsmy.value = [];
  }
});
// 点击创建试卷
const addSubject = () => {
  router.push('/SubjectsAdd');
};
// 点击删除
const getDel = (id: any) => {
  console.log('删除', id);
  ElMessageBox.confirm('是否确认删除?', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const res: any = await DelSubject({ id: id }).catch(() => {});
      console.log(res);
      if (res.errCode !== 10000) {
        return false;
      }
      ElMessage({
        type: 'success',
        message: '删除成功！',
      });
      getList();
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消删除！',
      });
    });
};
// 点击获取试卷详情
const getDetail = (id: any) => {
  console.log('点击试卷详情', id);
  getData.value.getId = id;
  testShow.value = true;
};
// 出发自定义事件
const isshowDialog = (data: any) => {
  console.log('子组件试卷详情', data);
  testShow.value = data;
};
// 点击编辑
const compile = (id: any) => {
  console.log('点击编辑', id);
  router.push({ path: '/SubjectsAdd', query: { id: id } });
};
</script>
<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
  h3 {
    font-size: 20px;
    color: rgb(33, 33, 33);
    font-weight: normal;
  }
}

.el-form {
  margin-top: 10px;
}
.el-table {
  font-size: 12px;
}
.el-pagination {
  justify-content: right;
  
}
</style>
