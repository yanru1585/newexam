import { ElMessage } from 'element-plus';
import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  RouteLocationNormalized,
} from 'vue-router';

const routes: any = [
  {
    path: '/',
    name: 'Login',
    meta: {
      keepAlive: false,
    },
    component: () => import('../views/LoginView.vue'),
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/HomeVIew.vue'),
    children: [
      {
        path: '/test', //考试
        name: 'Test',
        meta:{
          keepAlive:true //设置页面是否需要使用缓存
        },
        component: () => import('../views/LeftMenu/test/TestList.vue'),  
      },
      {
        path: '/Analyse', //考试数据分析
        name: 'analyse',
        meta:{
          keepAlive:false
        },
        component: () => import('../views/LeftMenu/test/AnalyseTest.vue'),
      },
      {
        path: '/Addtest', //创建考试
        name: 'addtest',
        meta: {
          keepAlive: false,
        },
        component: () => import('../views/LeftMenu/test/Addtest.vue'),
      },
      {
        path: '/exam', //阅卷
        name: 'Exam',
        meta: {
          keepAlive: true,
        },
        component: () => import('../views/LeftMenu/exam/ExamList.vue'),
      },
      {
        path: '/Examsee', //阅卷查看或阅卷
        name: 'examsee',
        meta: {
          keepAlive: false,
        },
        component: () => import('../views/LeftMenu/exam/Examsee.vue'),
      },
      {
        path: '/Examdrawer', //阅卷抽屉
        name: 'examdrawer',
        meta: {
          keepAlive: false,
        },
        component: () => import('../views/LeftMenu/exam/Examdrawer.vue'),
      },
      {
        path: '/subjects', //试卷
        name: 'Subjects',
        meta: {
          keepAlive: true,
        },
        component: () => import('../views/LeftMenu/subjects/SubjectsList.vue'),
      },
      {
        path: '/SubjectsAdd', //创建试卷
        name: 'AddSubject',
        meta: {
          keepAlive: false,
        },
        component: () => import('../views/LeftMenu/subjects/AddSubject.vue'),
      },
      {
        path: '/databaselist', //题库
        name: 'Databaselist',
        meta: {
          keepAlive: true,
        },
        component: () =>import('../views/LeftMenu/databaselist/DatabaseList.vue'),
      },
      {
        path: '/department', //部门
        name: 'Department',
        meta: {
          keepAlive: false,
        },
        component: () =>import('../views/LeftMenu/department/DepartmentList.vue'),
      },
      {
        path: '/teacher', //师资
        name: 'Teacher',
        meta: {
          keepAlive: true,
        },
        component: () => import('../views/LeftMenu/teacher/TeacherList.vue'),
      },
      {
        path: '/teacherreset', //师资重置密码
        name: 'Teacherreset',
        meta: {
          keepAlive: false,
        },
        component: () => import('../views/LeftMenu/teacher/teacherreset.vue'),
      },
      {
        path: '/teacherrevise', //师资添加和修改
        name: 'Teacherrevise',
        meta: {
          keepAlive: false,
        },
        component: () => import('../views/LeftMenu/teacher/teacherrevise.vue'),
      },
      {
        path: '/classes', //班级
        name: 'Classes',
        meta: {
          keepAlive: true,
        },
        component: () => import('../views/LeftMenu/classes/ClassesList.vue'),
      },
      {
        path: '/clasdialog', //班级添加
        name: 'clasdialog',
        meta: {
          keepAlive: false,
        },
        component: () => import('../views/LeftMenu/classes/Classdialog.vue'),
      },
      {
        path: '/student', //学员
        name: 'Student',
        meta: {
          keepAlive: true,
        },
        component: () => import('../views/LeftMenu/student/StudentList.vue'),
      },
      {
        path: '/role', //角色
        name: 'Role',
        meta: {
          keepAlive: true,
        },
        component: () => import('../views/LeftMenu/role/RoleList.vue'),
      },
      {
        path: '/databasequestionlist', //试题列表
        name: 'Databasequestionlist',
        meta: {
          keepAlive: false,
        },
        component: () =>
          import('../views/LeftMenu/databaselist/DatabasequestionList.vue'),
      },
      // 学生端
      {
        path: '/stutest', //考试列表
        name: 'Stutest',
        meta: {
          keepAlive: false,
        },
        component: () =>
          import('../views/LeftMenu/stutest/StutestList.vue'),
      },
      {
        path: '/set', //设置
        name: 'Set',
        component: () =>
          import('../views/LeftMenu/set/ChangePass.vue'),
      },
    ],
  },
  {
    path: '/examprepare', //准备考试页面(未参加)
    name: 'Examprepare',
    meta: {
      keepAlive: false,
    },
    component: () =>
      import('../views/LeftMenu/stutest/noJoin/ExamprepareView.vue'),
  },
  {
    path: '/examresults', //未通过
    name: 'Examresults',
    meta: {
      keepAlive: false,
    },
    component: () =>
      import('../views/LeftMenu/stutest/noPass/ExamresultsView.vue'),
  },
  {
    path: '/stuexam', //未通过
    name: 'Stuexam',
    meta: {
      keepAlive: false,
    },
    component: () =>
      import('../views/LeftMenu/stutest/noJoin/StuExam.vue'),
  },
  {
    path: '/stuexamwrong', //未通过
    name: 'Stuexamwrong',
    meta: {
      keepAlive: false,
    },
    component: () =>
      import('../views/LeftMenu/stutest/StuexamWrong.vue'),
  },
];



const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
//检测路由是否已经添加
// const hasNecessaryRoute=(to:any)=>{

   
//   let find = router.getRoutes().find(item => item.name === to.name);
//   return !!find;

// }
// 路由守卫，没有进行登录时，不能访问其他页面
router.beforeEach( (to: RouteLocationNormalized, from: RouteLocationNormalized, next: any)=> {
  // to:进入某条路径的路由对象，from：从哪条路径来的路由对象，next：表示往下执行的下一步函数
  // next可以写路由对象参数，也可以不写参数
  
  if (to.path == '/' ) {
    // 登录或者注册才可以往下进行
    next();
} else {
    // 获取 token
    const token = sessionStorage.getItem('token')
    // token 不存在
    if (token === null || token === '') {
        // ElMessage.error('您还没有登录，请先登录');
        next('/');
        ElMessage.error('您还没有登录，请先登录');
    } else {
        next();
        // const menu= sessionStorage.getItem('menu')
        // // console.log('菜单',menu);
        // if(!hasNecessaryRoute(to)){
   
        //   menu?JSON.parse(menu).forEach((item:any)=>{
        
        //     router.addRoute({ path: '/'+item.url, name:item.url, component: () => import(`../views/${item.url}.vue`) })
        
        //   }):''
        //   return to.fullPath;
        // }
        
    }
    
}


})

export default router;
