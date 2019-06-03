<template>
  <div class="myInfo">
    <!-- <group v-if="colorFlag === 0"> -->
    <div class="content">
      <group :class="colorFlag?classA:classB">
        <x-input title="姓名" disabled name="name" v-model="name">
          <img slot="label" style="padding-right:10px;display:block;" src="/static/meSelected.png" width="24" height="24">
        </x-input>
        <x-input title="手机" disabled name="phone" v-model="phone">
          <img slot="label" style="padding-right:10px;display:block;" src="/static/phoneGreen.png" width="24" height="24">
        </x-input>
        <!-- <x-input title="城市" disabled name="city" v-model="city">
          <img slot="label" style="padding-right:10px;display:block;" src="/static/city.png" width="24" height="24">
        </x-input> -->
        <x-address @on-shadow-change="onShadowChange" v-model="cityvalue" title="城市" :list="addressData" placeholder="请选择城市" hide-district>
          <template slot="title" slot-scope="props">
            <img slot="label" style="padding-right:4.5px;" src="/static/city.png" width="24" height="24">
            <span style="vertical-align: super;">城市</span>
          </template>
        </x-address>
    </group>
    </div>
    <div class="btn_wrap">
      <x-button plain type="primary" @click.native="submit">提交修改</x-button>
    </div>
  </div>
</template>

<script>
import { Group, Panel, XInput, Cell, XButton, XAddress, ChinaAddressV4Data, AlertModule } from 'vux'
import { back } from '@/api/index.js'
export default {
  name: 'myInfo',
  components: { Group, Panel, XInput, Cell, XButton, XAddress, ChinaAddressV4Data, AlertModule },
  data () {
    return {
      msg: '我的信息',
      param: {
        'userId': '',
        'Authorization': '',
        'province': '',
        'city': ''
      },
      cityvalue: [],
      addressData: ChinaAddressV4Data,
      colorFlag: 0,
      classA: 'classA',
      classB: 'classB',
      name: '姓名',
      phone: '电话',
      city: '城市'
    }
  },
  /*
  ** *************生命周期**************
  */
  created: function () {
    this.param.userId = this.$store.state.userId
    this.param.Authorization = this.$store.state.Authorization
    this.$store.commit('setHeaderTitle', this.msg)
    this.backUserInfo()
  },
  methods: {
    submit: function () {
      this.backUserInfoMod()
    },
    // 省市选择改变事件
    onShadowChange: function (ids, names) {
      console.log(ids, names)
      this.param.province = names[0]
      this.param.city = names[1]
    },
    /*
    ** ***********API调用相关函数**************
    */
    backUserInfo: function () {
      back.userInfo(this.param).then(function (response) {
        console.log(response)
        if (response.data !== undefined) {
          // this.colorFlag = 1
          this.name = response.data.name
          this.phone = response.data.mobile
          // this.city = response.data.city
          this.cityvalue = []
          this.cityvalue.push(response.data.province)
          this.cityvalue.push(response.data.city)
        }
      }.bind(this))
    },
    backUserInfoMod: function () {
      back.userInfoMod(this.param).then(function (response) {
        console.log(response)
        if (response.errno === 0) {
          AlertModule.show({
            title: '提示',
            content: '修改成功'
          })
          this.backUserInfo()
        }
      }.bind(this))
    }
  }
}
</script>

<style scoped>
.myInfo {
  /* padding-top: 46px; */
  width: 80%;
  margin:0 auto;
  margin-top: 17%;
  margin-bottom: 137px;
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
.content {
  position: relative;
  width: 100%;
  margin:0 auto;
  border-style: groove;
  margin-top: 30px;
  margin-bottom: 60px;
}
.weui-cell {
  height: 35px;
}
.content >>> .weui-cells {
  margin-top: 0px;
}
.classA >>> p {
  color: black;
}
.classB >>> p {
  color: gray;
}
/* 无效 也不要用disabled，可能是一个元素要想选择下一个非自定义的class则要用深度选择器
.classB p {
  color: red;
} */
</style>
