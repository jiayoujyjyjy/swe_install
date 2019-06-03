<template>
  <div id="mainCss">
    <view-box ref="viewbox">
      <x-header v-if="headerFlag" class="vux-demo-header-box" :left-options="{backText: ''}" slot="header" style="position: absolute;">{{msg}}</x-header>
      <!-- vux标签一定会固有一个class用来做css，所以不用自己再添加vux-demo-header-box，若添加则有两个并列的class,选择哪个都可以 -->
        <router-view></router-view>
      <div class="footer">
        <tabbar class="tabbarcss" slot="bottom">
          <tabbar-item link="/mainCss/typein" @click.native="changeTypeinImgColor" v-show="(userRole != 2)">
            <img slot="icon" :src="srcTypein">
            <span slot="label" :class="{classTypein:isTypein}">设备录入</span>
          </tabbar-item>
          <tabbar-item link="/mainCss/deviceList" @click.native="changeDeviceListImgColor">
            <img slot="icon" :src="srcDevice">
            <span slot="label" :class="{classDevice:isDevice}">设备列表</span>
          </tabbar-item>
          <tabbar-item link="/mainCss/data" @click.native="changeDataImgColor" v-show="(userRole != 0)">
            <img slot="icon" :src="srcData">
            <span slot="label" :class="{classData:isData}">数据概况</span>
          </tabbar-item>
          <tabbar-item link="/mainCss/me" @click.native="changeMeImgColor">
            <img slot="icon" :src="srcMe">
            <span slot="label" :class="{classMe:isMe}">个人中心</span>
          </tabbar-item>
        </tabbar>
      </div>
    </view-box>
  </div>
</template>

<script>
// import Routers from '@/router'
// import $ from 'jquery'
import { ViewBox, XHeader, Tabbar, TabbarItem, Alert } from 'vux'
export default {
  name: 'App',
  components: { ViewBox, XHeader, Tabbar, TabbarItem, Alert },
  data () {
    return {
      //  msg: '鸿世充电',
      test1: true,
      srcTypein: '/static/typein.png',
      srcDevice: '/static/deviceList.png',
      srcData: '/static/data.png',
      srcMe: '/static/me.png',
      classTypein: 'classTypein',
      isTypein: false,
      classDevice: 'classDevice',
      isDevice: false,
      classData: 'classData',
      isData: false,
      classMe: 'classMe',
      isMe: false,
      viewHeight: null
    }
  },
  // computed与watch,created,methods。。。种种的区别
  computed: {
    msg: function () {
      return this.$store.state.headerTitle
    },
    headerFlag: function () {
      return this.$store.state.headerFlag
    },
    userRole: function () {
      return this.$store.state.userRole
    }
  },
  // created只是一次性的相当于=>要用computed输出之前进行事件操作
  created: function () {
    console.log(this.userRole)
  },
  mounted: function () {
  },
  methods: {
    changeTypeinImgColor: function () {
      this.isTypein = true
      this.isDevice = false
      this.isData = false
      this.isMe = false
      this.srcTypein = '/static/typeinSelected.png'
      this.srcDevice = '/static/deviceList.png'
      this.srcData = '/static/data.png'
      this.srcMe = '/static/me.png'
    },
    changeDeviceListImgColor: function () {
      this.isTypein = false
      this.isDevice = true
      this.isData = false
      this.isMe = false
      this.srcTypein = '/static/typein.png'
      this.srcDevice = '/static/deviceListSelected.png'
      this.srcData = '/static/data.png'
      this.srcMe = '/static/me.png'
    },
    changeDataImgColor: function () {
      this.isTypein = false
      this.isDevice = false
      this.isData = true
      this.isMe = false
      this.srcTypein = '/static/typein.png'
      this.srcDevice = '/static/deviceList.png'
      this.srcData = '/static/dataSelected.png'
      this.srcMe = '/static/me.png'
    },
    changeMeImgColor: function () {
      this.isTypein = false
      this.isDevice = false
      this.isData = false
      this.isMe = true
      this.srcTypein = '/static/typein.png'
      this.srcDevice = '/static/deviceList.png'
      this.srcData = '/static/data.png'
      this.srcMe = '/static/meSelected.png'
    }
  }
}
</script>

<style>
body, html {
  margin: 0px;
  /* padding-top: 46px; */
  padding: 0px;
  height: 100%;
  width: 100%;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
}
#mainCss {
  /* padding-top: 46px; */
  color: #2c3e50;
  height:100%;
  width: 100%;
  overflow-x: hidden;
}
.vux-header {
  z-index: 100;
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  background-color: #2c3e50!important;
}
.tabbarcss {
  /* position: absolute; */
  /* position:fixed;
  bottom:0; */
  height: 56px;
}
/* 解决IOS中tabbar随页面上移的问题 */
.weui-tabbar{
  position: fixed !important;
  bottom: 0;
  left: 0;
  top: auto !important;
}
.weui-tabbar__label {
  line-height: 0.3!important;
}
.classTypein {
  color: #5CC042;
}
.classDevice {
  color: #5CC042;
}
.classData {
  color: #5CC042;
}
.classMe {
  color: #5CC042;
}
a {
  text-decoration: none;
}
</style>
