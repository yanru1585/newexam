<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="批量导入试题"
      width="50%"
      :before-close="handleClose"
    >
      <div style="height: 200px; width: 90%; margin: auto" class="stepBox">
        <el-steps direction="vertical" :active="1">
          <el-step
            title="下载 试题模板 批量导入试题"
            description="注:从其他Excel或Word复制试题时请使用选择性粘贴 Word:右键一选择性粘贴-文本， Excel:右键一选择性粘贴一只勾选 “值”"
          >
          </el-step>
          <el-step title="上传填写好的试题表" />
        </el-steps>
      </div>
      <el-upload
        v-model:file-list="fileList"
        class="upload-demo"
        action="http://estate.eshareedu.cn/exam/api/test/upload"
        :headers="header"
        multiple
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-success="uploadSuccess"
        :on-error="uploadError"
        :before-remove="beforeRemove"
        :limit="3"
        :on-exceed="handleExceed"
      >
        <el-button type="primary">点击上传文件</el-button>
        <template #tip> </template>
      </el-upload>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelForm">取消</el-button>
          <el-button type="primary" @click="confirm"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {htmlEncode}  from '../../utils/ByRegExp';
import { ref, reactive, toRefs, defineEmits } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { UploadProps, UploadUserFile } from 'element-plus';
const emit = defineEmits(['subjectEmit', 'showEmit']); 
interface Isubjet {
  subjectList: Array<any>;
}
const subjectData: Isubjet = reactive({
  subjectList: [],
});
const { subjectList } = toRefs(subjectData);
const fileList = ref<UploadUserFile[]>([]);
// 上传接口调取成功status为200
const uploadSuccess = (res: any) => {
  console.log('文件上传成功', res);
  if (res.errCode !== 10000) {
    ElMessage.error(res.errMsg);
    return false;
  }
  // 文件上传成功
  // subjectList.value = [...res.data];
  subjectList.value=res.data.map(((item: { title: any; })=>({...item,title:htmlEncode(item.title)})))
  console.log(res.data);
};

// 文件上传失败
const uploadError = () => {
  ElMessage.error('文件上传失败');
};

const data = reactive({
  header: {
    Authorization: sessionStorage.getItem('token'),
  },
});
const { header } = toRefs(data);
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
const dialogVisible = ref(true);

const handleClose = (done: () => void) => {
  emit('showEmit', false);
  // ElMessageBox.confirm('是否取消批量上传?')
  //   .then(() => {
  //     emit('showEmit', false);
  //   })
  //   .catch(() => {
  //     // catch error
  //   });
};
// 点击确定
const confirm = () => {
  emit('subjectEmit', [...subjectList.value]);
  emit('showEmit', false);
};
// 点击取消
const cancelForm = () => {
  emit('showEmit', false);
};
</script>

<style lang="less" scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
/deep/.el-step__description {
  margin-top: 20px;
}
.upload-demo {
  width: 80%;
  margin: 0 auto;
}
</style>
