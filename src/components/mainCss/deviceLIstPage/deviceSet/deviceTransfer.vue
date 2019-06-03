<template>
  <div class="Transfer">
    <div class="content">
      <group>
        <x-input title="" type="text" v-model="userName" placeholder="姓名" is-type="china-name">
          <img slot="label" style="padding-right:10px;display:block;" src="/static/meSelected.png" width="24" height="24">
        </x-input>
        <x-input title="" type="text" v-model="phone" placeholder="电话" is-type="china-mobile">
          <img slot="label" style="padding-right:10px;display:block;" src="/static/phoneGreen.png" width="24" height="24">
        </x-input>
      </group>
    </div>
    <x-button type="warn" @click.native="comfirm">确定</x-button>
    <alert v-model="alertShow" title="提示" :content="alertContent" @on-hide="onHide"></alert>
  </div>
</template>

<script>
import { back } from 'api'
import $ from 'jquery'
import { XHeader, Group, XInput, XButton, Alert } from 'vux'
import Routers from '@/router'
export default {
  name: 'login',
  components: { XHeader, Group, XInput, XButton, Alert },
  data () {
    return {
      param: {
        'userId': '',
        'Authorization': '',
        'sn': '',
        'name': '',
        'mobile': ''
      },
      msg: '设备移交',
      userName: null,
      phone: null,
      alertContent: '',
      alertShow: false
    }
  },
  /*
  ** *************生命周期**************
  */
  created: function () {
    this.$store.commit('setHeaderTitle', this.msg)
  },
  mounted: function () {
    this.param.userId = this.$store.state.userId
    this.param.Authorization = this.$store.state.Authorization
    this.param.sn = this.$store.state.sn
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
    comfirm: function () {
      console.log('确定')
      if (this.userName === '' || this.phone === '') {
        this.alertContent = '请输入全部信息'
        this.alertShow = true
        return
      }
      this.param.name = this.userName
      this.param.mobile = this.phone
      this.backChangeOwner()
    },
    onHide: function () {
      if (this.alertContent === '移交成功!') {
        Routers.push('/mainCss/deviceList')
      }
    },
    /*
    *
    *   ******** API调用函数 ********
    *
    */
    // 移交充电桩
    backChangeOwner: function () {
      back.changeOwner(this.param).then(function (response) {
        console.log('移交')
        console.log(response)
        if (response.errno > 0) {
          this.alertContent = response.error
          this.alertShow = true
          return
        }
        this.alertContent = '移交成功!'
        this.alertShow = true
      }.bind(this))
    }
  }
}
</script>

<style scoped>
.weui-cell {
  height: 35px;
}
.weui-btn_warn {
  background-color: #5CC042;
  margin-top: 80px;
  width: 30%;
  /* height: 50%;无效 */
}
.pOne {
  text-align:right;
  margin: 0px;
  padding-right: 15px;
  color: #0066FF;
}
.Transfer {
  margin-top: 60px;
}
.content {
  position: relative;
  width: 90%;
  margin:0 auto;
  border-style: groove;
  /* border-color: rgba(170, 170, 170, 0.801);
  border-radius: 4px;
  border-width: thin; */
  margin-top: 30px;
  margin-bottom: 60px;
  overflow: auto;
}
.content >>> .weui-cells {
  margin-top: 0px;
}
.content >>> .weui-panel {
  margin-top: 0px;
}
</style>
