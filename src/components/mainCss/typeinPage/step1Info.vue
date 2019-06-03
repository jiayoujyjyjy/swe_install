<template>
  <div id="steps">
    <!-- <x-header class="vux-demo-header-box" :left-options="{backText: ''}" slot="header" style="position: absolute;">设备信息录入</x-header> -->
    <div class="mstep">
      <step v-model="step" background-color='#fbf9fe'>
        <step-item title="信息录入"></step-item>
        <step-item title="绑定插座"></step-item>
        <step-item title="通信测试"></step-item>
      </step>
      <div class="content">
        <group>
            <x-input title="名称" name="name" v-model="name" placeholder="名称" @on-change="nameChange">
              <img slot="label" style="padding-right:10px;display:block;" src="/static/stationName.png" width="24" height="24">
            </x-input>
            <x-input title="密码" name="password" v-model="password" placeholder="密码" @on-change="passChange">
              <img slot="label" style="padding-right:10px;display:block;" src="/static/password.png" width="24" height="24">
            </x-input>
            <x-input title="sn" name="sn" v-model="sn" placeholder="序列号" @on-change="snChange">
              <img slot="label" style="padding-right:10px;display:block;" src="/static/sn.png" width="24" height="24">
            </x-input>
            <popup-picker popup-title="请选择" title="充电桩类型" :data="List" v-model="typeSelected" placeholder="请选择" @on-change="typeChange">
              <template slot="title" slot-scope="props"><!-- use scope="props" when vue < 2.5.0 -->
                <span :class="props.labelClass" :style="props.labelStyle" style="height:24px;">
                <img slot="label" style="padding-right:4.5px;" src="/static/station.png" width="24" height="24">
                <!--span class="demo-icon demo-icon-big" style="font-size:20px;vertical-align:middle;"></span-->
                <span style="vertical-align: super;">充电桩类型</span>
                </span>
              </template>
            </popup-picker>
            <popup-picker popup-title="请选择" title="区域类型" :data="tagList" v-model="valueSelected" placeholder="请选择" @on-change="tagChange">
              <template slot="title" slot-scope="props"><!-- use scope="props" when vue < 2.5.0 -->
                <span :class="props.labelClass" :style="props.labelStyle" style="height:24px;">
                <img slot="label" style="padding-right:4.5px;" src="/static/label.png" width="24" height="24">
                <!--span class="demo-icon demo-icon-big" style="font-size:20px;vertical-align:middle;"></span-->
                <span style="vertical-align: super;">区域类型</span>
                </span>
              </template>
            </popup-picker>
            <x-address @on-shadow-change="onShadowChange" @on-hide="logHide" v-model="cityvalue" title="城市" :list="addressData" placeholder="请选择城市" hide-district>
              <template slot="title" slot-scope="props">
                <img slot="label" style="padding-right:4.5px;" src="/static/city.png" width="24" height="24">
                <span style="vertical-align: super;">城市</span>
              </template>
            </x-address>
            <x-input title="地址" v-model="madress" name="adress" disabled placeholder="位置">
              <img slot="label" style="padding-right:10px;display:block;" src="/static/location.png" width="24" height="24">
              <x-button slot="right" type="primary" mini @click.native="getLoca">获取位置</x-button>
            </x-input>
            <x-input disabled placeholder="纬度" v-model="lat" style="width:130px;float:left;">
              <img slot="label" style="padding-right:10px;display:block;" src="/static/location.png" width="24" height="24">
            </x-input>
            <x-input title="" label-width="2em" disabled placeholder="经度" v-model="lon"></x-input>
            <x-input title="地址名称" v-model="mapAddress" placeholder="请输入地址名称" @on-change="addressChange">
              <img slot="label" style="padding-right:10px;display:block;" src="/static/mapAddress.png" width="24" height="24">
            </x-input>
        </group>
      </div>
      <div class="btn_wrap">
        <x-button type="warn" @click.native="submit">下一步</x-button>
      </div>
    </div>
    <alert v-model="alertShow" title="提示" :content="alertContent"></alert>
  </div>
</template>

<script>
import BMap from 'BMap'
import Routers from '@/router'
import { back } from 'api'
import { sessionGetStore, sessionSetStore, sessionRemoveStore } from '@/components/config/Utils'
// import $ from 'jquery'
// import BMAP_STATUS_SUCCESS from 'BMAP_STATUS_SUCCESS'
import { Step, StepItem, XButton, Group, XInput, XNumber, PopupPicker, CheckerItem, XHeader, Cell, Alert, XAddress, ChinaAddressV4Data } from 'vux'
export default {
  name: 'step1Info',
  components: { Step, StepItem, XButton, Group, XInput, XNumber, PopupPicker, CheckerItem, XHeader, Cell, Alert, XAddress, ChinaAddressV4Data },
  data () {
    return {
      param: {
        'userId': '',
        'Authorization': '',
        'name': '',
        'sn': '',
        'password': '',
        'label': '',
        'address': '',
        'lat': '',
        'lon': '',
        'ele': '12',
        'type': '',
        'province': '',
        'city': ''
      },
      step: 0,
      msg: '信息录入',
      name: '',
      password: '',
      sn: '',
      lon: null,
      lat: null,
      madress: '点击获取位置信息',
      mapAddress: '',
      tagList: [['小区', '学校', '园区', '企业', '政府机关', '公共场所', '其他']],
      List: [['慢充']],
      valueSelected: ['小区'],
      typeSelected: ['慢充'],
      cityvalue: ['330000', '330100'],
      addressData: ChinaAddressV4Data,
      alertShow: false,
      alertContent: '',
      viewheight: null
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
      alert('是iphone')
      if (sessionGetStore('step1') === 'y') {
        sessionSetStore('step1', 'n')
        window.location.reload()
      } else {
        // 刷新之后的情况
        this.$store.commit('setUserId', sessionGetStore('userId'))
        this.$store.commit('setAuthorization', sessionGetStore('Authorization'))
        this.$store.commit('setUserRole', sessionGetStore('userRole'))
      }
    }
    // 先判断是不是重定向进来的
    if (sessionGetStore('redirect')) {
      // 因为devName一般是最先存储的，以devName的有效时间为准
      if (this.$cookies.get('devName')) {
        this.name = unescape(this.$cookies.get('devName'))
        this.password = this.$cookies.get('devpass') ? this.$cookies.get('devpass') : ''
        this.sn = this.$cookies.get('sn') ? this.$cookies.get('sn') : ''
        this.typeSelected[0] = this.$cookies.get('type') ? unescape(this.$cookies.get('type')) : '慢充'
        this.valueSelected[0] = this.$cookies.get('tag') ? unescape(this.$cookies.get('tag')) : '小区'
        // 处理cityIds
        if (this.$cookies.get('cityIds')) {
          console.log('重定向cityIDs')
          var pro = this.$cookies.get('cityIds').substr(0, 6)
          var city = this.$cookies.get('cityIds').substr(7, 6)
          this.cityvalue = []
          this.cityvalue.push(pro)
          this.cityvalue.push(city)
          console.log(this.cityvalue)
          this.param.province = unescape(this.$cookies.get('province'))
          this.param.city = unescape(this.$cookies.get('city'))
        }
        this.lon = this.$cookies.get('lon') ? this.$cookies.get('lon') : null
        this.lat = this.$cookies.get('lat') ? this.$cookies.get('lat') : null
        this.mapAddress = this.$cookies.get('address') ? unescape(this.$cookies.get('address')) : ''
        // 将之前存储的vuex信息重新存入vuex中，保证其他页面正常使用
        this.$store.commit('setUserId', this.$cookies.get('userId'))
        this.$store.commit('setAuthorization', this.$cookies.get('Authorization'))
        this.$store.commit('setUserRole', this.$cookies.get('userRole'))
        // this.$store.commit('setHeaderTitle', unescape(this.$cookies.get('headerTitle')))
        // this.$store.commit('setHeaderFlag', this.$cookies.get('headerFlag'))
      }
      sessionRemoveStore('redirect')
    }
    // 解决安卓手机软键盘顶起布局的问题
    // this.viewheight = document.documentElement.clientHeight
    // var _this = this
    // $(window).resize(function () {
    //   if ($(window).height() < _this.viewHeight) {
    //     $('.tabbarcss').css('position', 'static')
    //   } else {
    //     $('.tabbarcss').css('position', 'absolute')
    //   }
    // })
    // window.onload = function () {
    //     document.getElementById('app').style.height= hrt+'px'//把获取到的高度赋值给根div
    // }
    // console.log('height')
    // var height1 = $(window).height()
    // console.log(height1)
    // var height2 = document.documentElement.clientHeight
    // console.log(height2)
    // var height3 = document.body.clientHeight
    // console.log(height3)
    // var height4 = document.getElementById('steps').style.height
    // console.log(height4)
  },
  methods: {
    submit: function () {
      if (this.name === '' || this.password === '' || this.sn === '' || this.mapAddress === '' || this.lat === null || this.lon === null) {
        this.alertContent = '请输入全部信息'
        this.alertShow = true
        return
      }
      this.param.userId = this.$store.state.userId
      this.param.Authorization = this.$store.state.Authorization
      this.param.name = this.name
      this.param.sn = this.sn
      this.param.password = this.password
      this.param.label = this.valueSelected[0]
      this.param.address = this.mapAddress
      this.param.lat = this.lat
      this.param.lon = this.lon
      this.param.type = this.typeSelected[0]
      console.log(this.param)
      this.backChargingPileAdd()
    },
    // 接下来几个change函数是为了获取用户实时输入，存入cookie，协助退出网页后返回到离开前的页面并存储信息
    nameChange: function (value) {
      console.log(value)
      this.$cookies.set('devName', value, 300)
      // var b = this.$cookies.get('sn') ? '存在' : '不存在'
      // console.log(b)
      // 这里要存储vuex里面的信息，在用户下一次直接进入页面后，正常使用其他页面功能
      this.$cookies.set('userId', this.$store.state.userId, 300)
      this.$cookies.set('Authorization', this.$store.state.Authorization, 300)
      this.$cookies.set('userRole', this.$store.state.userRole, 300)
      // this.$cookies.set('headerTitle', this.$store.state.headerTitle, 300)
      // this.$cookies.set('headerFlag', this.$store.state.headerFlag, 300)
    },
    passChange: function (value) {
      console.log(value)
      this.$cookies.set('devpass', value, 300)
    },
    snChange: function (value) {
      console.log(value)
      this.$cookies.set('sn', value, 300)
    },
    typeChange: function (value) {
      console.log(value)
      this.$cookies.set('type', value[0], 300)
    },
    tagChange: function (value) {
      console.log(value)
      this.$cookies.set('tag', value[0], 300)
    },
    addressChange: function (value) {
      console.log(value)
      this.$cookies.set('address', value, 300)
    },
    // 省市选择改变事件
    onShadowChange: function (ids, names) {
      console.log(ids, names)
      this.$cookies.set('cityIds', ids, 300)
      this.param.province = names[0]
      this.param.city = names[1]
      this.$cookies.set('province', names[0], 300)
      this.$cookies.set('city', names[1], 300)
      // 防止用户没有点完成，目前采取只要用户改变选择就记录输入
      this.cityvalue = ids
    },
    // 城市选择关闭事件
    logHide: function (str) {
      // 确定时为true, 没有确定时为false
      console.log('on-hide', str)
    },
    // 通过微信接口获取位置
    getLoca: function () {
      console.log('location')
      var payload = {}
      payload.success_callback = this.loca
      payload.fail_callback = this.fail
      this.$store.dispatch('queLocation', payload)
    },
    // 获取位置成功回调函数
    loca: function (res) {
      console.log('微信位置回调返回')
      console.log(res)
      // alert('成功')
      // alert(res.longitude)
      // alert(typeof (res.longitude))
      if (String(res.longitude).split('.')[1].length <= 6) {
        this.lon = Number(res.longitude)
      } else {
        this.lon = Number(res.longitude).toFixed(6)
      }
      if (String(res.latitude).split('.')[1].length <= 6) {
        this.lat = Number(res.latitude)
      } else {
        this.lat = Number(res.latitude).toFixed(6)
      }
      this.$cookies.set('lon', this.lon, 300)
      this.$cookies.set('lat', this.lat, 300)
      // var point = new BMap.Point(res.longitude, res.latitude)
      // this.getAddress(point)
      // var convertor = new BMap.Convertor()
      // var pointArr = []
      // pointArr.push(point)
      // var vueNum = this
      // // 坐标转换完之后的回调函数
      // var translateCallback = function (data) {
      //   if (data.status === 0) {
      //     console.log(data)
      //     // vueNum.lon = data.points[0].lng
      //     // vueNum.lat = data.points[0].lat
      //     vueNum.getAddress(data)
      //   }
      // }
      // convertor.translate(pointArr, 1, 5, translateCallback)
    },
    // 获取位置失败回调函数
    fail: function () {
      console.log('定位关闭')
      this.alertContent = '请打开手机定位！'
      this.alertShow = true
    },
    // 根据微信返回的坐标通过百度地图逆地址解析得到地址
    getAddress: function (point) {
      console.log(point)
      let geoc = new BMap.Geocoder()
      geoc.getLocation(point, function (rs) {
        console.log(rs)
        var addComp = rs.addressComponents
        this.mapAddress = addComp.province + addComp.city + addComp.district
      }.bind(this))
    },
    /*
    *
    *   ******** API调用函数 ********
    *
    */
    // 新增充电桩
    backChargingPileAdd: function () {
      back.chargingPileAdd(this.param).then(function (response) {
        console.log(response)
        if (response.errno > 0) {
          this.alertContent = response.error
          this.alertShow = true
          this.name = ''
          this.password = ''
          this.sn = ''
          this.lon = null
          this.lat = null
          this.mapAddress = ''
          return
        }
        this.$store.commit('setSn', this.sn)
        this.$cookies.set('sn', this.sn, 300)
        // 同时存cookie和session是因为，cookie有失效时间，防止用户在某个页面停留过就，cookie的数据就没有了
        sessionSetStore('sn', this.sn)
        Routers.push('/header/step2Scan')
      }.bind(this))
    }
  }
}
</script>

<style scoped>
#steps {
  width: 100%;
  height: 1200px;
}
#map {
  height: 20px;
}
.mstep {
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
  background-color: rgb(250, 64, 64);
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
  background-color: #FF3B3B;
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
