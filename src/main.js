import Vue from 'vue'
import App from './App'
import uView from 'uview-ui'
import mixins from '@/mixins'

Vue.use(uView)
Vue.use(mixins)
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
