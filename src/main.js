// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App' // import组件之后才能使用呀
import router from './router'
import Vuex from 'vuex'
import store from './vuex/store'
import VueCookies from 'vue-cookies'

Vue.use(Vuex)
Vue.use(VueCookies)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app', // 挂载元素
  router, // 不是Vue.use()
  store,
  components: { App }, // 类似于vux的用法
  template: '<App/>' // 显示内容
})

// main.js用来实现主要的，挂载呀，所有的插件引用呀
// APP.vue 是主显示内容，项目所有的页面都基于此
// **.js 必须引用有其固定的写法，动态的思想，神经系统，路由就在router，状态就在vuex，api就在api.js
// **.vue 是具体的内容，并且调用**.js的文件
