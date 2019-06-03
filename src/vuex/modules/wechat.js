import wx from 'weixin-js-sdk'
import { back } from 'api'

const state = {
  wx_debug: false,
  wx_access_token: '',
  wx_configFlag: false
}

const getters = {
  wechatInfo: state => {
    return {
      // wx_appid: state.wx_appid,
      // wx_access_token: state.wx_access_token
    }
  }
}

const mutations = {
  setConfigFlag (state, msg) {
    state.wx_configFlag = msg
  },
  // config接口注入权限验证配置
  INITWX (state, params) {
    let config = {}
    config.debug = state.wx_debug
    config.appId = params.appId
    config.timestamp = params.timestamp
    config.nonceStr = params.nonceStr
    config.signature = params.signature
    config.jsApiList = params.jsApiList
    wx.config(config) // 客户端的异步操作
    wx.ready(function () {
      // alert('wx config ok')
      state.wx_configFlag = true
    })
    wx.error(function (res) {
      // alert('wx error')
      state.wx_configFlag = false
    })
  },
  // 获取地理位置接口
  QUELOCA (state, payload) {
    wx.getLocation({
      type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
      success: function (res) {
        // var latitude = res.latitude // 纬度，浮点数，范围为90 ~ -90
        // var longitude = res.longitude // 经度，浮点数，范围为180 ~ -180。
        // var speed = res.speed // 速度，以米/每秒计
        // var accuracy = res.accuracy // 位置精度
        console.log('地理位置接口调用成功')
        console.log(res)
        payload.success_callback(res) // 成功之后的回调函数
      },
      fail: function (res) {
        payload.fail_callback(res)
        console.log('地理位置接口调用失败')
      }
    })
  },
  // 微信扫一扫
  SCANCODE (state, payload) {
    wx.scanQRCode({
      needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
      success: function (res) {
        var result = res.resultStr // 当needResult 为 1 时，扫码返回的结果
        payload.success_callback(result)
      }
    })
  }
}

const actions = {
  initWX ({commit}, value) {
    commit('INITWX', value)
  },
  getWeChatSignature ({commit}, desurl) { // {commit}直接把commit对象传递过来 相当于callback
    back.jsSdkGet(desurl).then((response) => {
      console.log(response)
      var initConfigVal = {}
      initConfigVal.appId = 'wx3ebb3b56a79a1690' // 公众号的AppID(应用ID)
      initConfigVal.timestamp = response.data.timestamp // 系统生成签名的时间戳
      initConfigVal.nonceStr = response.data.nonceStr // 服务器随机生成签名的字符串
      initConfigVal.signature = response.data.signature // 签名
      initConfigVal.jsApiList = [ 'getLocation', 'scanQRCode' ] // 需使用js接口列表
      commit('INITWX', initConfigVal) // 相当于 callback
    })
  },
  queLocation ({commit}, value) {
    commit('QUELOCA', value)
  },
  scanQRCode ({commit}, value) {
    commit('SCANCODE', value)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
