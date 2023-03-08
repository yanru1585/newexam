<template>
  <div class="bot">
    <div class="common-layout">
      <el-container>
        <el-aside width="80px">
          <LeftMenu ref="infoRef"/>
        </el-aside>
        <el-container>
          <el-main @click="clickFn" >
            <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" :key="$route.name" v-if="$route.meta.keepAlive" />
          </keep-alive>
          <component :is="Component" :key="$route.name" v-if="!$route.meta.keepAlive" />
          </router-view>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script lang="ts" setup>
import LeftMenu from '../components/LeftMenu.vue';
import {ref} from 'vue'

const infoRef=ref<any>()

const clickFn=()=>{
  // infoRef.value.isShow=false //关闭个人信息的弹框111
}
</script>

<style lang="less" scoped>
.el-aside {
  background-color: #ebebeb;
  height: 100vh;
}

</style>
