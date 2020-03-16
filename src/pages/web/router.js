import Vue from 'vue'
import Router from 'vue-router'
import DeviceDetect from '../../views/DeviceDetect.vue'
import Class from '../../views/Class.vue'
import DemoLogin from '../../views/DemoLogin.vue'
import Login from '../../views/Login.vue'
import SignIn from '../../views/SignIn.vue'
import LiteLogin from '../../views/LiteLogin.vue'

Vue.use(Router)

var router = new Router({
  routes: [
    {
      path: '/detect',
      name: 'detect',
      component: DeviceDetect
    },
    // {
    //   path: '/',
    //   name: 'Home',
    //   redirect: '/demo/login'
    // },
    {
      path: '/',
      name: 'Home',
      component: Login
    },
    {
      path:
        '/signin/:companyId/:classId/:sdkAppId/:userId/:userSig/:userToken/:nickName',
      name: 'SignIn',
      component: SignIn
    },
    {
      path: '/class/:companyId',
      name: 'Login',
      component: Login
    },
    {
      path: '/class/:companyId/:classId',
      name: 'Class',
      component: Class
    },
    {
      path: '/class/:companyId/:classId/:userId/:userSig/:userToken/:web?',
      name: 'Class-Login',
      component: Login
    },
    {
      path: '/login/:companyId/:classId/:userId/:userSig/:userToken/:web?',
      name: 'Electron-Login',
      component: Login
    },
    {
      path: '/demo',
      name: 'demo',
      redirect: '/quickstart'
    },
    {
      path: '/quickstart/:classId?',
      name: 'quickstart',
      component: DemoLogin
    },
    {
      path: '/quickstart/login',
      name: 'quickstart',
      component: DemoLogin
    },
    {
      path: '/login/:companyId/:classId?/:userId?',
      name: 'Login',
      component: Login
    },
    {
      path: '/lite/login/:companyId?/:classId?/:userId?',
      name: 'LiteLogin',
      component: LiteLogin
    }
  ]
})

// router.beforeEach((to, from, next) => {
//   if (to.path === from.query.redirect) {
//     next();
//   } else if (to.path === '/detect') { // 设备检测
//     next();
//   } else if (from.query.redirect) {
//     next({
//       path: from.query.redirect,
//       query: {
//       }
//     });
//   } else {
//     next();
//   }
// });

export default router
