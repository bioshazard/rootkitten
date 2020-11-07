import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Sources from '../views/Sources.vue'
import ZK from '../views/ZK.vue'
import ZKnew from '../views/ZK/new.vue'
import ZKview from '../views/ZK/view.vue'
import ZKdefault from '../views/ZK/default.vue'
import Config from '../views/Config.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/sources',
    name: 'Sources',
    component: Sources
  },
  {
    path: '/zk',
    name: 'Zettlekasten',
    component: ZK,
		children: [
			{
				path: '',
				component: ZKdefault
			},
			{
				path: 'new/:id?',
				component: ZKnew
			},
			{
				path: 'view/:id/:title?',
				component: ZKview
			}
		]
  },
  {
    path: '/config',
    name: 'Config',
    component: Config
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
