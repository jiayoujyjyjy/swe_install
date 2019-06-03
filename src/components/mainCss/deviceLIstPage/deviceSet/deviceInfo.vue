<template>
  <div class="deviceInfo">
    <div class="content">
      <group>
        <x-input title="名称" name="name" v-model="name" placeholder="名称">
          <img slot="label" style="padding-right:10px;display:block;" src="/static/stationName.png" width="24" height="24">
        </x-input>
        <x-input title="sn" disabled name="sn" v-model="sn" placeholder="序列号">
          <img slot="label" style="padding-right:10px;display:block;" src="/static/sn.png" width="24" height="24">
        </x-input>
        <popup-picker popup-title="请选择" title="区域类型" :data="tagList" v-model="valueSelected" placeholder="请选择">
          <template slot="title" slot-scope="props"><!-- use scope="props" when vue < 2.5.0 -->
            <span :class="props.labelClass" :style="props.labelStyle" style="height:24px;">
            <img slot="label" style="padding-right:4.5px;" src="/static/label.png" width="24" height="24">
            <span style="vertical-align: super;">区域类型</span>
            </span>
          </template>
        </popup-picker>
        <x-input title="地址" disabled v-model="madress" name="adress" placeholder="位置">
          <img slot="label" style="padding-right:10px;display:block;" src="/static/location.png" width="24" height="24">
          <x-button slot="right" type="primary" mini @click.native="getloc">获取位置</x-button>
        </x-input>
        <x-input disabled placeholder="纬度" v-model="lat" style="width:130px;float:left;">
          <img slot="label" style="padding-right:10px;display:block;" src="/static/location.png" width="24" height="24">
        </x-input>
        <x-input title="" label-width="2em" disabled placeholder="经度" v-model="lon"></x-input>
        <x-input title="地址名称" v-model="mapAddress" placeholder="请输入地址名称">
          <img slot="label" style="padding-right:10px;display:block;" src="/static/mapAddress.png" width="24" height="24">
        </x-input>
      </group>
    </div>
    <div class="btn_wrap">
      <x-button plain type="primary" @click.native="submit" v-show="(userRole != 2)">提交修改</x-button>
    </div>
    <alert v-model="alertShow" title="提示" :content="alertContent"></alert>
  </div>
</template>

<script>
import { back } from 'api'
import $ from 'jquery'
// import Routers from '@/router'
import { Step, StepItem, XButton, Group, XInput, XNumber, PopupPicker, CheckerItem, XHeader, Cell, Alert } from 'vux'
export default {
  components: { Step, StepItem, XButton, Group, XInput, XNumber, PopupPicker, CheckerItem, XHeader, Cell, Alert },
  data () {
    return {
      step: 0,
      msg: '信息录入',
      param: {
        'userId': '',
        'Authorization': '',
        'sn': '',
        'name': '',
        'lat': '',
        'lon': '',
        'ele': '12',
        'address': '',
        'label': ''
      },
      name: '',
      sn: '',
      madress: '点击获取位置信息',
      lon: '',
      lat: '',
      mapAddress: '',
      tagList: [['小区', '学校', '园区', '企业', '政府机关', '公共场所', '其他']],
      valueSelected: ['小区'],
      alertShow: false,
      alertContent: ''
    }
  },
  computed: {
    userRole: function () {
      return this.$store.state.userRole
    }
  },
  created: function () {
    console.log('user')
    this.$store.commit('setHeaderTitle', this.msg)
    var url = document.URL
    console.log(url)
    var urlcode = url.split('#')[0]
    this.$store.dispatch('getWeChatSignature', urlcode)
  },
  mounted: function () {
    this.param.userId = this.$store.state.userId
    this.param.Authorization = this.$store.state.Authorization
    this.param.sn = this.$store.state.sn
    this.sn = this.$store.state.sn
    this.backStationInfo()
    // 解决安卓手机软键盘弹出顶起绝对布局元素
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
    submit: function () {
      this.param.name = this.name
      this.param.lat = this.lat
      this.param.lon = this.lon
      this.param.label = this.valueSelected[0]
      this.param.address = this.mapAddress
      this.backStationMod()
    },
    // 通过微信接口获取位置
    getloc: function () {
      var payload = {}
      payload.success_callback = this.loca
      payload.fail_callback = this.fail
      this.$store.dispatch('queLocation', payload)
    },
    // 获取位置成功回调函数
    loca: function (res) {
      console.log('微信位置回调返回')
      console.log(res)
      this.lon = res.longitude.toFixed(6)
      this.lat = res.latitude.toFixed(6)
    },
    // 获取位置失败回调函数
    fail: function () {
      console.log('定位关闭')
      this.alertContent = '请打开手机定位！'
      this.alertShow = true
    },
    /*
    *
    *   ******** API调用函数 ********
    *
    */
    // 获取充电桩信息
    backStationInfo: function () {
      console.log(this.param)
      console.log('获取充电桩信息')
      back.stationInfo(this.param).then(function (response) {
        console.log(response)
        if (response.errno > 0) {
          this.alertContent = response.error
          this.alertShow = true
        }
        this.name = response.data.name
        this.valueSelected = []
        this.valueSelected.push(response.data.label)
        this.lat = response.data.lat
        this.lon = response.data.lon
        this.mapAddress = response.data.address
      }.bind(this))
    },
    // 修改充电桩信息
    backStationMod: function () {
      console.log(this.param)
      back.stationMod(this.param).then(function (response) {
        console.log(response)
        if (response.errno > 0) {
          this.alertContent = response.error
          this.alertShow = true
        }
        this.alertContent = '修改成功'
        this.alertShow = true
        this.backStationInfo()
      }.bind(this))
    }
  }
}
</script>

<style scoped>
#map {
  height: 20px;
}
.deviceInfo {
  padding-top: 46px;
  width: 80%;
  margin:0 auto;
  /* *** */
  margin-top: 8%;
}
.content {
  position: relative;
  width: 100%;
  margin:0 auto;
  border-style: groove;
  margin-top: 30px;
  /* ***** */
  margin-bottom: 30px;
}
.btn_wrap {
  /* padding-bottom: 40%; */
  margin-top: 60px;
  width: 50%;
  margin: 0 auto;
}
.btn_wrap >>> .weui-btn_primary {
  background-color: #5CC042;
}
a:active {
  color: antiquewhite;
}
.demo4-item {
  background-color: #ddd;
  color: #222;
  font-size: 14px;
  padding: 5px 10px;
  margin-right: 10px;
  line-height: 18px;
  border-radius: 15px;
}
.demo4-item-selected {
  background-color: #5CC042;
  color: #fff;
}
.demo4-item-disabled {
  color: #999;
}
.content >>> .weui-cells {
  margin-top: 0px;
  font-size: 16px
}
.chsetitle >>> .p {
  margin: 0!important;
}
.content >>> .weui-label {
  color: gray;
}
</style>
