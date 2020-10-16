import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'

// Initialize gun
import Gun from 'gun'
import VueGun from 'vue-gun';

// localStorage.clear();
var gun = new Gun()

Vue.use(VueGun, {
    gun: gun // your gun instance
});

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
