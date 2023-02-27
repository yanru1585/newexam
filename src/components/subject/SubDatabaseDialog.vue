<template>
  <el-dialog v-model="outerVisible" title="题库添加" :before-close="handleClose">
    <template #default>
      <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="rules"
    label-width="120px"
    class="demo-ruleForm"
    :size="formSize"
    status-icon
  >
    <el-form-item label="题库名称" prop="name">
      <el-input v-model="ruleForm.name" placeholder="请输入题库名称"/>
    </el-form-item>
    <el-form-item label="被他人使用" prop="resource">
      <el-radio-group v-model="ruleForm.isshow" :change="radioChange()">
        <el-radio label="1" >允许所有老师使用</el-radio>
        <el-radio label="2" >不允许任何老师使用</el-radio>
        <el-badge :value="badge" class="item" type="primary">
          <el-radio label="3" @click="getPortion">允许部分老师使用</el-radio>
        </el-badge>
        
      </el-radio-group>
    </el-form-item>
    </el-form>
      <el-dialog
        v-model="innerVisible"
        width="60%"
        title="可见老师"
        append-to-body
      >
      <span style="margin: 0px 10px 0px 20px;">部门</span>

      <el-select v-model="select" class="m-2" style="margin-bottom: 20px;" placeholder="请选择" @change="selectChang">
        <el-option
          v-for="(item,index) in options"
          :key="index"
        :label="item.name"
        :value="item.id"
        />
      </el-select>
      <el-transfer v-model="value" :data="transdata" style="margin-left: 10%;" :props="props"/>
      <div class="dialog-footer" style="margin-top: 20px; text-align: right;">
        <el-button  @click="innerVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">
          确定
        </el-button>
      </div>
      </el-dialog>
    
    </template>
   
    <template #footer>
      <div class="dialog-footer">
        <el-button  @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {databaseAdd} from '../../api//database'
import {teacherlsit} from '../../api/admin'
import {departmentList} from '../../api/department'
import { reactive, ref,onMounted ,toRefs,toRaw,defineEmits} from 'vue'
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus'

import LoginView from '../../views/LoginView.vue'
const emit=defineEmits(['showEmit'])
const outerVisible = ref(true)
const innerVisible = ref(false)
const transdata = ref<Option[]>()
// const value = ref([])
interface Idata{
  value:Array<any>
  badge:number
  options:Array<any>
    select:string
    props:Iprop
}
interface Option {
  key: number
  label: string
  disabled: boolean
}
interface Iprop{
  key:string,
  label:string
}

const data:Idata=reactive({
  value:[],//穿梭框
  options:[],//
  select:'',//下拉框数据
  badge:0,//徽章
  props:{
    key:'id',
    label:'name'
  }
})
const {options,select,props,badge,value}=toRefs(data)
const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
interface Irule{
  id:number,  
  name: string,//题库名称
  isshow:any,//可见老师
  limits:Array<any>,
}
const ruleForm:Irule = reactive({
  id:0,  
  name: '',//题库名称
  isshow:'1',//可见老师
  limits:[],//可见老师数组
})
// const {limits} =
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入题库名称', trigger: 'blur' },
  ]
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate( async(valid: any, fields: any) => {
    if (valid) {
      console.log('submit!')
      const res:any=await databaseAdd(ruleForm).catch(()=>{})
      console.log('添加题库',res);
      if(res.errCode!==10000){
        return false
      }
      ElMessage.success('添加成功')
      emit('showEmit',false)

    } else {
      console.log('error submit!', fields)
    }
  })
}

// 下拉框点击事件
const selectChang=async (val: any)=>{
console.log('点击下拉',val);
const res:any=await teacherlsit({depid:val}).catch(()=>{})
console.log('可见老师',res);
if(res.errCode!==10000){
  return false
}
transdata.value=res.data.list

}
const handleClose = (done: () => void) => {
  ElMessageBox.confirm('是否确认关闭弹窗?')
    .then(() => {
      emit('showEmit',false)
    })
    .catch(() => {
      // catch error
    })
}

// 获取部门列表
const getDepartmenList= async()=>{
  const res:any =await departmentList().catch(()=>{})
  console.log('部门列表',res);
  if(res.errCode!==10000){
    return false
  }
  options.value=res.data.list
  // console.log(  8888,options.value);
  

}
// 允许部分老师使用
const getPortion=()=>{
  innerVisible.value=true
  getDepartmenList()
}
// 点击内部确定
const submit=()=>{
  innerVisible.value=false
  badge.value=value.value.length
  // console.log(,value.value);
  let arr=value.value.map((item: any)=>{
    return{'id':item}
  })
ruleForm.limits=[...arr]

  console.log('可见范围',ruleForm.limits);
  
  
}
onMounted(()=>{
  
})
// 单选框事件
const radioChange=async ()=>{
  if(ruleForm.isshow==='1'){
    // console.log(555);
    const res:any=await teacherlsit({depid:0}).catch(()=>{})
    console.log('可见老师',res);
    if(res.errCode!==10000){
      return false
    }
    let arr=res.data.list.map((item: any)=>{
      return {'id':item.id}
    })
    ruleForm.limits=arr
    
    
  }else if(ruleForm.isshow==='2'){
    ruleForm.limits=[]
  }
  
  
}
// 点击考试
const cancel=()=>{
  emit('showEmit',false)
}
</script>

<style lang="less" scoped>

.dialog-footer button:first-child {
  margin-right: 10px;
}
.el-input{
  width: 200px;
}

</style>