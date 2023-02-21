<template>
  <div>
    <div class="common-layout">
      <el-container>
        <el-aside width="80px">
          <LeftMenu />
        </el-aside>
        <el-container>
          <el-main>
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script lang="ts" setup>
import LeftMenu from '../components/LeftMenu.vue';
</script>

<style lang="less" scoped>
.el-aside {
  background-color: #ebebeb;
  height: 100vh;
}
</style>
