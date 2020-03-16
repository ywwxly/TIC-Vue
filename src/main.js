import Vue from 'vue'
import App from './Class.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
