import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
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
        component: () => import('../views/LeftMenu/test/TestList.vue'),
      },
      {
        path: '/Addtest', //创建考试
        name: 'addtest',
        component: () => import('../views/LeftMenu/test/Addtest.vue'),
      },
      {
        path: '/exam', //阅卷
        name: 'Exam',
        component: () => import('../views/LeftMenu/exam/ExamList.vue'),
      },
      {
        path: '/Examsee', //阅卷查看或阅卷
        name: 'Examsee',
        component: () => import('../views/LeftMenu/exam/Examsee.vue'),
      },
      {
        path: '/Examdrawer', //阅卷抽屉
        name: 'Examdrawer',
        component: () => import('../views/LeftMenu/exam/Examdrawer.vue'),
      },
      {
        path: '/subjects', //试卷
        name: 'Subjects',
        component: () => import('../views/LeftMenu/subjects/SubjectsList.vue'),
      },
      {
        path: '/SubjectsAdd', //创建试卷
        name: 'AddSubject',
        component: () => import('../views/LeftMenu/subjects/AddSubject.vue'),
      },
      {
        path: '/databaselist', //题库
        name: 'Databaselist',
        component: () => import('../views/LeftMenu/databaselist/DatabaseList.vue'),
      },
      {
        path: '/department', //部门
        name: 'Department',
        component: () => import('../views/LeftMenu/department/DepartmentList.vue'),
      },
      {
        path: '/teacher', //师资
        name: 'Teacher',
        component: () => import('../views/LeftMenu/teacher/TeacherList.vue'),
      },
      {
        path: '/classes', //班级
        name: 'Classes',
        component: () => import('../views/LeftMenu/classes/ClassesList.vue'),
      },
      {
        path: '/clasdialog', //班级添加
        name: 'clasdialog',
        component: () => import('../views/LeftMenu/classes/Classdialog.vue'),
      },
      {
        path: '/student', //学员
        name: 'Student',
        component: () => import('../views/LeftMenu/student/StudentList.vue'),
      },
      {
        path: '/role', //角色
        name: 'Role',
        component: () => import('../views/LeftMenu/role/RoleList.vue'),
      },
      {
        path: '/databasequestionlist', //试题列表
        name: 'Databasequestionlist',
        component: () => import('../views/LeftMenu/databaselist/DatabasequestionList.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
