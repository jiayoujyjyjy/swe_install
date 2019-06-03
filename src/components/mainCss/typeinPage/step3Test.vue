<template>
  <div class="steps">
    <div class="mstep">
      <step v-model="step" background-color='#fbf9fe'>
        <step-item title="信息录入"></step-item>
        <step-item title="绑定插座"></step-item>
        <step-item title="通信测试"></step-item>
      </step>
      <p id="station">充电桩：{{stationState}}</p>
      <div class="content">
        <group>
          <x-switch v-for="item in scanData" :disabled="isdisabled" :key="item.id" :title="item.title" v-model="item.value" @on-change="sendOrder(item)"></x-switch>
        </group>
      </div>
      <div class="btnbox">
        <x-button type="primary" plain class="btn1" @click.native="clear">清空数据</x-button>
        <div class="btn_wrap">
          <x-button type="warn" @click.native="finish">完成</x-button>
        </div>
      </div>
    </div>
    <div>
      <loading :show="showloading" :text="loadingtext"></loading>
    </div>
    <alert v-model="alertShow" title="提示" :content="alertContent" @on-hide="onHide"></alert>
  </div>
</template>

<script>
import { back } from 'api'
import $ from 'jquery'
import Routers from '@/router'
import { sessionGetStore, sessionSetStore, sessionRemoveStore } from '@/components/config/Utils'
import { Step, StepItem, XButton, Group, XInput, Panel, XHeader, XDialog, XSwitch, Alert, Loading } from 'vux'
export default {
  name: 'step3Test',
  components: { Step, StepItem, XButton, XInput, Group, Panel, XHeader, XDialog, XSwitch, Alert, Loading },
  data () {
    return {
      param: {
        'userId': '',
        'Authorization': '',
        'sn': '',
        'id': '',
        'on': ''
      },
      step: 2,
      msg: '通信测试',
      alertContent: '',
      alertShow: false,
      stationState: '在线',
      isdisabled: false,
      showloading: false,
      loadingtext: '充电桩上线需要时间，请稍候',
      flag: 0, // 进入页面，先查询一次充电桩状态，如果在线接下来正常操作，如果不在线，显示loading,时长一分钟，并做相关提示。flag标识是否是第一次查询充电桩状态
      timerSocket1: 0, // 定时器，定时查询充电桩状态
      timerSocket2: 0, // 定时器，定时查询插座状态
      scanData: [{
        id: 1,
        title: '插座1',
        value: false,
        on: false, // 插座是否经过开启控制测试
        off: false // 插座是否经过关闭控制测试
      }, {
        id: 2,
        title: '插座2',
        value: false,
        on: false,
        off: false
      }, {
        id: 3,
        title: '插座3',
        value: false,
        on: false,
        off: false
      }, {
        id: 4,
        title: '插座4',
        value: false,
        on: false,
        off: false
      }, {
        id: 5,
        title: '插座5',
        value: false,
        on: false,
        off: false
      }, {
        id: 6,
        title: '插座6',
        value: false,
        on: false,
        off: false
      }, {
        id: 7,
        title: '插座7',
        value: false,
        on: false,
        off: false
      }, {
        id: 8,
        title: '插座8',
        value: false,
        on: false,
        off: false
      }]
    }
  },
  created: function () {
    this.$store.commit('setHeaderTitle', this.msg)
  },
  mounted: function () {
    // 如果是iphone需要重载窗口，否则cookie中的page不更新
    // reload会导致vuex数据丢失，不是重定向reload时，没法从cookie中拿数据，需要再用session做一层备份
    // 有坑，如果step2是重定向进来的，到step3,session没有数据
    var browserRule = /^.*((iPhone)|(iPad))+.*$/
    if (browserRule.test(navigator.userAgent)) {
      // alert('是iphone')
      if (sessionGetStore('step3') === 'y') {
        sessionSetStore('step3', 'n')
        window.location.reload()
      } else {
        // 刷新之后的情况
        this.$store.commit('setSn', sessionGetStore('sn'))
        this.$store.commit('setUserId', sessionGetStore('userId'))
        this.$store.commit('setAuthorization', sessionGetStore('Authorization'))
        this.$store.commit('setUserRole', sessionGetStore('userRole'))
      }
    }
    // 先判断是不是重定向进来的
    if (sessionGetStore('redirect')) {
      if (this.$cookies.get('sn')) {
        // 如果是重定向进来，处理数据
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
    this.flag = 0
    this.backStationState()
  },
  // 生命周期，销毁前
  beforeDestroy: function () {
    // 停止定时器
    window.clearInterval(this.timerSocket1)
    // window.clearInterval(this.timerSocket2)
  },
  methods: {
    // 单个测试
    sendOrder: function (item) {
      this.isdisabled = true
      this.param.id = item.id
      if (item.value === true) {
        this.param.on = 1
        this.backSocketOrder()
      } else {
        this.param.on = 0
        this.backSocketOrder()
      }
    },
    // 测试遇到问题，清空相关数据
    clear: function () {
      this.alertContent = '确认清空？'
      this.alertShow = true
    },
    // 完成设备录入
    finish: function () {
      this.alertContent = '确定充电桩通信测试已成功？'
      this.alertShow = true
    },
    // 添加设备完成后关闭弹框提示，路由跳转
    onHide: function () {
      if (this.alertContent === '清空信息成功！') {
        Routers.push({ path: '/header/step1Info' })
      }
      if (this.alertContent === '添加充电桩成功！') {
        Routers.push({ path: '/mainCss/deviceList' })
      }
      if (this.alertContent === '确认清空？') {
        this.backStationDel()
      }
      if (this.alertContent === '确定充电桩通信测试已成功？') {
        this.backConfigFinsh()
      }
    },
    /*
    *
    *   ******** API调用函数 ********
    *
    */
    // 发送命令
    backSocketOrder: function () {
      back.socketOrder(this.param).then(function (response) {
        console.log('通信测试')
        if (response.errno > 0) {
          this.alertContent = response.error
          this.alertShow = true
        }
        this.alertContent = '控制成功！'
        this.alertShow = true
        this.isdisabled = false
      }.bind(this))
    },
    // 获取充电桩状态
    backStationState: function () {
      back.stationState(this.param).then(function (response) {
        if (response.errno > 0) {
          this.alertContent = response.error
          this.alertShow = true
          return
        }
        if (response.data.state === 1) {
          this.stationState = '离线'
          $('#station').css({color: '#FA4040'})
          // window.clearInterval(this.timerSocket2)
        } else {
          this.stationState = '在线'
          $('#station').css({color: '#1AAD19'})
          this.showloading = false
          // this.timerSocket2 = window.setInterval(this.backSocketState, 2000)
        }
        // 第一次查询充电桩状态
        if (this.flag === 0) {
          this.timerSocket1 = window.setInterval(this.backStationState, 2000)
          this.flag = 1
          if (response.data.state === 1) {
            this.showloading = true
            window.setTimeout(() => {
              this.showloading = false
              if (this.stationState === '离线') {
                this.alertContent = '当前充电桩不在线，请稍后在设备列表中进行通信测试！'
                this.alertShow = true
              }
            }, 60000)
          }
        }
      }.bind(this))
    },
    // 获取插座状态
    backSocketState: function () {
      back.socketState(this.param).then(function (response) {
        if (response.errno > 0) {
          this.alertContent = response.error
          this.alertShow = true
          return
        }
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].state !== 0) {
            this.scanData[i].title = '插座' + (i + 1) + '(离线)'
          }
        }
      }.bind(this))
    },
    // 将充电桩修改为配置完成
    backConfigFinsh: function () {
      back.configFinsh(this.param).then(function (response) {
        if (response.errno > 0) {
          this.alertContent = response.error
          this.alertShow = true
          return
        }
        this.alertContent = '添加充电桩成功！'
        this.alertShow = true
      }.bind(this))
    },
    // 通信测试失败，删除充电桩
    backStationDel: function () {
      back.stationDel(this.param).then(function (response) {
        if (response.errno > 0) {
          this.alertContent = response.error
          this.alertShow = true
          return
        }
        this.alertContent = '清空信息成功！'
        this.alertShow = true
      }.bind(this))
    }
  }
}
</script>

<style scoped>
.mstep {
  width: 80%;
  margin:0 auto;
  /* ************** */
  margin-top: 8%;
}
#station {
  text-align: center;
  color: #1AAD19;
}
.content {
  position: relative;
  width: 100%;
  margin:0 auto;
  border: 1px solid grey;
  margin-top: 10px;
  margin-bottom: 25px;
  overflow: auto;
}
.content >>> .weui-cells {
  line-height: 1;
  font-size: 14px;
}
.content >>> .weui-switch {
  width: 42px;
  height: 26px;
  border-radius: 12px;
}
.content >>> .weui-switch:before {
  width: 40px;
  height: 24px;
  border-radius: 12px;
}
.content >>> .weui-switch:after {
  width: 24px;
  height: 24px;
  border-radius: 12px;
}
.btnbox {
  width: 100%;
  margin: 10px 0 15px 0;
  display: flex;
  display: -webkit-flex; /* Safari */
  justify-content: space-between;
}
.btnbox >>> .weui-btn_plain-primary {
  margin-top: 0px;
  font-size: 15px;
}
.btn1 {
  height: 100%;
  width: 35%;
}
.btn_wrap {
  margin-top: 160px;
  width: 35%;
  margin: 0 auto;
}
.btn_wrap >>> .weui-btn_primary {
  background-color: rgb(250, 64, 64);
}
.content >>> .weui-cells {
  margin-top: 0px;
}
.content >>> .weui-panel {
  margin-top: 0px;
}
.btn_wrap >>> .weui-btn {
  font-size: 15px;
}
</style>
