<template>
  <div class="header">
    <x-header class="vux-demo-header-box" :left-options="{backText: ''}" slot="header" style="position: absolute;">{{msg}}</x-header>
    <router-view></router-view>
  </div>
</template>

<script>
import { XHeader, Group, XInput, XButton, Alert } from 'vux'
// import Routers from '@/router'
export default {
  name: 'login',
  components: { XHeader, Group, XInput, XButton, Alert },
  data () {
    return {
      // msg: '', // 和compouted计算属性重复了
      userName: null,
      password: null
    }
  },
  /*
  ** *************生命周期**************
  */
  // **********父组件接收store中子组件传递的state...
  computed: {
    msg () {
      return this.$store.state.headerTitle // **********html中{{}}通过msg函数直接返回一个值
    }
  },
  created: function () {
  }
}
</script>

<style>
.header {
  padding-top: 46px;
}
</style>
