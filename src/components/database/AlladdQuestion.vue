<template>
  <el-dialog
    v-model="dialogVisible"
    title="批量导入试题"
    width="40%"
    :before-close="handleClose"
  >
    <div style="height: 140px">
      <el-steps direction="vertical" :active="1">
        <el-step title="下载 试题模板，批量导入试题" :description="desc" />
        <el-step style="color: #c0c4cc;" title="上传填写好的试题表" />
      </el-steps>
    </div>
    <el-upload
      v-model:file-list="fileList"
      class="upload-demo"
      action="http://estate.eshareedu.cn/exam/api/test/upload"
      multiple
      :headers="header"
      :on-success="onSuccess"
      :on-error="onError"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :limit="3"
      :on-exceed="handleExceed"
    >
      <el-button style="margin-top: 10px;margin-left: 40px;" type="primary"
        >点击上传文件</el-button
      >
    </el-upload>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { databasequestionAddlist } from '../../api/database';
import { ref, toRefs, reactive } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import type { UploadProps, UploadUserFile } from 'element-plus';
import { useRoute } from 'vue-router';
const route = useRoute();

const props = defineProps({
  getList: {
    type: Function,
    required: true,
  },
});

const desc = ref(
  '注:从其他Excel或Word复制试题时请使用选择性粘贴 Word:右键一选择性粘贴-文本， Excel:右键一选择性粘贴一只勾选 “值”'
);

const dialogVisible = ref(true);

const emits = defineEmits(['closeDialog']);

const handleClose = (done: () => void) => {
  emits('closeDialog', false);
};

// 上传文件
const fileList = ref<UploadUserFile[]>([]);

const data = reactive({
  header: {
    Authorization: sessionStorage.getItem('token'),
  },
});
const { header } = toRefs(data);

const addData = reactive({
  databaseid: route.query.id,
  list: [],
});

const onSuccess = (res: any) => {
  console.log(res);
  console.log(res.errCode);
  if (res.errCode !== 10000) {
    ElMessage.error(res.errMsg);
    return false;
  }
  addData.list = res.data;
};

const onError=(val:any)=>{
  console.log(val);
  
}

const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
  console.log(file, uploadFiles);
};

const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
  console.log(uploadFile);
};

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning(
    `The limit is 3, you selected ${files.length} files this time, add up to ${
      files.length + uploadFiles.length
    } totally`
  );
};

const beforeRemove: UploadProps['beforeRemove'] = (uploadFile, uploadFiles) => {
  return ElMessageBox.confirm(
    `Cancel the transfert of ${uploadFile.name} ?`
  ).then(
    () => true,
    () => false
  );
};

// 取消
const cancel = () => {
  emits('closeDialog', false);
};
// 确定
const confirm = async () => {
  console.log(addData.list.length);
  
  if(addData.list.length==0){
    ElMessage.error('请先选择要上传的文件！');
    return false;
  }
  let result: any = await databasequestionAddlist(addData);
  console.log('题库试题批量添加', result);
  if (result.errCode !== 10000) {
    ElMessage.error(result.errMsg);
    return false;
  }
  ElMessage({
    message: '批量添加成功！',
    type: 'success',
  });
  props.getList();
  emits('closeDialog', false);
};
</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
