<template>
  <div class="dataPage">
    <div>
      <group>
        <cell title="您的收益" :value="queRes"></cell>
      </group>
    </div>
    <divider>自定义查询</divider>
    <div class="datepicker">
      <group title="请选择开始日期">
        <datetime v-model="startDate" :end-date="currentDate" format="YYYY-MM-DD" @on-change="changeStart" title="开始时间"></datetime>
      </group>
      <group title="请选择结束日期">
        <datetime v-model="endDate" :end-date="currentDate" format="YYYY-MM-DD" @on-change="changeEnd" title="结束时间"></datetime>
      </group>
    </div>
    <div class="btn">
      <x-button plain type="primary" @click.native="confirm">确定</x-button>
    </div>
    <div v-transfer-dom>
      <x-dialog class="dia" v-model="dialogVisible" hide-on-blur :dialog-style="{'max-width': '100%', width: '80', height: '37%'}">
        <p style="font-size:20px; margin-top: 15px; margin-bottom: 10px;">收益明细</p>
        <div class="tab">
          <x-table :cell-bordered="false">
            <thead>
              <tr>
                <th>交易单号</th>
                <th>时间</th>
                <th>收益</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in tdlist" :key="item.name">
                <td>{{item.paymentNo}}</td>
                <td>{{item.paymentTime}}</td>
                <td>{{item.income}}</td>
              </tr>
            </tbody>
          </x-table>
        </div>
        <div id="pagination">
          <div>
            <span>共 {{total}} 条</span>
          </div>
          <div class="pagination1">
            <x-icon @click="reducePage" type="ios-arrow-back" size="20"></x-icon>
            {{param.currentPage}}
            <x-icon @click="addPage" type="ios-arrow-forward" size="20"></x-icon>
          </div>
          <div class="pagination1">
            <span>前往</span>
            <x-input v-model="page" @on-change="keyUp" text-align="center" :show-clear="false" style="width:20px;padding:0;font-size:14px;margin: 0 5px;"></x-input>
            <span>页</span>
          </div>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import { XButton, Datetime, Group, Divider, Cell, AlertModule, XDialog, XTable, XInput, TransferDomDirective as TransferDom } from 'vux'
import { back } from 'api'
export default {
  name: 'alarmset',
  directives: {
    TransferDom
  },
  components: { XButton, Datetime, Group, Divider, Cell, AlertModule, XDialog, XTable, XInput },
  data () {
    return {
      msg: '数据概况',
      param: {
        'userId': '',
        'Authorization': '',
        'auth': 0,
        'sn': '',
        'start': '2018-11-1 00:00:00',
        'end': '2018-11-8 00:00:00',
        'page': 1,
        'size': 10,
        'currentPage': 1,
        'pagesize': 8
      },
      tdlist: [
      // {
      //   paymentNo: 'dds4546q13456g543',
      //   paymentTime: '2018-11-1',
      //   income: 20
      // }, {
      //   paymentNo: 'dds4546q13456g543',
      //   paymentTime: '2018-11-1',
      //   income: 10
      // }, {
      //   paymentNo: 'dds4546q13456g543',
      //   paymentTime: '2018-11-1',
      //   income: 25
      // }, {
      //   paymentNo: 'dds4546q13456g543',
      //   paymentTime: '2018-11-1',
      //   income: 50
      // }, {
      //   paymentNo: 'dds4546q13456g543',
      //   paymentTime: '2018-11-1',
      //   income: 20
      // }, {
      //   paymentNo: 'dds4546q13456g543',
      //   paymentTime: '2018-11-1',
      //   income: 10
      // }, {
      //   paymentNo: 'dds4546q13456g543',
      //   paymentTime: '2018-11-1',
      //   income: 25
      // }, {
      //   paymentNo: 'dds4546q13456g543',
      //   paymentTime: '2018-11-1',
      //   income: 50
      // }
      ],
      total: 0,
      page: 1,
      dialogVisible: false,
      startDate: '2018-01-01',
      endDate: '2018-01-01',
      currentDate: '2018-11-11',
      queRes: ''
    }
  },
  created: function () {
    console.log('进入数据概况页面')
    this.$store.commit('setHeaderTitle', this.msg)
    this.param.userId = this.$store.state.userId
    this.param.Authorization = this.$store.state.Authorization
    this.param.auth = this.$store.state.userRole
    this.param.sn = this.$store.state.sn
    console.log(this.param)
    this.dealDate()
    this.backIncomeQue()
  },
  mounted: function () {
  },
  methods: {
    dealDate: function () {
      // 处理当前时间，转换为YYYY-MM-DD格式
      var myDate = new Date()
      console.log(myDate)
      var year = myDate.getFullYear()
      var month = myDate.getMonth() + 1
      var date = myDate.getDate()
      // 遵循datetime组件的日期格式要求
      if (month < 10) {
        month = '0' + month
      }
      if (date < 10) {
        date = '0' + date
      }
      this.currentDate = year + '-' + month + '-' + date
      console.log('currentDate')
      console.log(this.currentDate)
      this.param.start = this.startDate = this.currentDate
      this.param.end = this.endDate = this.currentDate
    },
    changeStart: function (value) {
      this.param.start = value
      console.log(value)
    },
    changeEnd: function (value) {
      this.param.end = value
      console.log(value)
    },
    // 根据条件查询按钮
    confirm: function () {
      console.log(this.param)
      if (this.param.start > this.param.end) {
        AlertModule.show({
          title: '提示',
          content: '请保证结束时间晚于开始时间！'
        })
        return
      }
      this.param.start = this.processingFormat(this.param.start)
      this.param.end = this.processingFormat(this.param.end)
      this.param.start = this.param.start + ' ' + '00:00:00'
      this.param.end = this.param.end + ' ' + '00:00:00'
      console.log(this.param.start)
      console.log(this.param.end)
      this.dialogVisible = true
      this.backIncomeFilterQue()
    },
    // 处理日期格式，datetime组件格式是YYYY-MM-DD，会出现2018-01-01的形式，但是传给后台的时候，需要2018-1-1的格式
    processingFormat: function (value) {
      let valuelist = value.split('-')
      for (let i = 1; i < valuelist.length; i++) {
        if (valuelist[i].indexOf('0') === 0) {
          valuelist[i] = valuelist[i].replace(/\b0/, '')
        }
      }
      value = valuelist[0] + '-' + valuelist[1] + '-' + valuelist[2]
      return value
    },
    reducePage: function () {
      console.log('上一页')
    },
    addPage: function () {
      console.log('下一页')
    },
    keyUp: function () {
      console.log('输入页码')
      console.log(this.page)
    },
    /*
    ** ***********API调用相关函数**************
    */
    // 获取用户收益
    backIncomeQue: function () {
      back.getBenficiaryTotal(this.param).then(function (response) {
        console.log('获取用户收益返回')
        console.log(response)
        if (response.errno === 0) {
          this.queRes = response.data.total
        } else {
          AlertModule.show({
            title: '提示',
            content: response.error
          })
        }
      }.bind(this))
    },
    // 获取用户一段时间内的收益
    backIncomeFilterQue: function () {
      back.getBenficiarySub(this.param).then(function (response) {
        console.log('获取一段时间收益')
        console.log(response)
        if (response.errno === 0) {
          this.tdlist = response.data.record
        } else {
          AlertModule.show({
            title: '提示',
            content: response.error
          })
        }
      }.bind(this))
    }
  }
}
</script>

<style scoped>
.dataPage {
  margin: 60px 0 0 0;
}
.datepicker >>> .weui-cells {
  font-size: 15px;
}
.datepicker >>> .weui-cell {
  padding: 0 15px;
}
.btn {
  width: 27%;
  margin: 0 auto;
  margin-top: 20px;
  height: 50%;
}
.btn >>> .weui-btn {
  font-size: 13px;
}
.tab {
  padding:10px;
  width:90%;
  height: 380px;
  overflow: auto;
  margin:0 auto;
  font-size:14px;
}
#pagination {
  display: -webkit-flex; /* Safari */
  display: flex;
  justify-content: space-around;
  font-size: 14px;
  margin: 10px 20px 20px 80px;
}
.pagination1 {
  display: -webkit-flex; /* Safari */
  display: flex;
  justify-content: space-between;
}
.pagination2 {
  display: -webkit-flex; /* Safari */
  display: flex;
  justify-content: space-between;
}
.vux-x-icon {
  fill: #2c3e50;
  margin: 0 5px;
}
.dia {
  z-index: 101;
}
</style>
