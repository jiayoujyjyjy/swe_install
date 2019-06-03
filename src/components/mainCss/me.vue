<template>
  <div class="me">
    <group class="backgroundImage" title="">
      <panel :list="list" :type="type"></panel>
      <cell class="cellcss" title="我的信息" is-link :link="{path:'/mainCss/myInfo'}">
        <img slot="icon" width="20" style="display:block;margin-right:5px;" src="/static/star.png">
      </cell>
      <cell class="cellcss" title="修改密码" is-link :link="{path:'/mainCss/changePassword'}">
        <img slot="icon" width="20" style="display:block;margin-right:5px;" src="/static/password.png">
      </cell>
      <cell class="cellcss" title="修改手机号" is-link :link="{path:'/mainCss/changePhone'}">
        <img slot="icon" width="20" style="display:block;margin-right:5px;" src="/static/phoneGreen.png">
      </cell>
      <cell class="cellcss" title="微信绑定" is-link :link="{path:'/mainCss/wechatBind'}">
        <img slot="icon" width="20" style="display:block;margin-right:5px;" src="/static/wxBind.png">
      </cell>
      <cell class="cellcss" title="退出当前账号" @click.native="logout">
        <img slot="icon" width="20" style="display:block;margin-right:5px;" src="/static/logout.png">
      </cell>
    </group>
    <div>
      <confirm v-model="confirmShow"
      title="提示"
      @on-cancel="onCancel"
      @on-confirm="onConfirm">
        <p style="text-align:center;">确认退出？</p>
      </confirm>
    </div>
  </div>
</template>

<script>
import { Group, Panel, Cell, AlertModule, Confirm } from 'vux'
import { back } from 'api'
import Routers from '@/router'
// import { sessionGetStore } from '@/components/config/Utils'
import store from '@/vuex/store' // 1.import后用store.xxx || 2.不import用this.$store.xxx
export default {
  components: { Group, Panel, Cell, AlertModule, Confirm },
  data () {
    return {
      // msg: '鸿世充电',
      msg: false,
      type: '1',
      param: {
        'userId': '',
        'Authorization': ''
      },
      confirmShow: false,
      list: [{
        src: '/static/meSelected.png',
        fallbackSrc: 'http://placeholder.qiniudn.com/60x60/3cc51f/ffffff',
        title: '未登录',
        desc: '手机号：13777899253'
      }]
    }
  },
  // 路由钩子函数--是否加载顶栏
  beforeRouteEnter: (to, from, next) => {
    console.log('准备进入me路由模板')
    store.commit('setHeaderFlag', 0)
    next()
  },
  beforeRouteLeave: (to, from, next) => {
    console.log('准备离开me路由模板')
    store.commit('setHeaderFlag', 1)
    next()
  },
  /*
  ** *************生命周期**************
  */
  created: function () {
    // 获取header title
    this.$store.commit('setHeaderTitle', this.msg)
    this.param.userId = this.$store.state.userId
    this.param.Authorization = this.$store.state.Authorization
    this.backUserInfo()
    // alert(sessionGetStore('lalala'))
    // this.$cookies.set('mobile', '15757829507', '7d')
    // this.$cookies.set('password', '3073136', '7d')
  },
  methods: {
    // 退出当前账号
    logout: function () {
      this.confirmShow = true
    },
    onCancel: function () {
      console.log('cancel')
    },
    onConfirm: function () {
      Routers.push('/header/login')
    },
    /*
    ** ***********API调用相关函数**************
    */
    // 获取用户信息
    backUserInfo: function () {
      back.userInfo(this.param).then(function (response) {
        console.log(response)
        if (response.errno === 0) {
          this.list[0].title = response.data.name
          this.list[0].desc = '手机号:' + response.data.mobile
        } else {
          AlertModule.show({
            title: '提示',
            content: response.error
          })
        }
      }.bind(this))
    }
  }
}
</script>

<style scoped>
.cellcss {
  height: 30px;
}
</style>
