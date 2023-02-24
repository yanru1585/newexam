<template>
  <div class="bot">
    <div class="head">
      <img src="../assets/images/head.jpg" alt="" @click="isShow = !isShow" />
      <div class="personBox" v-if="isShow">
        <div class="personTop"></div>
        <div class="headImg">
          <img src="../assets/images/head.jpg" alt="" />
        </div>
        <p style="text-align: center; margin-top: 3px">{{ info.name }}</p>
        <p style="text-align: center; font-size: 14px; margin: 15px 0">
          部门：<span>{{ info.depname }}</span>
        </p>
        <div class="leaveBtn">
          <el-button @click="leaveLogin">退出登录</el-button>
        </div>
        <!-- 边框线下边 -->
        <div style="padding: 10px 0">
          <div class="personItem">
            <div class="personItem_left">
              <div class="personItem_left_img">
                <img src="../assets/images/head.jpg" alt="" />
              </div>
              <span>账号</span>
            </div>
            <p class="personItem_right">{{ info.username }}</p>
          </div>
          <div class="personItem">
            <div class="personItem_left">
              <div class="personItem_left_img">
                <img src="../assets/images/head.jpg" alt="" />
              </div>
              <span>密码</span>
            </div>
            <p class="personItem_right" style="color: #59a0ff" @click="getPass(info.pass)">设置</p>
          </div>
          <div class="personItem">
            <div class="personItem_left">
              <div class="personItem_left_img">
                <img src="../assets/images/head.jpg" alt="" />
              </div>
              <span>微信</span>
            </div>
            <p class="personItem_right" style="color: #59a0ff">未绑定</p>
          </div>
        </div>
      </div>
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
        <el-menu-item
          :index="item.url"
          v-for="(item, index) in menuList"
          :key="index"
        >
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
import { ElMessage, ElMessageBox } from 'element-plus';
import { onMounted, ref, reactive, toRefs, defineExpose } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const isShow = ref(false);
// console.log(isShow.value);

defineExpose({
  isShow,
});

const data: any = reactive({
  info: {},
});
const { info } = toRefs(data);

onMounted(() => {
  console.log(sessionStorage.getItem('model'));
  let obj: any = sessionStorage.getItem('model');
  data.info = JSON.parse(obj);
});

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

// 退出登录
const leaveLogin = () => {
  ElMessageBox.confirm('你确定要退出登录吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      sessionStorage.clear();
      router.push('/')
      ElMessage({
        type: 'success',
        message: '退出登录成功！',
      });
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '退出登录失败！',
      });
    });
};

// 点击跳转到修改密码页面
const getPass=(val:any)=>{
router.push('set')
isShow.value=false
}
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
.popoverTop {
  background-color: #dfe1e6;
  height: 40px;
  margin: 0;
  padding: 0;
}

.personBox {
  position: fixed;
  width: 290px;
  z-index: 111;
  margin-left: 35px;
  margin-top: -23px;
  background-color: #fff;
  box-shadow: 0 0 10px #666;
  // box-shadow: -2px -2px 5px red;
  .personTop {
    background-color: #dfe1e6;
    height: 70px;
  }
  .headImg {
    // margin: auto;

    text-align: center;
    margin-top: -20px;
    img {
      border-radius: 50%;
      border: 1px solid #fff;

      width: 48px;
      height: 48px;
    }
  }
  .leaveBtn {
    display: flex;
    justify-content: center;
    padding-bottom: 20px;
    border-bottom: 1px solid #dadce0;
    .el-button {
      width: 90%;
      font-size: 12px;
    }
  }
  .personItem {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    .personItem_left {
      display: flex;
      align-items: center;
      font-size: 14px;
      .personItem_left_img {
        width: 20px;
        height: 20px;
        margin-right: 5px;
        img {
          width: 20px;
          height: 20px;
        }
      }
    }
    .personItem_right {
      font-size: 13px;
    }
  }
}
</style>
