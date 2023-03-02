<template>
  <div>
    <div style="display: flex;">
      <div id="main" style="width: 600px;height:400px;"></div>
      <div id="box" style="width: 600px;height:400px;"></div>
    </div>
    
    
  </div>

</template>

<script setup lang="ts">
import {  onMounted,defineProps } from "vue";
import * as echarts from 'echarts';

type EChartsOption = echarts.EChartsOption
const props=defineProps({
  passData:{
    type:Object,
    require:true
  },
  pieItems:{
    type:Object,
    require:true
  }
})




// 圆角环形图
const echatMain=()=>{
const obj={...props.passData}
var chartDom = document.getElementById('main')!;
var myChart = echarts.init(chartDom);
var option: EChartsOption;
option = {
  tooltip: {
    trigger: 'item'
  },
  legend: {
    top: '5%',
    left: 'center'
  },
  color:[ '#91cc75', '#ee6666'],
  series: [ 
    {
      name: 'Access From',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value:obj.pass, name: '通过' },
        { value:obj.unpass, name: '未通过' },

      ]
    }
  ]
};
// obj.passobj.unpass
option && myChart.setOption(option);
}
// 柱状图
const echatBox=()=>{
  const arr={...props.pieItems}
  var newArr=[]
  var serArr=[]


for (var i in arr) {
  newArr.push(i);
  serArr.push(arr[i]) 
}
console.log(999,newArr);

var chartDom = document.getElementById('box')!;
var myChart = echarts.init(chartDom);
var option: EChartsOption;
option = {
  xAxis: {
    type: 'category',
    data: newArr
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: serArr,
      type: 'bar'
    }
  ]
};


option && myChart.setOption(option);
}

onMounted(()=>{
  
 const time=setTimeout(()=>{
  clearTimeout(time)

  echatMain()
  echatBox()
  
 },200)
  
})

   




</script>

<style scoped>

</style>