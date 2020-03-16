import '@babel/polyfill'
import Vue from 'vue'
import Index from './Index.vue'
import router from './router'
import iView from 'iview'
import '../../assets/style.less'
import Constant from '../../config/Constant'
import Global from '../../config/Global'
Vue.prototype.Constant = Constant
Vue.prototype.Global = Global

import '../../assets/css/edu-tic.css'
import 'iview/dist/styles/iview.css'




import Toasted from 'vue-toasted'

Vue.use(Toasted, {
  theme: "outline",
  duration: 2000
})

Vue.use(iView)


Vue.config.productionTip = false
Vue.runtimeEnv = Constant.RUNTIME_ENV.BROWSER;

new Vue({
  router,
  render: h => h(Index)
}).$mount('#app')