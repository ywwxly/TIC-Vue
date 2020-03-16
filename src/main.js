import Vue from 'vue'
import App from './pages/web/index'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
