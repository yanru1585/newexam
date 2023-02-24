import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index'
import 'vant/lib/index.css'
import Vant from './utils/vantui'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'vant/lib/index.css'
import Vant from './utils/vantui'
import './assets/css/iconfont.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App)
app.use(router).use(Vant).use(ElementPlus, {
  locale: zhCn,
}).mount('#app')
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

<<<<<<< HEAD




=======
>>>>>>> 71a5a410544d1a7ae71fe78da0f2e50ee932db16

