import Vue from 'vue'
import Vuex from 'vuex'

// Load all modules.
function loadModules() {
  const context = require.context("./modules", false, /([a-z_]+)\.js$/i)

  const modules = context
    .keys()
    .map((key) => ({ key, name: key.match(/([a-z_]+)\.js$/i)[1] }))
    .reduce(
      (modules, { key, name }) => ({
        ...modules,
        [name]: context(key).default
      }),
      {}
    )

  return { context, modules }
}

// const { context, modules } = loadModules()
const { modules } = loadModules()









// import zk from './modules/zk'

// import cart from './modules/cart'
// import products from './modules/products'
// import createLogger from '../../../src/plugins/logger'

Vue.use(Vuex)

// const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  modules,
  // strict: debug,
  // plugins: debug ? [createLogger()] : []
})

// if (module.hot) {
//   // Hot reload whenever any module changes.
//   module.hot.accept(context.id, () => {
//     const { modules } = loadModules()
//
//     store.hotUpdate({
//       modules
//     })
//   })
// }

export default store







//
//
// // Vuex
// // import 'es6-promise/auto'
// import Vuex from 'vuex'
// Vue.use(Vuex)
//
// const store = new Vuex.Store({
//   state: {
//     count: 0
//   },
//   mutations: {
//     increment (state) {
//       state.count++
//     }
//   }
// })
