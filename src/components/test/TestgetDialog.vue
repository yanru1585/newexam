<template>
  <el-dialog
    v-model="dialogVisible"
    :title="getTestData.title"
    width="80%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <div
      style="display: flex; justify-content: space-between; margin-top: -30px"
    >
      <div style="width: 70%">
        <el-row>
          <el-col :span="3">总分</el-col>
          <el-col :span="3">通过分数</el-col>
          <el-col :span="3">考试时长</el-col>
          <el-col :span="15">开放时间</el-col>
        </el-row>
        <el-row>
          <el-col :span="3">{{ getTestData.scores }}</el-col>
          <el-col :span="3">{{ getTestData.pastscores }}</el-col>
          <el-col :span="3">{{
            getTestData.limittime == 0 ? '不限时' : getTestData.limittime
          }}</el-col>
          <el-col :span="15">
            <span v-if="getTestData.begintime && getTestData.endtime"
              >{{ getTestData.begintime }}至{{ getTestData.endtime }}</span
            >
            <span v-else>时间不限</span>
          </el-col>
        </el-row>
      </div>
      <div>
        <el-button @click="exportExcel">导出excel</el-button>
      </div>
    </div>

    <div class="content">
      <div
        v-for="(item, index) in questionsList"
        :key="index"
        style="font-size: 15px; padding: 0 15px"
      >
        <div style="display: flex; margin-top: 20px">
          <p style="margin-right: 20px">
            <span>{{ index + 1 }}.</span>{{ item.type }}
          </p>
          <p>
            分值：<span>{{ item.scores }}</span>
          </p>
        </div>
        <p style="color: #909090; padding: 10px 0" v-html="item.title"></p>
        <div
          style="display: flex; flex-direction: column"
          v-if="item.type == '单选题' || item.type == '多选题'"
        >
          <el-radio
            :style="
              item.answer.includes(item1.answerno)
                ? 'background-color: #eefaf6;padding: 0 15px;margin-bottom:10px'
                : 'padding: 0 15px;margin-bottom:10px'
            "
            :label="1"
            size="large"
            v-for="(item1, index1) in item.answers"
            :key="index1"
            ><span>{{ item1.answerno }}</span
            >:<span>{{ item1.content }}</span></el-radio
          >
        </div>
        <p
          v-else-if="item.type == '判断题'"
          style="color: #70d3b2; background-color: #eefaf6; padding: 13px"
        >
          正确答案&nbsp;&nbsp;&nbsp;{{ item.answer }}
        </p>
        <div v-else-if="item.type == '填空题'">
          <p
            style="color: #70d3b2;background-color: #eefaf6;padding: 13px;margin-bottom: 10px;"
          >
            正确答案&nbsp;&nbsp;&nbsp;{{ item.answer }}
          </p>
          <p style="color: #9dadbc; background-color: #f5faff; padding: 13px">
            答案解析&nbsp;&nbsp;&nbsp;{{ item.explains }}
          </p>
        </div>
        <div v-else-if="item.type == '问答题'">
          <p style="color: #9dadbc; background-color: #f5faff; padding: 13px">
            答案解析&nbsp;&nbsp;&nbsp;{{ item.explains }}
          </p>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  ref,
  defineEmits,
  defineProps,
  reactive,
  onMounted,
  toRefs,
} from 'vue';
import { ElMessageBox } from 'element-plus';
import { testGet } from '../../api/admin';
import  {oneSubject}  from '../../api/subjects';
import {testExportExcel} from '../../api/database'
import {Downblob} from '../../utils/down'

const dialogVisible = ref(true);

const props = defineProps({
  getData: {
    type: Object,
    required: true,
  },
});

interface Idata {
  getTestData: any;
  questionsList: Array<any>;
  exportId:number,
  exportName:string
}
const data: Idata = reactive({
  getTestData: {},
  questionsList: [],
  exportId:0,
  exportName:''
});
const { getTestData, questionsList } = toRefs(data);

onMounted(() => {
  getTestInfo();
});

const getTestInfo = async () => {
  console.log('详情id', props.getData);
  if (props.getData.type === '考试') {
    const res: any = await testGet(props.getData.getId);
    console.log('根据id获取单个考试信息', res);
    if (res.errCode !== 10000) {
      return false;
    }
    data.getTestData = res.data;
    data.questionsList = res.data.questions;
    data.exportId=res.data.id
    data.exportName=res.data.title
    console.log(data.getTestData);
    return false
  }
  if(props.getData.type ==='试卷') {
    console.log(9999999999);
    const subjectres:any =await  oneSubject({id:props.getData.getId}).catch(()=>{});
    console.log('试卷详情', subjectres);
    if (subjectres.errCode !== 10000) {
      return false;
    }
    data.getTestData = subjectres.data;
    data.questionsList = subjectres.data.questions;
    data.exportId=subjectres.data.id
    data.exportName=subjectres.data.title
    console.log(data.getTestData);
  }
};

// 导出excel
const exportExcel=async()=>{
  let res:any = await testExportExcel(data.exportId)
  console.log(res);
  
  Downblob(res,data.exportName)
}

const emits = defineEmits(['isshowDialog']);

const handleClose = (done: () => void) => {
  emits('isshowDialog', false);
};
</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}

.el-row {
  margin-bottom: 15px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.content {
  height: 500px;
  display: block;
  overflow-y: scroll;
  border-top: 1px #eee solid;
  margin-top: 15px;
}
.el-radio.el-radio--large /deep/ .el-radio__inner {
  width: 20px !important;
  height: 20px !important;
}
</style>
