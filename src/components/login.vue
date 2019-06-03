<template>
  <div class="login">
    <div class="content">
    <group>
      <x-input title="" v-model="mobile" placeholder="请输入手机号">
        <img slot="label" style="padding-right:10px;display:block;" src="/static/meSelected.png" width="24" height="24">
        <icon slot="right" type="warn" v-if="phoneCheckIconFlag" @click.native="phoneCheckErrIcon"></icon>
      </x-input>
      <toast v-model="phoneToastShow" type="text" :time="900" is-show-mask :text="phoneToastText" :position="position"></toast>

      <x-input title="" type="password" v-model="password" placeholder="请输入密码" @keyup.enter.native="login">
        <img slot="label" style="padding-right:10px;display:block;" src="/static/password.png" width="24" height="24">
        <icon slot="right" type="warn" v-if="passwordCheckIconFlag" @click.native="passwordCheckErrIcon"></icon>
      </x-input>
      <toast v-model="passwordToastShow" type="text" :time="900" is-show-mask :text="passwordToastText" :position="position"></toast>
    </group>
    </div>
    <div class="btnflex">
      <p class="pTwo" @click="register">注册</p>
      <p class="pOne" @click="forgetPassword">忘记密码</p>
    </div>
    <div>
    <x-button type="primary" @click.native="login">登录</x-button>
    <!-- <p class="pTwo" ><span @click="register">注册</span></p> -->
    </div>
    <alert v-model="alertShow" title="提示" :content="alertContent"></alert>
    <!-- 下边这样搞element找不到，咋调样式，只是在APP中，不在login中,不是这个意思，是用绝对定位之后就找不到了 -->
    <!-- <div class="footer">
      <p>No account yet?<span>Register Now</span></p>
    </div> -->
  </div>
</template>

<script>
import { sessionSetStore } from '@/components/config/Utils'
import { XHeader, Group, XInput, XButton, Alert, Icon, Toast } from 'vux'
import Routers from '@/router'
import { back } from 'api'
// import $ from 'jquery'

export default {
  name: 'login',
  components: { XHeader, Group, XInput, XButton, Alert, Icon, Toast },
  data () {
    return {
      param: {
        'password': '',
        'mobile': ''
      },
      phoneCheckIconFlag: false, // 是否显示手机号红色错误图标
      passwordCheckIconFlag: false, // 是否显示密码红色错误图标
      phoneToastShow: false, // 是否显示toast提示
      passwordToastShow: false,
      position: 'center', // 提示信息的位置
      phoneToastText: '', // 手机号错误提示文本
      passwordToastText: '',
      msg: '登录',
      mobile: '',
      password: '',
      alertShow: false,
      alertContent: '',
      viewHeight: null
    }
  },
  /*
  ** *************生命周期**************
  */
  created: function () {
    this.$store.commit('setHeaderTitle', this.msg)
    if (this.$cookies.get('mobile')) {
      this.mobile = this.$cookies.get('mobile')
      this.password = this.$cookies.get('password')
    } else {
      console.log('不存在')
    }
  },
  mounted: function () {
    // // 安卓手机软键盘弹出会影响absolute的元素，监控键盘弹起变化，改变相应元素的属性
    // this.viewHeight = $(window).height()
    // var _this = this
    // $(window).resize(function () {
    //   if ($(window).height() < _this.viewHeight) {
    //     $('.pTwo').css('position', 'static')
    //   } else {
    //     $('.pTwo').css('position', 'absolute')
    //   }
    // })
  },
  methods: {
    // 路由跳转到忘记密码
    forgetPassword: function () {
      Routers.push('/header/forgetPassword')
    },
    // 跳转到登录 验证用户名与密码
    login: function () {
      console.log('登录')
      this.param.mobile = this.mobile
      this.param.password = this.password
      this.backUserLog()
    },
    // 跳转到注册页面
    register: function () {
      console.log('注册')
      Routers.push('/header/register')
    },
    /*
    *
    *   ******** API调用函数 ********
    *
    */
    // 用户登录
    backUserLog: function () {
      this.phoneCheck()
      this.passwordCheck()
      if (this.phoneCheckIconFlag === false && this.passwordCheckIconFlag === false) {
        // 登陆API请求
        back.userLogin(this.param).then(function (response) {
          console.log(response)
          if (response.errno > 0) {
            this.alertContent = response.error
            this.alertShow = true
            // this.mobile = ''
            // this.password = ''
            return
          }
          // 用户信息存储vuex localstorge
          this.userinfoStore(response)
          // cookie存储用户登录信息，有效期7天
          this.$cookies.set('mobile', this.param.mobile, '7d')
          this.$cookies.set('password', this.param.password, '7d')
          // 跳转到用户信息页面
          Routers.push({ path: '/mainCss/me' })
        }.bind(this))
      }
    },
    /*
    *
    *   ******** 辅助方法函数 ********
    *
    */
    // 用户信息存储vuex localstorge
    userinfoStore: function (info) {
      // vuex存储
      this.$store.commit('setUserId', info.data.userId)
      this.$store.commit('setUserRole', info.data.auth)
      let Authorization = 'Bearer' + ' ' + info.data.token
      console.log(Authorization)
      this.$store.commit('setAuthorization', Authorization)
      // 针对iphone的数据备份
      sessionSetStore('userId', info.data.userId)
      sessionSetStore('Authorization', Authorization)
      sessionSetStore('userRole', info.data.auth)
      // 保存cookie
      this.$cookies.set('userId', info.data.userId, 300)
      this.$cookies.set('Authorization', Authorization, 300)
      this.$cookies.set('userRole', info.data.auth, 300)
    },
    /*
    *   ******** 表单格式校验 ********
    */
    // 手机号格式校验（若错误则在右侧显示红色错误图标）
    phoneCheck: function () {
      let mobileNow = this.mobile
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
    // 密码格式校验（若错误则在右侧显示红色错误图标）
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
    // 手机号红色图标触发事件
    phoneCheckErrIcon () {
      console.log('触发：phoneCheckErrIcon点击事件')
      this.phoneToastShow = true
      this.phoneCheckIconFlag = false
    },
    // 密码红色图标触发事件
    passwordCheckErrIcon () {
      console.log('触发：passwordCheckErrIcon点击事件')
      this.passwordToastShow = true
      this.passwordCheckIconFlag = false
    }
  }
}
</script>

<style scoped>
.weui-cell {
  height: 35px;
}
.weui-btn_primary {
  background-color: #5CC042;
  margin-top: 16px;
  width: 98%;
  /* height: 50%;无效 */
}
.login {
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
.btnflex {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}
.pOne {
  margin: 0px;
  padding-right: 15px;
  color: #0066FF;
}
.pTwo {
  margin: 0px;
  padding-left: 15px;
  color: #0066FF;
}
/* .pTwo {
  position: absolute;
  bottom: 0px;
  margin: 0 auto;
  left:42.5%;
  width: 15%;
  margin-bottom: 10px;
  font-size: 14px;
}
.pTwo span {
  color: #0C86F5;
} */
</style>
