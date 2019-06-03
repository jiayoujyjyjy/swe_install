<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { back } from 'api'
export default {
  name: 'app',
  data () {
    return {
      param: {
        'userId': 0
      }
    }
  },
  // 注释控制台输出
  created: function () {
    // console.log = function () {}
    window.alert = function () {}
    // 每隔五十分钟刷新一次token
    window.setInterval(this.backRefreshCode, 3000000)
  },
  methods: {
    // token过期，重新获取
    backRefreshCode: function () {
      this.param.userId = this.$store.state.userId
      back.refreshCode(this.param).then(function (response) {
        console.log(response)
        if (response.errno !== 0) {
          return
        }
        let Authorization = 'Bearer' + ' ' + response.data.token
        this.$store.commit('setAuthorization', Authorization)
      }.bind(this))
    }
  }
}
</script>

<style>
body, html {
  margin: 0px;
  padding: 0px;
  height: 100%;
  width: 100%;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
}
#app {
  color: #2c3e50;
  height:100%;
  width: 100%;
  overflow-x: hidden;
}

/* 全局的顶栏样式 */
.vux-header {
  z-index: 100;
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  background-color: #2c3e50!important;
}
.tabbarcss {
  height: 56px;
}
.weui-tabbar__label {
  line-height: 0.3!important;
}
/* .tabbarcss {
  height: 56px;
} */
/* .weui-tabbar__label {
  line-height: 0.3!important;
} */
/* a {
  text-decoration: none;
} */
</style>
