import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index'
import * as echarts from "echarts";
import 'vant/lib/index.css'
import ElementPlus from 'element-plus'
import Vant from './utils/vantui'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import './assets/css/iconfont.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App)
// 全局挂载 echarts
app.config.globalProperties.$echarts = echarts;
app.use(router).use(Vant).use(ElementPlus, {
  locale: zhCn,
}).mount('#app')
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}



