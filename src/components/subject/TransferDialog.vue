<template>
  <div>
    <el-dialog
    v-model="dialogVisible"
    title="可见老师"
    width="60%"
    :before-close="handleClose"
  >
  <div class="seleBox">
    <span>部门</span>
  <el-select v-model="seleValue" class="m-2" placeholder="请选择" @change="selectChang">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.name"
      :value="item.id"
      
    />
  </el-select>
  </div>
  <el-transfer v-model="value" :data="data" :titles="['未选','全选']" :props="props"/>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelForm">取消</el-button>
        <el-button type="primary" @click="confirm">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {departmentList} from '../../api/department'
import { ref,onMounted,reactive,toRefs,defineEmits} from 'vue'
import { ElMessageBox } from 'element-plus'
const emit=defineEmits(['transferEmit','showEmit'])
interface Idata{
  options:Array<any>
  seleValue:string
  props:Iprop
}
interface Iprop{
  key:string,
  label:string
}
const dialogData:Idata=reactive({
  seleValue:'',
  options:[],
  props:{
    key:'id',
    label:'name'
  }
})
// 穿梭框数据
const data = ref()
const value = ref([])
const {options,seleValue,props} =toRefs(dialogData)


const dialogVisible = ref(true)

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('是否要关闭弹窗?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}
// 获取部门列表
const getList= async()=>{
  const res:any=await departmentList().catch(()=>{})
  console.log('部门列表',res);
  if(res.errCode!==10000){
    return false
  }
  options.value=res.data.list
}
// 下拉框点击事件
const selectChang=(val: any)=>{
  options.value.forEach(item=>{
    if(item.id===val){
      item.children==null?data.value=[]:data.value=[...item.children]  
    }
  })

}
onMounted(()=>{
  getList()
})
// 点击确定
const confirm=()=>{
  console.log('确定',value.value);
  emit('transferEmit',value.value)
  emit('showEmit',false)
}
// 点击取消
const cancelForm=()=>{
  emit('showEmit',false)
}


</script>

<style lang="less" scoped>
.seleBox{
margin-bottom: 30px;
  span{
    margin-right: 10px;
  }
}
.dialog-footer button:first-child {
  margin-right: 10px;
}


</style>