import Vue from 'vue'
import Router from 'vue-router'

import Class from '../Class.vue'


Vue.use(Router)

var router = new Router({
  routes: [{
    path: '/:classId/:userId/:userSig/:userToken',
    name: 'Class-Login',
    component: Class
  }, ]
});


export default router;