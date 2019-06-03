<template>
  <div class="wechatBind">
    <div class="content">
      <p class='pclass'>{{bindMsg}}</p>
    </div>
    <div class="btn">
      <x-button plain type="primary" v-if="bindFlag" @click.native="unbind">解绑微信号</x-button>
      <x-button plain type="primary" v-else @click.native="bind">绑定微信号</x-button>
    </div>
  </div>
</template>

<script>
import { Group, Cell, XButton, AlertModule } from 'vux'
import { back } from 'api'
import Routers from '@/router'
export default {
  name: 'wechatBind',
  components: { Group, Cell, XButton, AlertModule },
  data () {
    return {
      msg: '微信绑定',
      param: {
        'userId': '',
        'Authorization': ''
      },
      bindFlag: 0, // 0表示未绑定，1表示绑定
      bindMsg: '未绑定微信号'
    }
  },
  /*
  ** *************生命周期**************
  */
  created: function () {
    this.$store.commit('setHeaderTitle', this.msg)
    this.param.userId = this.$store.state.userId
    this.param.Authorization = this.$store.state.Authorization
    this.isBind()
  },
  mounted: function () {
  },
  methods: {
    isBind: function () {
      console.log('判断是否已绑定微信')
      back.userWxInfo(this.param).then(function (response) {
        console.log(response)
        if (response.errno > 0) {
          AlertModule.show({
            title: '提示',
            content: response.error
          })
          return
        }
        if (response.data.bind === true) {
          this.bindFlag = 1
          this.bindMsg = '已绑定微信号'
        } else {
          this.bindFlag = 0
          this.bindMsg = '未绑定微信号'
        }
      }.bind(this))
    },
    bind: function () {
      console.log('绑定微信号')
      back.wxBind(this.param).then((response) => {
        console.log(response)
        if (response.errno === 0) {
          window.location.href = response.data.address // 跳转到微信授权地址，微信授权地址通过服务端获得
        }
      })
    },
    unbind: function () {
      console.log('解绑微信号')
      back.wxUnbind(this.param).then(function (response) {
        if (response.errno === 0) {
          AlertModule.show({
            title: '提示',
            content: '解绑成功'
          })
          Routers.push({ path: '/mainCss/blank' })
        } else {
          AlertModule.show({
            title: '提示',
            content: response.error
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.wechatBind {
  padding-top: 46px;
  margin: auto;
}
.bindclass {
  margin-top: 30px;
  text-align: center;
}
img {
  display: block;
  margin: auto;
  padding-top: 0px;
  width: 20%;
  height: 20%;
}
.pclass {
  /* margin: auto; */
  margin-top: 75px;
  margin-bottom: 36px;
  text-align: center;
}
.buttonCss {
  padding-top: 36px;
  padding-left: 40px;
  margin: auto;
}
.flex-demo {
  height: 50px;
  width: 100px;
  text-align: center;
  line-height: 50px;
  color: black;
  background-color: #20b907;
  border-radius: 4px;
  background-clip: padding-box;
}
.btn {
  width: 27%;
  margin: 0 auto;
  margin-top: 20px;
  height: 50%;
}
.btn >>> .weui-btn {
  font-size: 13px;
}
</style>
