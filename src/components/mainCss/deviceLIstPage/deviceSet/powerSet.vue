<template>
  <div>
    <div class="powerSet">
      <div class="content">
          <group>
            <panel :list="list" :type="type" @on-click-item="showModule"></panel>

            <x-dialog v-model="showDialogStyle" hide-on-blur :dialog-style="{'max-width': '100%', width: '76%', height: '37%'}">
              <p style="font-size:23px; margin-top: 15px; margin-bottom: 10px;">单价设定</p>
              <div class="yyyy" style="width:73%; margin:auto;">
                <div>
                  <span style="font-size: 14px;float:left;">最小功率（w）</span>
                  <input type="number" id="inputMin" v-model="inputMinValue" placeholder="" style="padding: 5px 5px; font-size: 15px; width: 93%;">
                  <br>
                  <div style="">
                    <span style="float: left;font-size: 12px;color: #f56c6c; padding-right: 50px;">{{msgMin}}</span>
                  </div>
                </div>
                <div>
                  <span style="font-size: 14px;float:left">最大功率（w）</span>
                  <input type="number" id="inputMax" v-model="inputMaxValue" placeholder="" style="padding: 5px 5px; font-size: 15px; width: 93%;">
                  <br>
                  <div style="">
                    <span style="float: left;font-size: 12px;color: #f56c6c; padding-right: 50px;">{{msgMax}}</span>
                  </div>
                </div>
                <div>
                  <span style="font-size: 14px;float: left;">价格（元/小时）</span>
                  <input type="number" id="inputPrice" v-model="price" placeholder="" style="padding: 5px 5px; font-size: 15px; width: 93%;">
                  <br>
                  <div style="float: left;">
                    <span style="font-size: 12px;color: #f56c6c; padding-right: 50px;">{{msgPrice}}</span>
                  </div>
                </div>
                <div class="btn_wrap btn_confirm" style="margin-bottom: 20px;">
                  <x-button type="warn" mini @click.native="confirmDialog">确定</x-button>
                </div>
              </div>
            </x-dialog>
          </group>
      </div>
      <div class="butn">
        <x-button plain class="add" type="warn"  @click.native="add" style="float:left;left:23%">增加</x-button>
        <x-button plain class="add" type="warn"  @click.native="sub" style="margin-top:5px;float:left;left:25%">删除</x-button>
      </div>
      <div class="btn_wrap">
        <x-button type="warn" @click.native="confirmFinal">确定</x-button>
      </div>
    </div>
    <!-- <x-dialog v-model="showDialog" hide-on-blur :dialog-style="{'max-width': '100%', width: '50%', height: '15%'}">
      <div>
        <div style="padding: 20px 0 20px 0;border-bottom: 1px solid gray">我要导航
        </div>
        <div style="margin: 20px 0;" @click="showDialog=false">
          我要充电
        </div>
      </div>
    </x-dialog> -->
  </div>
</template>

<script>
import { AlertModule, Alert, Step, StepItem, XButton, Group, XInput, XHeader, XDialog, Panel } from 'vux'
import Routers from '@/router'
import { back } from 'api'
export default {
  name: 'powerSet',
  components: { AlertModule, Alert, Step, StepItem, XButton, XInput, Group, XHeader, XDialog, Panel },
  data () {
    return {
      msg: '功率区间设置',
      step: 2,
      type: '5',
      param: {
        'userId': '',
        'Authorization': '',
        'sn': '',
        'range': [],
        'isSend': '' // 如果只修改价格，不需要下发设备，isSend值为false，否则需要下发设备，isSend值为true
      },
      dataBeforeMod: [],
      dataAfterMod: [],
      formatJudgeFlag: 0, // 格式判断标志(最后面的'确定'按钮)
      inputMaxValue: '',
      inputMinValue: '',
      price: '',
      msgMin: '',
      msgMax: '',
      msgPrice: '',
      show: false,
      showDialogStyle: false,
      showDialog: false,
      list: [{
        title: '0w - 150w 0.35元/小时',
        // title: min + 'w' + ' - ' + max + 'w',
        min: 0,
        max: 150,
        id: 1,
        price: 0.35,
        desc: '点击编辑'
      }, {
        title: '150w - 200w 0.4元/小时',
        id: 2,
        min: 150,
        max: 200,
        price: 0.4,
        desc: '点击编辑'
      }],
      item: ''
    }
  },
  created: function () {
    console.log('user')
    this.$store.commit('setHeaderTitle', this.msg)
  },
  mounted: function () {
    this.param.userId = this.$store.state.userId
    this.param.Authorization = this.$store.state.Authorization
    this.param.sn = this.$store.state.sn
    this.backPowerInterval()
  },
  methods: {
    showModule: function (item) {
      console.log(item)
      this.item = item.id
      this.inputMinValue = this.list[item.id - 1].min
      this.inputMaxValue = this.list[item.id - 1].max
      this.price = this.list[item.id - 1].price
      this.showDialogStyle = true
    },
    // 对话框下的确认按键
    confirmDialog: function () {
      // 校验最小功率格式
      if (this.inputMinValue === '') {
        this.msgMin = '最小功率不能为空'
      } else if (this.inputMinValue < 0) {
        this.msgMin = '功率值不能小于0'
      } else if (parseFloat(this.inputMinValue) >= parseFloat(this.inputMaxValue)) {
        this.msgMin = '最小功率必须小于最大功率'
      } else {
        this.msgMin = ''
      }
      // 校验最大功率格式
      if (this.inputMaxValue === '') {
        this.msgMax = '最大功率不能为空'
      } else if (this.inputMaxValue <= 0) {
        this.msgMax = '功率值不能小于0'
      } else {
        this.msgMax = ''
      }
      // 校验价格格式
      if (this.price === '') {
        this.msgPrice = '价格不能为空'
      } else if (this.price < 0) {
        this.msgPrice = '价格不能小于0'
      } else {
        this.msgPrice = ''
      }
      // 格式均正确，则允许提交修改
      if (this.msgMin + this.msgMax + this.msgPrice === '') {
        this.submit()
        // 关闭对话框之前初始化对话框中输入数据
        this.inputMinValue = ''
        this.inputMaxValue = ''
        this.price = ''
        // 关闭对话框之前初始化对话框中错误提示数据
        this.msgMin = ''
        this.msgMax = ''
        this.msgPrice = ''
        this.showDialogStyle = false
      }
    },
    init: function (item) {
      let group = {}
      group.desc = '点击编辑'
      group.title = '功率单价'
      group.id = item
      this.$set(this.list, item - 1, group)
    //   this.list[item - 1] = group
    },
    submit: function () {
      console.log(this.item)
      let sets = this.list.slice(0)
      let groupinfo = {}
      groupinfo.min = this.inputMinValue
      groupinfo.max = this.inputMaxValue
      groupinfo.id = this.item
      groupinfo.price = this.price
      groupinfo.title = ' ' + this.inputMinValue + 'w- ' + this.inputMaxValue + 'w ' + this.price + '元/小时'
      // groupinfo.src = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1534589129230&di=194410cf5e37f1d34ce133fe369d5508&imgtype=0&src=http%3A%2F%2Fwww.xdowns.com%2Fattachment%2Fsyapp%2Flogo%2F201711101510277336.jpg'
      groupinfo.desc = '点击编辑'
      sets[this.item - 1] = groupinfo
      this.list = sets
      console.log(this.list)
      console.log('list')
      this.inputMinValue = ''
      this.inputMaxValue = ''
      this.price = ''
    },
    add: function () {
      console.log(this.list.length)
      this.list.length++
      this.init(this.list.length)
    },
    sub: function () {
      if (this.list.length < 2) {
        AlertModule.show({
          content: '已是最少列'
        })
      } else {
        this.list.length--
        this.list.splice(this.list.length)
        console.log(this.list)
      }
    },
    // 最终确定提交按键事件
    confirmFinal: function () {
      this.formatJudgeFlag = 0 // 初始化区间验证状态标志位
      for (var i = 0; i < this.list.length - 1; i++) {
        if (Number(this.list[i].max) > Number(this.list[i + 1].min)) {
          this.formatJudgeFlag = 1
          AlertModule.show({
            content: '请保证功率区间没有重叠！'
          })
        }
        if (Number(this.list[i].max) < Number(this.list[i + 1].min)) {
          this.formatJudgeFlag = 1
          AlertModule.show({
            content: '请保证功率区间没有遗漏！'
          })
        }
      }
      if (Number(this.list[0].min) !== 0) {
        this.formatJudgeFlag = 1
        AlertModule.show({
          content: '请保证功率初始值为0！'
        })
      }
      if (this.list[this.list.length - 1].title === '功率单价') {
        this.formatJudgeFlag = 1
        AlertModule.show({
          content: '请保证功率区间均被设定！'
        })
      }
      if (!this.formatJudgeFlag) {
        // 用户输入符合规范，接下来先进行数据类型转换再判断isSend的值
        // 数据类型转换，表单输入得到的值是字符串类型，后台需要的是数值型
        this.dataAfterMod = []
        for (let i = 0; i < this.list.length; i++) {
          let obj = {}
          obj.min = Number(this.list[i].min)
          obj.max = Number(this.list[i].max)
          obj.price = Number(this.list[i].price)
          this.dataAfterMod.push(obj)
        }
        console.log('output')
        console.log(this.list)
        console.log(this.dataAfterMod)
        // 判断isSend的值
        if (this.dataBeforeMod.length !== this.dataAfterMod.length) {
          console.log('长度变了')
          this.param.range = this.dataAfterMod
          this.param.isSend = true
          this.backChangeRule()
        } else {
          // 分别进行遍历
          let marker = 0
          for (let i = 0; i < this.dataBeforeMod.length; i++) {
            if (this.dataBeforeMod[i].min === this.dataAfterMod[i].min && this.dataBeforeMod[i].max === this.dataAfterMod[i].max && this.dataBeforeMod[i].price === this.dataAfterMod[i].price) {
              marker = marker + 1
            }
          }
          if (marker === this.dataBeforeMod.length) {
            console.log('数据没变')
            this.param.range = this.dataAfterMod
            this.param.isSend = false
            this.backChangeRule()
            return
          }
          for (let i = 0; i < this.dataBeforeMod.length; i++) {
            if (this.dataBeforeMod[i].min !== this.dataAfterMod[i].min || this.dataBeforeMod[i].max !== this.dataAfterMod[i].max) {
              console.log('功率区间变了')
              this.param.range = this.dataAfterMod
              this.param.isSend = true
              this.backChangeRule()
              return
            }
          }
          for (let i = 0; i < this.dataBeforeMod.length; i++) {
            if (this.dataBeforeMod[i].price !== this.dataAfterMod[i].price) {
              console.log('计费变了')
              this.param.range = this.dataAfterMod
              this.param.isSend = false
              this.backChangeRule()
              return
            }
          }
        }
      }
    },
    /*
    *
    *   ******** API调用函数 ********
    *
    */
    // 获取充电桩计费规则
    backPowerInterval: function () {
      back.powerInterval(this.param).then(function (response) {
        console.log(response)
        if (response.errno === 0) {
          // 存储用户修改前的功率区间，在用户提交修改时进行对比，确定isSend的值
          this.dataBeforeMod = response.data
          this.list = []
          for (let i = 0; i < response.data.length; i++) {
            let obj = {}
            obj.id = i + 1
            obj.min = response.data[i].min
            obj.max = response.data[i].max
            obj.price = response.data[i].price
            obj.desc = '点击编辑'
            obj.title = response.data[i].min + 'w - ' + response.data[i].max + 'w ' + response.data[i].price + '元/小时'
            this.list.push(obj)
          }
          console.log(this.list)
        }
      }.bind(this))
    },
    // 修改充电桩计费规则
    backChangeRule: function () {
      back.changeRule(this.param).then(function (response) {
        console.log(response)
        if (response.errno === 0) {
          AlertModule.show({
            title: '提示',
            content: '修改成功',
            onHide () {
              Routers.push('/mainCss/deviceSet')
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.section {
  margin-bottom: -4%;
}
.powerSet {
  width: 80%;
  margin:0 auto;
  margin-top: 17%;
  margin-bottom: 80px;
}
.content {
  position: relative;
  width: 100%;
  /* overflow: auto; */
  margin:0 auto;
  border: 1px solid #A4A5A4;
  margin-top: 30px;
  margin-bottom: 10px;
}
.btn_wrap {
  /* margin-top: 160px; */
  width: 40%;
  margin: 0 auto;
  /* margin-bottom: 60px; */
}
.btn_confirm {
  padding-top: 25px;
}
.ifstad {
  color: brown;
  font-size: 8px;
  left: 15%;
  position: absolute;
  margin-top: 2px;
}
.butn >>> .weui-btn {
  font-size: 13px;
}
.butn >>> .weui-btn_plain-warn {
  color: #5CC042;
  border: 1px solid #5CC042;
}
.btn_wrap >>> .weui-btn_warn {
  background-color: #5CC042;
}
.content >>> .weui-media-box_appmsg .weui-media-box__hd {
  width: 30px;
  height: 30px;
}
.content >>> .weui-media-box_text .weui-media-box__title {
  margin: 12px auto!important;
  float: left;
  font-size: 13px;
}
.content >>> .weui-media-box__desc {
  float: right;
}
.content >>> .weui-media-box {
  padding: 7px;
  padding-top: 0;
}
.dialog >>> .weui-dialog{
  color: black!important;
}
.add {
  width: 25%;
  float: left;
  margin: 5px
}
.add >>> .weui-btn {
  margin-top: 0;
}
.content >>> .weui-cells {
  margin-top: 0px;
}
.content >>> .weui-panel {
  margin-top: 0px;
}
</style>
