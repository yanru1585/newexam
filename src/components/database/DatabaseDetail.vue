<template>
  <div>
    <el-drawer
      v-model="table"
      title="试题详情"
      direction="rtl"
      size="40%"
      :modal="false"
      :before-close="handleClose"
    >
      <div>
        <div style="display: flex">
          <p style="color: #666; margin-right: 20px">
            {{ getEestDetail.type }}
          </p>
          <span style="color: #999; font-size: 14px"
            >分值：{{ getEestDetail.scores }}</span
          >
        </div>
        <p
          style="margin-top: 10px; margin-bottom: 10px"
          v-html="getEestDetail.title"
        ></p>
        <div
          style="display: flex; flex-direction: column"
          v-if="getEestDetail.type == '单选题' || getEestDetail.type == '多选题'"
        >
          <el-radio
            :class="getEestDetail.answer.includes(item.answerno)? 'selRadio': 'noselRadio'"
            label="1"
            size="large"
            v-for="(item, index) in getEestDetail.answers"
            ><span>{{ item.answerno }}</span
            >:<span>{{ item.content }}</span></el-radio
          >
        </div>
        <div v-if="getEestDetail.type == '判断题'">
          <p style="background-color: #f0faf6;color: #84d5b1;padding: 12px;">正确答案：{{ getEestDetail.answer }}</p>
        </div>
        <div v-if="getEestDetail.type == '填空题'||getEestDetail.type == '问答题'">
          <p v-if="getEestDetail.type == '填空题'" style="background-color: #f0faf6;color: #84d5b1;padding: 12px;margin-bottom: 15px;">正确答案：{{ getEestDetail.answer }}</p>
          <p style="background-color: #f6faff;color: #a0adbd;padding: 12px;">答案解析：{{ getEestDetail.explains }}</p>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { ElDrawer, ElMessageBox } from 'element-plus';

const table = ref(true);

const props = defineProps({
  getEestDetail: {
    type: Object,
    required: true,
  },
});
console.log(props.getEestDetail);
const detail = props.getEestDetail;
console.log(detail);

const emit = defineEmits(['closeDrawer']);

const handleClose = (done: any) => {
  emit('closeDrawer', false);
};
</script>

<style lang="less" scoped>
.selRadio {
  width: 450px;
  font-size: 14px;
  color: #000;
  background-color: #f0faf6;
  padding-left: 8px;
  margin-bottom: 8px;
}
.noselRadio {
  font-size: 14px;
  color: #000;
  padding-left: 8px;
  margin-bottom: 8px;
}
</style>
