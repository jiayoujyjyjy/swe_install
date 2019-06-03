<template>
  <div class="changePhone">
    <div class="content">
      <group>
        <x-input title="" v-model="newphone" placeholder="请输入新手机号" ref="refPhone">
          <img slot="label" style="padding-right:10px;display:block;" src="/static/phoneGreen.png" width="24" height="24">
        </x-input>
        <x-input title="" v-model="code" placeholder="输入短信验证码" class="weui-vcode" ref="refCode">
          <img slot="label" style="padding-right:10px;display:block;" src="/static/vercode.png" width="24" height="24">
          <x-button slot="right" v-show="!passwordComputedTime" type="primary" mini  @click.native="getCheckCode">获取验证码</x-button>
          <x-button slot="right" v-show="passwordComputedTime" type="primary" mini >已发送({{passwordComputedTime}}s)</x-button>
        </x-input>
      </group>
    </div>
    <div>
    <x-button type="primary" plain @click.native="confirm">确认</x-button>
    </div>
    <alert v-model="alertShow" title="提示" :content="alertContent" @on-hide="onHide"></alert>
  </div>
</template>

<script>
import { Group, XInput, XButton, Alert } from 'vux'
import Routers from '@/router'
import { back } from 'api'
import $ from 'jquery'
export default {
  name: 'changePhone',
  components: { Group, XInput, XButton, Alert },
  data () {
    return {
      msg: '更改手机',
      param: {
        'userId': '',
        'Authorization': '',
        'mobile': '',
        'code': ''
      },
      alertContent: '',
      alertShow: false,
      newphone: null,
      code: '',
      passwordComputedTime: 0 // 短信验证码倒数记时
    }
  },
  /*
  ** *************生命周期**************
  */
  created: function () {
    this.$store.commit('setHeaderTitle', this.msg)
    this.param.userId = this.$store.state.userId
    this.param.Authorization = this.$store.state.Authorization
  },
  mounted: function () {
    this.viewHeight = $(window).height()
    var _this = this
    $(window).resize(function () {
      if ($(window).height() < _this.viewHeight) {
        $('.tabbarcss').css('position', 'static')
      } else {
        $('.tabbarcss').css('position', 'absolute')
      }
    })
  },
  methods: {
    // 获取短信验证码
    getCheckCode: function () {
      this.param.mobile = this.newphone
      this.codeCount()
      this.backSmsSend()
    },
    // 验证验证码输入准确否，并API告知后台新密码
    confirm: function () {
      console.log('确认')
      this.param.code = this.code
      this.param.mobile = this.newphone
      this.backChangePhone()
    },
    onHide: function () {
      if (this.alertContent === '修改手机号成功！') {
        Routers.push({ path: '/mainCss/me' })
      }
    },
    // 短信验证码倒计时
    codeCount: function () {
      this.passwordComputedTime = 60
      let passTimer = setInterval(() => { // 不能写 this.passTimer = ...
        this.passwordComputedTime--
        if (this.passwordComputedTime === 0) {
          clearInterval(passTimer)
        }
      }, 1000)
    },
    /*
    *
    *   ******** API调用函数 ********
    *
    */
    // 修改手机号
    backChangePhone: function () {
      back.userMobileMod(this.param).then(function (response) {
        console.log(response)
        if (response.errno > 0) {
          this.alertContent = response.error
          this.alertShow = true
          return
        }
        this.alertContent = '修改手机号成功！'
        this.alertShow = true
      }.bind(this))
    },
    // 发送短信验证信息
    backSmsSend: function () {
      console.log('获取验证码')
      back.sendCode(this.param).then(function (response) {
        console.log(response)
      })
    }
  }
}
</script>

<style scoped>
.changePhone {
  padding-top: 46px;
  width: 80%;
  margin:0 auto;
  /* margin-top: 17%; */
  margin-bottom: 137px;
}
.content {
  position: relative;
  width: 100%;
  margin:0 auto;
  border-style: groove;
  margin-top: 30px;
  margin-bottom: 60px;
}
.content >>> .weui-cells {
  margin-top: 0px;
}
.weui-cell {
  height: 35px;
}
.weui-btn_warn {
  background-color: #5CC042;
  margin-top: 40px;
  width: 98%;
}
</style>
