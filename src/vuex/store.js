import Vue from 'vue'
import Vuex from 'vuex'
import wechat from './modules/wechat'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    headerTitle: '',
    headerFlag: 1,
    userId: null,
    userRole: 0, // 0安装人员1客户2第三方受益人
    Authorization: '',
    sn: '',
    sockets: [],
    phone: '',
    desUrl: '',
    userName: ''
  },
  mutations: {
    setHeaderTitle: function (state, msg) {
      state.headerTitle = msg
    },
    setHeaderFlag: function (state, msg) {
      state.headerFlag = msg
    },
    setUserId (state, msg) {
      state.userId = msg
    },
    setUserRole (state, msg) {
      state.userRole = msg
    },
    setAuthorization (state, msg) {
      state.Authorization = msg
    },
    setSn (state, msg) {
      state.sn = msg
    },
    setSockets (state, msg) {
      state.sockets = msg
    },
    setPhone (state, msg) {
      state.phone = msg
    },
    setDesUrl (state, msg) { // hash模式(有#号)下，url永远都只是主域名地址，省去了传递url的烦恼(getWeChatSignature请求地址写死即可)，也没必要处理兼容
      state.desUrl = msg
    },
    setUserName (state, msg) {
      state.userName = msg
    }
  },
  actions: {},
  modules: { wechat }
})

export default store
