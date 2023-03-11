<template>
<el-dialog
    v-model="dialogVisible"
    title="题库列表"
    width="70%"
    :before-close="handleClose"
  >
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
        </el-form-item>
      </el-form>
    </div>

    <div>
      <el-table
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column prop="title" label="题库"  style="width: auto">
          <template #default="scope">
             <el-radio-group v-model="radioId" class="ml-4">
              <el-radio :label="scope.row.id" size="large"><span style="margin-left: 10px;width: 50px;">{{ scope.row.title }}</span></el-radio> 
             </el-radio-group>
          </template>
          </el-table-column>
        <el-table-column prop="counts" label="题目数量"  />
        <el-table-column prop="addtime" label="创建时间" >
          <template #default="scope">
          <span>{{ moment(scope.row.addtime).format('YYYY-MM-DD HH:mm') }}</span>
        </template>
          </el-table-column>
        <el-table-column prop="admin" label="创建人" />
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
    />

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelForm">取消</el-button>
        <el-button type="primary" @click="submitForm">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import  moment  from "moment"
import {databasequestionList} from '../../api/database'
import { ElMessage, ElMessageBox } from 'element-plus';
import { reactive, toRefs, onMounted, ref, watch, toRaw,defineEmits } from 'vue';
import {
  databaseList,
  databaseDelete,
  databaseDeleteall,
} from '../../api/database';
// 分页
const radioId=ref('')//单选框
const currentPage4 = ref(1);
const pageSize4 = ref(10);
const small = ref(false);
const background = ref(false);
const disabled = ref(false);
// 题库列表
const getList = async () => {
  let res: any = await databaseList(data);
  // console.log('题库列表', res);
  if (res.errCode !== 10000) {
    ElMessage.error('数据请求失败！');
    return false;
  }
  state.tableData = res.data.list;
  state.total = res.data.counts;
};

// 查询
const search = () => {
  getList();
};
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
const emit=defineEmits(['showEmit','questionList'])
const dialogVisible = ref(true)
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
  editList: {},
});

const { key, admin, ismy } = toRefs(data);
const { tableData, total, ids, editList } = toRefs(state);

onMounted(() => {
  getList(); //题库列表
});



const handleClose = (done: () => void) => {
  emit('showEmit',false)
  // ElMessageBox.confirm('是否确认关闭弹窗')
  //   .then(() => {
  //     emit('showEmit',false)
  //     // done()
  //   })
  //   .catch(() => {
  //     // catch error
  //   })
}
// 点击确定
const submitForm= async ()=>{
  console.log('试卷id',radioId.value);

  if(!radioId.value){
    ElMessage.error('请选择题库')
    return false
  }
  // 获取题库试题列表
  // const res:any=await databasequestionList({databaseid:radioId.value}).catch(()=>{})
  // if (res.errCode !== 10000) {
  //   ElMessage.error(res.errMsg);
  //   return false;
  // }
  // console.log('题库列表',res);
 let data= tableData.value.filter((item:any)=>{
    if(item.id===radioId.value){
      return item
    }
  })
  let radioData={
    id:radioId.value,
    tit:data[0].title
  }
  emit('questionList',radioData)

  console.log(data[0].title);
  

  emit('showEmit',false)
}
// 点击取消
const cancelForm=()=>{
  emit('showEmit',false)
}
</script>

<style lang="less" scoped>

.dialog-footer button:first-child {
  margin-right: 10px;
}

/* 分页 */
.el-pagination{
  display: flex;
  justify-content: center;
}
/deep/.el-radio{
  span:first-of-type{
    width: 15px;
    border-radius: 50%;
  }
  span:last-of-type{
    width: 50px;
    text-align: center;
  }
}
</style>