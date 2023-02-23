<template>
  <div class="bot">
    <div class="head">
      <img src="../assets/images/head.jpg" alt="" />
    </div>
    <el-menu
    background-color="#ebebeb"
      class="el-menu-vertical-demo"
      default-active="test"
      :unique-opened="true"
      @open="handleOpen"
      @close="handleClose"
      router
    >
      <div class="iconTxt">
        <el-menu-item :index="item.url" v-for="(item, index) in menuList"
      :key="index">
          <el-icon size="30"><setting /></el-icon>
          <span>{{ item.name }}</span>
        </el-menu-item>
      </div>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue';

const menu: any = sessionStorage.getItem('menu');
let menuList = JSON.parse(menu);
menuList = menuList.filter((item: { pid: number }) => {
  return item.pid == 0;
});

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
</script>

<style lang="less" scoped>
.head {
  width: 40px;
  height: 40px;
  margin: 18px auto;

  // margin: auto;
  img {
    width: 40px;
    height: 40px;
  }
}
.iconTxt {
  width: 80px;
  height: 70px;
}

.el-menu-item {
  display: flex;
  flex-direction: column;
  width: 60px;
  height: 60px;
  line-height: 30px;
  margin: auto;
  font-size: 13px;
  margin-top: 8px;
}
</style>
