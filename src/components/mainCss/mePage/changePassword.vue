<template>
  <div class="changePassword">
    <div class="content">
      <group>
        <x-input title="" v-model="phone" placeholder="请输入手机号">
          <img slot="label" style="padding-right:10px;display:block;" src="/static/phoneGreen.png" width="24" height="24">
          <icon slot="right" type="warn" v-if="phoneCheckIconFlag" @click.native="phoneCheckErrIcon"></icon>
        </x-input>
        <toast v-model="phoneToastShow" type="text" :time="900" is-show-mask :text="phoneToastText" :position="position"></toast>

        <x-input title="" v-model="code" placeholder="输入短信验证码" class="weui-vcode">
          <img slot="label" style="padding-right:10px;display:block;" src="/static/vercode.png" width="24" height="24">
          <icon slot="right" type="warn" v-if="codeCheckIconFlag" @click.native="codeCheckErrIcon"></icon>
          <x-button slot="right" v-if="!passwordComputedTime" type="primary" mini style="width:103px;" @click.native.prevent="phoneCheck">获取验证码</x-button>
          <x-button slot="right" v-if="passwordComputedTime" type="primary" mini style="width:103px;">已发送({{passwordComputedTime}}s)</x-button>
        </x-input>
        <toast v-model="codeToastShow" type="text" :time="900" is-show-mask :text="codeToastText" :position="position"></toast>

        <x-input title="" type="password" v-model="password" placeholder="请输入新密码">
          <img slot="label" style="padding-right:10px;display:block;" src="/static/password.png" width="24" height="24">
          <icon slot="right" type="warn" v-if="passwordCheckIconFlag" @click.native="passwordCheckErrIcon"></icon>
        </x-input>
        <toast v-model="passwordToastShow" type="text" :time="900" is-show-mask :text="passwordToastText" :position="position"></toast>

        <x-input title="" type="password" v-model="passwordAgain" placeholder="确认新密码">
          <img slot="label" style="padding-right:10px;display:block;" src="/static/password.png" width="24" height="24">
          <icon slot="right" type="warn" v-if="passwordAgainCheckIconFlag" @click.native="passwordAgainCheckErrIcon"></icon>
        </x-input>
        <toast v-model="passwordAgainToastShow" type="text" :time="900" is-show-mask :text="passwordAgainToastText" :position="position"></toast>
      </group>
    </div>
    <div>
    <x-button type="warn" @click.native="confirm">确认</x-button>
    </div>
    <alert v-model="alertShow" title="提示" :content="alertContent" @on-hide="onHide"></alert>
  </div>
</template>

<script>
import { Group, XInput, XButton, Toast, Alert, Icon } from 'vux'
import Routers from '@/router'
import { back } from 'api'
import $ from 'jquery'

export default {
  name: 'changePassword',
  components: { Group, XInput, XButton, Toast, Alert, Icon },
  data () {
    return {
      param: {
        'mobile': '',
        'password': '',
        'code': ''
      },
      alertContent: '',
      alertShow: false,
      msg: '重置密码',
      position: 'center', // 提示信息的位置
      phoneCheckIconFlag: false, // 是否显示手机号红色错误图标
      codeCheckIconFlag: false,
      passwordCheckIconFlag: false,
      passwordAgainCheckIconFlag: false,
      phoneToastShow: false, // 是否显示toast提示
      codeToastShow: false,
      passwordToastShow: false,
      passwordAgainToastShow: false,
      phoneToastText: '', // 手机号错误提示文本
      codeToastText: '',
      passwordToastText: '',
      passwordAgainToastText: '',
      password: '',
      passwordAgain: '',
      phone: '',
      code: '', // 短信验证码
      passwordComputedTime: 0, // 短信验证码倒数记时
      viewHeight: null
    }
  },
  /*
  ** *************生命周期**************
  */
  created: function () {
    this.$store.commit('setHeaderTitle', this.msg)
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
    // 确认按键触发，校验表单输入，并API告知后台新密码
    confirm: function () {
      console.log('确认按键')
      this.phoneCheckLast()
      this.codeCheck()
      this.passwordCheck()
      this.passwordAgainCheck()
      if (!(this.phoneCheckIconFlag || this.codeCheckIconFlag || this.passwordCheckIconFlag || this.passwordAgainCheckIconFlag)) {
        this.param.code = this.code
        this.param.password = this.password
        this.backChangePassword()
      }
    },
    onHide: function () {
      if (this.alertContent === '重置密码成功！') {
        Routers.push({ path: '/mainCss/me' })
      }
    },
    /*
    *
    *   ******** API调用函数 ********
    *
    */
    // 修改密码
    backChangePassword: function () {
      console.log(this.param)
      back.changePassword(this.param).then(function (response) {
        console.log(response)
        if (response.errno > 0) {
          this.alertContent = response.error
          this.alertShow = true
          return
        }
        this.alertContent = '重置密码成功！'
        this.alertShow = true
      }.bind(this))
    },
    // 发送短信验证信息
    backSmsSend: function () {
      console.log('获取验证码')
      back.sendCode(this.param).then(function (response) {
        console.log(response)
      })
    },
    /*
    *   ******** 表单格式校验 ********
    */
    // 获取短信验证码。(先进行手机号格式校验,若错误则在右侧显示红色错误图标)
    phoneCheck: function () {
      let mobileNow = this.phone
      var phoneReg = /^1\d{10}$/
      if (mobileNow === '') {
        this.phoneCheckIconFlag = true
        this.phoneToastText = '手机号不能为空'
      } else if (!phoneReg.test(mobileNow)) {
        this.phoneCheckIconFlag = true
        this.phoneToastText = '手机号码格式错误'
      } else {
        console.log('手机号格式正确')
        this.phoneCheckIconFlag = false
        this.codeCount() // 验证码倒计时
        this.param.mobile = this.phone // 将手机号码存入api请求参数中
        this.backSmsSend() // 发送短信验证信息
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
    // 手机号校验（在最后确认提交时校验）
    phoneCheckLast: function () {
      let mobileNow = this.phone
      var phoneReg = /^1\d{10}$/
      if (mobileNow === '') {
        this.phoneCheckIconFlag = true
        this.phoneToastText = '手机号不能为空'
      } else if (!phoneReg.test(mobileNow)) {
        this.phoneCheckIconFlag = true
        this.phoneToastText = '手机号码格式错误'
      } else {
        console.log('手机号格式正确')
        this.phoneCheckIconFlag = false
      }
    },
    // 短信验证码校验（在最后确认提交时校验）
    codeCheck: function () {
      let codeNow = this.code
      var codeReg = /^\d{6}$/
      if (codeNow === '') {
        this.codeCheckIconFlag = true
        this.codeToastText = '验证码不能为空'
      } else if (!codeReg.test(codeNow)) {
        this.codeCheckIconFlag = true
        this.codeToastText = '请输入6位数字验证码'
      } else {
        console.log('验证码格式正确')
        this.codeCheckIconFlag = false
      }
    },
    // 密码格式校验(若错误则在右侧显示红色错误图标)
    passwordCheck: function () {
      let passwordNow = this.password
      if (passwordNow === '') {
        this.passwordCheckIconFlag = true
        this.passwordToastText = '密码不能为空'
      } else if (passwordNow.length < 6 || passwordNow.length > 20) {
        this.passwordCheckIconFlag = true
        this.passwordToastText = '密度长度应在6到20位之间'
      } else {
        console.log('密码格式正确')
        this.passwordCheckIconFlag = false
      }
    },
    // 再次输入密码格式校验(若错误则在右侧显示红色错误图标)
    passwordAgainCheck: function () {
      let passwordNow = this.password
      let passwordAgainNow = this.passwordAgain
      if (passwordAgainNow === '') {
        this.passwordAgainCheckIconFlag = true
        this.passwordAgainToastText = '密码不能为空'
      } else if (passwordAgainNow !== passwordNow) {
        this.passwordAgainCheckIconFlag = true
        this.passwordAgainToastText = '输入密码不一致'
      } else {
        console.log('密码格式正确')
        this.passwordAgainCheckIconFlag = false
      }
    },
    // 手机号红色图标触发事件
    phoneCheckErrIcon () {
      console.log('触发：phoneCheckErrIcon点击事件')
      this.phoneToastShow = true
      this.phoneCheckIconFlag = false
    },
    // 验证码红色图标触发事件
    codeCheckErrIcon () {
      console.log('触发：codeCheckErrIcon点击事件')
      this.codeToastShow = true
      this.codeCheckIconFlag = false
    },
    // 密码红色图标触发事件
    passwordCheckErrIcon () {
      console.log('触发：passwordCheckErrIcon点击事件')
      this.passwordToastShow = true
      this.passwordCheckIconFlag = false
    },
    // 再次密码红色图标触发事件
    passwordAgainCheckErrIcon () {
      console.log('触发：passwordAgainCheckErrIcon点击事件')
      this.passwordAgainToastShow = true
      this.passwordAgainCheckIconFlag = false
    }
  }
}
</script>

<style scoped>
.changePassword {
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
