<template>
  <div class="mstep">
    <p id="station">充电桩：{{stationState}}</p>
    <div class="content">
      <group>
        <x-switch v-for="item in scanData" :disabled="isdisabled" :key="item.id" :title="item.title" v-model="item.value" @on-change="sendOrder(item)"></x-switch>
      </group>
    </div>
      <div class="btnbox">
        <x-button type="primary" plain class="btn1" @click.native="clear">清空数据</x-button>
      </div>
    <alert v-model="alertShow" title="提示" :content="alertContent" @on-hide="onHide"></alert>
  </div>
</template>

<script>
import { back } from 'api'
import $ from 'jquery'
import Routers from '@/router'
import { Step, StepItem, XButton, Group, XInput, Panel, XHeader, XDialog, XSwitch, Alert } from 'vux'
export default {
  name: 'deviceTest',
  components: { Step, StepItem, XButton, XInput, Group, Panel, XHeader, XDialog, XSwitch, Alert },
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
      isdisabled: false,
      stationState: '在线',
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
    this.param.userId = this.$store.state.userId
    this.param.Authorization = this.$store.state.Authorization
    this.param.sn = this.$store.state.sn
    this.timerSocket1 = window.setInterval(this.backStationState, 2000)
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
      this.alertContent = '清空数据后该充电桩将与用户解绑，确认清除？'
      this.alertShow = true
    },
    // 添加设备完成后关闭弹框提示，路由跳转
    onHide: function () {
      if (this.alertContent === '清空信息成功！') {
        Routers.push({ path: '/mainCss/deviceList' })
      }
      if (this.alertContent === '清空数据后该充电桩将与用户解绑，确认清除？') {
        this.backStationDel()
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
          // this.timerSocket2 = window.setInterval(this.backSocketState, 2000)
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
  padding-top: 12px;
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
