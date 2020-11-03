import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

// Initialize gun
import Gun from 'gun'
// localStorage.clear()
var gun = new Gun()

// My Gun Lib
import zkgun from './lib/zkgun.js'
zkgun.setGun(gun)
Vue.prototype.zkgun = zkgun

// VueGun
import VueGun from 'vue-gun';
Vue.use(VueGun, { gun: gun });

// UUID
import UUID from "vue-uuid";
Vue.use(UUID);

Vue.config.productionTip = false

new Vue({
  router,
	store,
  render: h => h(App)
}).$mount('#app')
