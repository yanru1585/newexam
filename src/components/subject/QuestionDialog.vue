<template>
  <el-dialog
    v-model="dialogVisible"
    :title="databaseData.tit+'题库列表'"
    width="60%"
    :before-close="handleClose"
  >
    <div>
      <el-form :inline="true" :model="data" class="demo-form-inline">
        <el-form-item label="题目名称">
          <el-input v-model="key" placeholder="请输入题目名称" />
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
        </el-form-item>
      </el-form>
    </div>

    <div>
      <el-table
        :data="tableData"
        style="width: 100%"
        @selection-change="selectionChange"
      >
      <el-table-column type="selection" style="width: 20px;"/>
      <el-table-column prop="title" label="题目名称" width="500" >
        <template #default="scope">
          <span style="color: #409eff" v-html="scope.row.title"></span>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="题目类型" fixed="right" />
      <el-table-column prop="scores" label="分数" fixed="right"/>
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

    <template #footer >
      <div style="display: inline; margin-right: 70%;">已选<span>{{questionNum}}</span>道题</div>
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

import { ElMessage, ElMessageBox } from 'element-plus';
import { reactive, toRefs, onMounted,defineProps, ref, watch, toRaw,defineEmits } from 'vue';
import {databasequestionList} from '../../api/database'
const emit=defineEmits(['qushowEmit','questionsEmit'])
const dialogVisible = ref(true)
// 分页

const currentPage4 = ref(1);
const pageSize4 = ref(10);
const small = ref(false);
const background = ref(false);
const disabled = ref(false);
const props =defineProps({
  databaseData:{
    type:Object,
    required:true
  }
})
const types: any = ref(['单选题', '多选题', '判断题', '填空题', '问答题']);
const data: any = reactive({
  page: 1,
  psize: 10,
  key: '', //题目名称
  type:'',//题目类型
  databaseid:props.databaseData.id
});
const {type} =toRefs(data)
const state: any = reactive({
  tableData: [],
  total: 0,
  questionNum:0,
  questions:[]
});

const { key, } = toRefs(data);
const { tableData, total,questionNum,questions } = toRefs(state);
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
console.log('接收题库参数',props.databaseData);
// 查询
const search = () => {
  getList();
};
 // 获取试题列表
const getList=async ()=>{
  
  const res:any=await databasequestionList(data).catch(()=>{})
  if (res.errCode !== 10000) {
    ElMessage.error(res.errMsg);
    return false;
  }
  state.tableData = res.data.list;
  state.total = res.data.counts;
  console.log('题库列表',res);

}
onMounted(()=>{
  getList()
})
const handleClose = (done: () => void) => {
  ElMessageBox.confirm('是否确认关闭弹窗')
    .then(() => {
      emit('qushowEmit',false)
      // done()
    })
    .catch(() => {
      // catch error
    })
}
// 点击确定
const submitForm= async ()=>{

  emit('questionsEmit',toRaw(questions.value))
  emit('qushowEmit',false)
}
// 点击取消
const cancelForm=()=>{
  emit('qushowEmit',false)
}
// 获取批删的id
const selectionChange = (val: any) => {
  console.log('多选',val);
  questionNum.value=val.length
  questions.value=[...val]
  console.log( '题目列表',questions.value);
};
</script>

<style lang="less" scoped>
/* 分页 */
.el-pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}


</style>