import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router'
 
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Login',
    // meta: {
    //   keepAlive: false 
    // },
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/Home',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
    children:[
      // {
      //   path: '/About',
      //   name: 'About',
      //   meta: {
      //     keepAlive: false 
      //   },
      //   component: () => import('../views/About.vue')
      // }
    ]
  }
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
