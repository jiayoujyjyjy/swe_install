<template>
  <div class="deviceSet">
    <group>
      <cell class="cellcss" title="设备信息查看" is-link :link="{path:'/mainCss/deviceInfo'}">
        <img slot="icon" width="20" style="display:block;margin-right:5px;" src="/static/star.png">
      </cell>
      <cell class="cellcss" title="设备通信测试" is-link :link="{path:'/mainCss/deviceTest'}" v-show="(userRole != 2)">
        <img slot="icon" width="20" style="display:block;margin-right:5px;" src="/static/test.png">
      </cell>
      <cell class="cellcss" title="功率区间" is-link :link="{path:'/mainCss/powerSet'}" v-show="(userRole != 2)">
        <img slot="icon" width="20" style="display:block;margin-right:5px;" src="/static/power.png">
      </cell>
      <cell class="cellcss" title="报警联系人" is-link :link="{path:'/mainCss/alarmSet'}" v-show="(userRole != 2)">
        <img slot="icon" width="20" style="display:block;margin-right:5px;" src="/static/alarmPerson.png">
      </cell>
      <cell class="cellcss" title="移交设备" is-link link="/mainCss/deviceTransfer" v-show="(userRole != 2)">
        <img slot="icon" width="20" style="display:block;margin-right:5px;" src="/static/transition.png">
      </cell>
      <cell class="cellcss" title="第三方受益人" is-link :link="{path:'/mainCss/otherBeneficiary'}" v-show="(userRole != 2)">
        <img slot="icon" width="20" style="display:block;margin-right:5px;" src="/static/otherPerson.png">
      </cell>
      <cell class="cellcss" title="解绑设备" @click.native="unbindDev" v-show="(userRole != 2)">
        <img slot="icon" width="20" style="display:block;margin-right:5px;" src="/static/bind.png">
      </cell>
    </group>
    <confirm v-model="show"
    title='操作提示'
    @on-cancel="onCancel"
    @on-confirm="onConfirm">
      <p style="text-align:center;">确定解绑该设备吗？</p>
    </confirm>
  </div>
</template>

<script>
import { Group, Cell, Confirm, AlertModule } from 'vux'
import { back } from 'api'
import Routers from '@/router'
export default {
  name: 'deviceSet',
  components: { Group, Cell, Confirm, AlertModule },
  data () {
    return {
      msg: '设备设置',
      show: false,
      param: {
        'sn': ''
      }
    }
  },
  computed: {
    userRole: function () {
      return this.$store.state.userRole
    }
  },
  created: function () {
    this.$store.commit('setHeaderTitle', this.msg)
    this.param.sn = this.$store.state.sn
  },
  methods: {
    unbindDev: function () {
      this.show = true
    },
    onCancel: function () {
      console.log('on cancel')
    },
    onConfirm: function () {
      console.log('on confirm')
      this.backStationDel()
    },
    /*
    *
    *   ******** API调用函数 ********
    *
    */
    // 解绑充电桩，删除用户与充电桩的关联
    backStationDel: function () {
      back.stationDel(this.param).then(function (response) {
        if (response.errno > 0) {
          return
        }
        AlertModule.show({
          title: '提示',
          content: '解绑成功',
          onHide () {
            Routers.push({ path: '/mainCss/deviceList' })
          }
        })
      })
    }
  }
}
</script>

<style scoped>
.deviceSet {
  padding-top: 46px;
}
.cellcss {
  height: 30px;
}
</style>
