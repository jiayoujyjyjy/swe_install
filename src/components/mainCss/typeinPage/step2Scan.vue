<template>
  <div class="steps">
    <div class="mstep">
      <step v-model="step" background-color='#fbf9fe'>
        <step-item title="信息录入"></step-item>
        <step-item title="绑定插座"></step-item>
        <step-item title="通信测试"></step-item>
      </step>
      <div class="guide" @click="scanCode">
        <img class="scanImg" src="/static/scan.png"/>
        <p class="ptext">点击扫描插座</p>
      </div>
      <div class="socketList">
        <group>
          <cell v-for="item in scanData" :key="item.id" :title="item.id" :value="item.uid" @click.native="onClick(item)"></cell>
        </group>
      </div>
      <div class="btn_wrap">
        <x-button type="warn" @click.native="submit">下一步</x-button>
      </div>
    </div>
    <alert v-model="alertShow" title="提示" :content="alertContent" @on-hide="onHide"></alert>
  </div>
</template>

<script>
// import $ from 'jquery'
import Routers from '@/router'
import { back } from 'api'
import { sessionGetStore, sessionSetStore, sessionRemoveStore } from '@/components/config/Utils'
import { Step, StepItem, XButton, Group, XInput, XHeader, XDialog, Panel, Cell, Alert } from 'vux'
export default {
  name: 'step2Scan',
  components: { Step, StepItem, XButton, Group, XInput, XHeader, XDialog, Panel, Cell, Alert },
  data () {
    return {
      param: {
        'userId': '',
        'Authorization': '',
        'sockets': [],
        'sn': ''
      },
      step: 1,
      msg: '绑定插座',
      flag: 0,
      alertShow: false,
      alertContent: '',
      selectedItem: null, // 选定要删除的插座信息
      scanData: [],
      sockets: [] // 插座的uid数组，便于存到cookie中
    }
  },
  created: function () {
    this.$store.commit('setHeaderTitle', this.msg)
    var url = document.URL
    console.log(url)
    var urlcode = url.split('#')[0]
    this.$store.dispatch('getWeChatSignature', urlcode)
  },
  mounted: function () {
    // 如果是iphone需要重载窗口，否则cookie中的page不更新
    // reload会导致vuex数据丢失，不是重定向reload时，没法从cookie中拿数据，需要再用session做一层备份
    var browserRule = /^.*((iPhone)|(iPad))+.*$/
    if (browserRule.test(navigator.userAgent)) {
      // alert('是iphone')
      if (sessionGetStore('step2') === 'y') {
        sessionSetStore('step2', 'n')
        window.location.reload()
      } else {
        // 刷新之后的情况
        // 其实这里应该区分下是否是重定向进来的，但是重定向进来下面的会再覆盖一次，就暂不判断了
        this.$store.commit('setUserId', sessionGetStore('userId'))
        this.$store.commit('setSn', sessionGetStore('sn'))
        this.$store.commit('setAuthorization', sessionGetStore('Authorization'))
        this.$store.commit('setUserRole', sessionGetStore('userRole'))
      }
    }
    // 先判断是不是重定向进来的
    if (sessionGetStore('redirect')) {
      if (this.$cookies.get('sn')) {
        // 如果是重定向进来，处理cookie中的sockets数据
        var sockets = this.$cookies.get('sockets').split(',')
        let len = 1
        for (let i = 0; i < sockets.length; i++) {
          let obj = {}
          obj.id = len
          obj.uid = sockets[i]
          this.scanData.push(obj)
          len++
        }
        // 将之前存储的vuex信息重新存入vuex中，保证其他页面正常使用
        this.$store.commit('setSn', this.$cookies.get('sn'))
        this.$store.commit('setUserId', this.$cookies.get('userId'))
        this.$store.commit('setAuthorization', this.$cookies.get('Authorization'))
        this.$store.commit('setUserRole', this.$cookies.get('userRole'))
      }
      sessionRemoveStore('redirect')
    }
    // 1、不是重定向进来，正常存储信息；2、重定向进来，续签cookie的有效时间，从当前时间300s失效
    this.$cookies.set('userId', this.$store.state.userId, 300)
    this.$cookies.set('Authorization', this.$store.state.Authorization, 300)
    this.$cookies.set('userRole', this.$store.state.userRole, 300)
    this.param.userId = this.$store.state.userId
    this.param.Authorization = this.$store.state.Authorization
    this.param.sn = this.$store.state.sn
  },
  methods: {
    // 提交下一步
    submit: function () {
      if (this.scanData.length !== 8) {
        this.alertContent = '请绑定8个插座'
        this.alertShow = true
        return
      }
      this.param.sockets = this.scanData
      this.backBindSocket()
    },
    // 微信JS-SDK二维码扫描
    scanCode: function () {
      console.log('scancode')
      if (this.scanData.length < 8) {
        var payload = {}
        payload.success_callback = this.scanCallback
        this.$store.dispatch('scanQRCode', payload)
      } else {
        this.alertContent = '已绑定8个插座'
        this.alertShow = true
      }
    },
    // 点击删除选中行的插座扫描结果
    onClick: function (item) {
      console.log(item)
      this.selectedItem = item
      this.alertContent = '确定删除该插座吗?'
      this.alertShow = true
    },
    onHide: function () {
      if (this.alertContent === '确定删除该插座吗?') {
        for (let i = 0; i < this.scanData.length; i++) {
          // 删除选中项并调整顺序
          if (this.scanData[i].uid === this.selectedItem.uid) {
            this.scanData.splice(i, 1)
            let len = 1
            for (let j = 0; j < this.scanData.length; j++) {
              this.scanData[j].id = len
              len++
            }
          }
        }
      }
    },
    // 二维码扫描回调处理函数
    scanCallback: function (res) {
      let uid = res.split('=')[1]
      for (let i = 0; i < this.scanData.length; i++) {
        if (this.scanData[i].uid === uid) {
          this.alertContent = '已扫描过该插座！'
          this.alertShow = true
          return
        }
      }
      let obj = {}
      obj.id = this.scanData.length + 1
      obj.uid = uid
      this.scanData.push(obj)
      this.sockets = []
      for (let i = 0; i < this.scanData.length; i++) {
        this.sockets.push(this.scanData[i].uid)
      }
      this.$cookies.set('sockets', this.sockets, 300)
    },
    /*
    *
    *   ******** API调用函数 ********
    *
    */
    // 绑定插座
    backBindSocket: function () {
      back.bindSocket(this.param).then(function (response) {
        console.log(response)
        if (response.errno > 0) {
          this.alertContent = response.error
          this.alertShow = true
          return
        }
        // 续签cookie中sn的有效期
        this.$cookies.set('sn', this.param.sn, 300)
        this.$store.commit('setSockets', this.param.sockets)
        Routers.push('/header/step3Test')
      }.bind(this))
    }
  }
}
</script>

<style scoped>
.mstep {
  width: 80%;
  margin:0 auto;
  margin-top: 8%;
}
.guide {
  width: 100%;
  text-align: center;
  margin: 25px 0;
}
.scanImg {
  width: 30px;
  height: 30px;
}
.ptext {
  font-size: 13px;
}
.socketList {
  border: 1px solid gray;
  padding: 10px 15px;
}
.socketList >>> .weui-cells {
  line-height: 1;
  font-size: 14px;
}
.socketList >>> .weui-cell {
  padding: 0;
}
.btn_wrap {
  width: 35%;
  margin: 0 auto;
  padding:10px 0;
}
.btn_wrap >>> .weui-btn_primary {
  background-color: rgb(250, 64, 64);
}
.btn_wrap >>> .weui-btn {
  font-size: 15px;
}
</style>
