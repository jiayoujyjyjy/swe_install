<template>
  <div class="register">
    <div class="content">
    <group>
      <x-input title="" v-model="name" placeholder="请输入姓名">
        <img slot="label" style="padding-right:10px;display:block;" src="/static/meSelected.png" width="24" height="24">
        <icon slot="right" type="warn" v-if="nameCheckIconFlag" @click.native="nameCheckErrIcon"></icon>
      </x-input>
      <toast v-model="nameToastShow" type="text" :time="900" is-show-mask :text="nameToastText" :position="position"></toast>

      <x-input title="" type="password" v-model="password" placeholder="请输入密码">
        <img slot="label" style="padding-right:10px;display:block;" src="/static/password.png" width="24" height="24">
        <icon slot="right" type="warn" v-if="passwordCheckIconFlag" @click.native="passwordCheckErrIcon"></icon>
      </x-input>
      <toast v-model="passwordToastShow" type="text" :time="900" is-show-mask :text="passwordToastText" :position="position"></toast>

      <popup-picker :title="title1" :data="list1" v-model="value1_1">
        <template slot="title" slot-scope="props"><!-- use scope="props" when vue < 2.5.0 -->
          <!-- <span :class="props.labelClass" :style="props.labelStyle" style="height:24px;"> -->
          <span>
            <span style="font-size:20px;vertical-align:middle;">
            <img src="/static/sn.png" style="heigth: 24px; width:24px;">
            </span>
            <!-- <span style="vertical-align:middle;">&nbsp;&nbsp;&nbsp;Please selet your identity</span> -->
          </span>
        </template>
      </popup-picker>

      <x-address title="" @on-shadow-change="onShadowChange" v-model="cityvalue" :list="addressData" placeholder="北京市 市辖区" hide-district>
        <template slot="title" slot-scope="props">
          <img slot="label" style="padding-right:4.5px;" src="/static/city.png" width="24" height="24">
          <span style="vertical-align: super; padding-right: 60px;">城市</span>
          <!-- <icon type="warn" class="cityIcon" v-if="cityCheckIconFlag" @click.native.prevent="cityCheckErrIcon"></icon> -->
        </template>
        <!-- <icon slot="right" type="warn" v-if="cityCheckIconFlag" @click.native="cityCheckErrIcon"></icon> -->
      </x-address>

      <x-input title="手机号码" v-model="phone" placeholder="请输入手机号码">
        <img slot="label" style="padding-right:10px;display:block;" src="/static/phoneGreen.png" width="24" height="24">
        <icon slot="right" type="warn" v-if="phoneCheckIconFlag" @click.native="phoneCheckErrIcon"></icon>
      </x-input>
      <toast v-model="phoneToastShow" type="text" :time="900" is-show-mask :text="phoneToastText" :position="position"></toast>

      <x-input title="短信验证码" v-model="code" placeholder="输入短信验证码" class="weui-vcode">
        <img slot="label" style="padding-right:10px;display:block;" src="/static/vercode.png" width="24" height="24">
          <icon slot="right" type="warn" v-if="codeCheckIconFlag" @click.native="codeCheckErrIcon"></icon>
          <x-button slot="right" v-show="!passwordComputedTime" type="primary" mini style="width:103px;" @click.native.prevent="phoneCheck">获取验证码</x-button>
          <x-button slot="right" v-show="passwordComputedTime" type="primary" mini style="width:103px;" >已发送({{passwordComputedTime}}s)</x-button>
      </x-input>
      <toast v-model="codeToastShow" type="text" :time="900" is-show-mask :text="codeToastText" :position="position"></toast>
    </group>
    </div>
    <div>
    <x-button type="warn" @click.native="confirm">立即注册</x-button>
    </div>
    <alert v-model="alertShow" title="提示" :content="alertContent" @on-hide="onHide"></alert>
  </div>
</template>

<script>
import { Group, XInput, XButton, PopupRadio, PopupPicker, XAddress, ChinaAddressV4Data, Toast, Icon, Alert } from 'vux'
import Routers from '@/router'
import { back } from '@/api/index.js'
// import $ from 'jquery'

export default {
  name: 'forgetPassword', // **********不可以用中文，要和index匹配，这有啥用？
  components: { Group, XInput, XButton, PopupRadio, PopupPicker, XAddress, ChinaAddressV4Data, Toast, Icon, Alert },
  data () {
    return {
      msg: '注册',
      param: {
        'name': '',
        'password': '',
        'mobile': '',
        'auth': '',
        'code': '',
        'province': '',
        'city': ''
      },
      alertShow: false,
      alertContent: '',
      name: '',
      password: '',
      addressData: ChinaAddressV4Data,
      title1: '手机',
      list1: [['安装人员', '客户', '第三方受益人']],
      value1_1: ['客户'],
      phone: '',
      code: '', // 短信验证码
      passwordComputedTime: 0, // 短信验证码倒数记时
      cityvalue: [],
      position: 'center', // 提示信息的位置
      nameCheckIconFlag: false, // 是否显示姓名红色错误图标
      passwordCheckIconFlag: false,
      // cityCheckIconFlag: false,
      phoneCheckIconFlag: false,
      codeCheckIconFlag: false,
      nameToastShow: false, // 是否显示姓名toast提示
      passwordToastShow: false,
      // cityToastShow: false,
      phoneToastShow: false,
      codeToastShow: false,
      nameToastText: '', // 姓名错误提示文本
      passwordToastText: '',
      // cityToastText: '',
      phoneToastText: '',
      codeToastText: ''
    }
  },
  /*
  ** *************生命周期**************
  */
  created: function () {
    this.$store.commit('setHeaderTitle', this.msg)
  },
  methods: {
    // 验证验证码输入准确否，并API告知后台新密码
    confirm: function () {
      console.log('立即注册')
      if (this.value1_1[0] === '安装人员') {
        this.param.auth = 0
      } else if (this.value1_1[0] === '客户') {
        this.param.auth = 1
      } else {
        this.param.auth = 2
      }
      this.nameCheck()
      this.passwordCheck()
      // this.cityCheck()
      this.phoneCheckLast()
      this.codeCheck()
      if (!(this.nameCheckIconFlag || this.passwordCheckIconFlag || this.phoneCheckIconFlag || this.codeCheckIconFlag)) {
        this.param.name = this.name
        this.param.code = this.code
        this.param.password = this.password
        this.backUserRegister()
      }
    },
    onShadowChange: function (ids, names) {
      console.log(ids, names)
      console.log(this.cityvalue)
      this.param.province = names[0]
      this.param.city = names[1]
    },
    // 注册完成后关闭弹框提示，路由跳转
    onHide: function () {
      if (this.alertContent === '注册成功！') {
        // 跳转到登录页面
        Routers.push({ path: '/header/login' })
      }
    },
    /*
    *
    *   ******** API调用函数 ********
    *
    */
    // 用户注册
    backUserRegister: function () {
      console.log(this.param)
      // 登陆API请求
      back.userRegister(this.param).then(function (response) {
        console.log(response)
        if (response.errno > 0) {
          this.alertContent = response.error
          this.alertShow = true
          this.name = ''
          this.phone = ''
          this.password = ''
          this.code = ''
          return
        }
        this.alertContent = '注册成功！'
        this.alertShow = true
      }.bind(this))
    },
    // 发送短信验证信息
    backSmsSend: function () {
      console.log('获取验证码')
      back.sendCode(this.param).then(function (response) {
        console.log(response)
        if (response.errno !== 0) {
          // return
        }
      })
    },
    /*
    *   ******** 表单格式校验 ********
    */
    // 姓名格式校验(若错误则在右侧显示红色错误图标)
    nameCheck: function () {
      let nameNow = this.name
      let nameReg = /(?:[\u4E00-\u9FFF]{1,8}·\u4E00-\u9FFF]{1,8})|(?:[\u4E00-\u9FFF]{2,5})/
      if (nameNow === '') {
        this.nameCheckIconFlag = true
        this.nameToastText = '姓名不能为空'
      } else if (!nameReg.test(nameNow)) {
        this.nameCheckIconFlag = true
        this.nameToastText = '姓名格式不正确'
      } else {
        console.log('姓名格式正确')
        this.nameCheckIconFlag = false
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
    // // 城市选择校验(若错误则在右侧显示红色错误图标)
    // cityCheck: function () {
    //   let cityvalueNow = this.cityvalue
    //   if (cityvalueNow === "") {
    //     this.cityCheckIconFlag = true
    //     this.cityToastText = '请选择城市'
    //   } else {
    //     console.log('已选择城市')
    //     this.cityCheckIconFlag = false
    //   }
    // },
    // 获取短信验证码。(手机号格式校验,若错误则在右侧显示红色错误图标)
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

    // 姓名红色图标触发事件
    nameCheckErrIcon () {
      console.log('触发：nameCheckErrIcon点击事件')
      this.nameToastShow = true
      this.nameCheckIconFlag = false
    },
    // 密码红色图标触发事件
    passwordCheckErrIcon () {
      console.log('触发：passwordCheckErrIcon点击事件')
      this.passwordToastShow = true
      this.passwordCheckIconFlag = false
    },
    // // 城市选择红色图标触发事件
    // cityCheckErrIcon () {
    //   console.log('触发：cityCheckErrIcon点击事件')
    //   this.cityToastShow = true
    //   this.cityCheckIconFlag = false
    // },
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
    }
  }
}
</script>

<style scoped>
.register {
  width: 80%;
  margin:0 auto;
  margin-top: 8%;
}
.content {
  position: relative;
  width: 100%;
  margin:0 auto;
  border-style: groove;
  margin-top: 30px;
  margin-bottom: 30px;
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
/* .weui-btn_primary {
  background-color: #99FFFF;
} */
</style>
