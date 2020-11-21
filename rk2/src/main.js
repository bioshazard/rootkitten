import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

// Initialize gun
import Gun from 'gun'
// localStorage.clear()
var gun = new Gun(['https://rk.bioshazard.com:8765/gun'])

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

// Markdown
import VueMarkdown from "vue-markdown"
// Vue.use(VueMarkdown);
Vue.component('vue-markdown', VueMarkdown);

Vue.config.productionTip = false

new Vue({
  router,
	store,
  render: h => h(App)
}).$mount('#app')
