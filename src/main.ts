import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'vant/lib/index.css'
import Vant from './utils/vantui'


createApp(App).use(Vant).use(router).use(ElementPlus, {
  locale: zhCn,
}).mount('#app')
