<template>
  <div class="deviceList">
    <div v-if="zero" style="text-align: center;">暂无充电桩</div>
    <div v-else class="content">
      <group>
        <cell class="cellcss" v-for="item in list" :key="item.sn" :title="item.title" :value="item.sn" @click.native="getSn(item.sn)" link="/mainCss/deviceSet"></cell>
      </group>
    </div>
  </div>
</template>

<script>
import { Group, Panel, Cell, Alert, AlertModule } from 'vux'
import { back } from 'api'
import { sessionGetStore, sessionSetStore } from '@/components/config/Utils'
export default {
  name: 'deviceList',
  components: { Group, Panel, Cell, Alert, AlertModule },
  data () {
    return {
      msg: '设备列表',
      type: '1',
      zero: false,
      param: {
        'userId': '',
        'Authorization': ''
      },
      list: [
        {
          sn: '',
          title: ''
        }
      ]
    }
  },
  created: function () {
    // 页面一加载后,存储msg到store.以用来mainCss调用computed修改headerTilte
    this.$store.commit('setHeaderTitle', this.msg)
  },
  mounted: function () {
    // 如果是iphone需要重载窗口，否则cookie中的page不更新
    // reload会导致vuex数据丢失，不是重定向reload时，没法从cookie中拿数据，需要再用session做一层备份
    var browserRule = /^.*((iPhone)|(iPad))+.*$/
    if (browserRule.test(navigator.userAgent)) {
      alert('是iphone')
      if (sessionGetStore('devicelist') === 'y') {
        sessionSetStore('devicelist', 'n')
        window.location.reload()
      } else {
        // reload之后的情况
        this.$store.commit('setUserId', sessionGetStore('userId'))
        this.$store.commit('setAuthorization', sessionGetStore('Authorization'))
        this.$store.commit('setUserRole', sessionGetStore('userRole'))
      }
    }
    this.param.userId = this.$store.state.userId
    this.param.Authorization = this.$store.state.Authorization
    this.backStationList()
  },
  methods: {
    getSn: function (sn) {
      console.log('sn')
      console.log(sn)
      this.$store.commit('setSn', sn)
    },
    /*
    *
    *   ******** API调用函数 ********
    *
    */
    // 获取充电桩列表
    backStationList: function () {
      back.stationList(this.param).then(function (response) {
        console.log(response)
        if (response.errno > 0) {
          AlertModule.show({
            title: '提示',
            content: response.error
          })
          return
        }
        if (response.data.length === 0) {
          this.zero = true
        }
        this.list = []
        for (let i = 0; i < response.data.length; i++) {
          let obj = {}
          obj.title = response.data[i].name
          obj.sn = response.data[i].sn
          this.list.push(obj)
        }
        console.log(this.list)
      }.bind(this))
    }
  }
}
</script>

<style scoped>
.deviceList {
  /* padding-top: 46px; */
  width: 100%;
  margin: 0 auto;
  margin-top: 17%;
}
.cellcss {
  height: 30px;
}
.cellcss >>> .weui-cell__ft {
  padding-right: 50px;
  position: relative;
}
</style>
