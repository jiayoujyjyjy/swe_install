<template>
  <div class="mstep">
    <div class="content">
      <group>
        <div class="dialog">
          <x-dialog v-model="showDialogStyle" hide-on-blur>
            <p style="font-size:22px;margin:30px 0 20px;">{{dialogTitle}}</p>
            <group style="width: 80%;margin:0 auto">
              <x-input title="姓名" v-model="dialogForm.name" placeholder="姓名">
                <img slot="label" style="padding-right:10px;display:block;" src="/static/stationName.png" width="24" height="24">
              </x-input>
              <x-input title="号码" type="number" v-model="dialogForm.phone" placeholder="号码">
                <img slot="label" style="padding-right:10px;display:block;" src="/static/phoneGreen.png" width="24" height="24">
              </x-input>
            </group>
            <div class="dia_btns">
              <x-button type="primary" class="dia_btn" plain @click.native="diaConfirm">{{diaconfirmBtn}}</x-button>
              <x-button type="primary" v-show="delbtnshow" class="dia_btn" plain @click.native="diaDel">删除</x-button>
              <x-button type="primary" class="dia_btn" plain @click.native="showDialogStyle = false">取消</x-button>
            </div>
          </x-dialog>
        </div>
        <div v-if="isnull">
          <p style="margin-left:10px;">暂无报警联系人</p>
        </div>
        <div v-else>
          <panel :list="list" :type="type" @on-click-item="showModule"></panel>
        </div>
      </group>
    </div>
    <x-button type="primary" class="btn_wrap" plain @click.native="addContact">新增</x-button>
    <toast v-model="showPositionValue" type="text" :time="1000" is-show-mask :text="textvalue" :position="position"></toast>
  </div>
</template>

<script>
import { AlertModule, Alert, Step, StepItem, XButton, Group, XInput, XHeader, XDialog, Panel, Toast } from 'vux'
import { back } from 'api'
import $ from 'jquery'
export default {
  name: 'alarmSet',
  components: { AlertModule, Alert, Step, StepItem, XButton, XInput, Group, XHeader, XDialog, Panel, Toast },
  data () {
    return {
      param: {
        'Authorization': '',
        'name': '',
        'sn': '',
        'mobile': '',
        'id': 3
      },
      isnull: false,
      position: 'default',
      showPositionValue: false,
      textvalue: '',
      dialogTitle: '编辑',
      diaconfirmBtn: '确定',
      delbtnshow: true,
      msg: '报警联系人设置',
      step: 2,
      type: '1',
      dialogForm: {
        name: '',
        phone: ''
      },
      showDialogStyle: false,
      list: [{
        src: '/static/phoneGreen.png',
        desc: '',
        title: '',
        id: 1
      }]
    }
  },
  created: function () {
    this.$store.commit('setHeaderTitle', this.msg)
    this.param.Authorization = this.$store.state.Authorization
    this.param.sn = this.$store.state.sn
  },
  mounted: function () {
    this.backAlarmContactQue()
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
    // 编辑联系人对话框
    showModule: function (item) {
      console.log(item)
      this.param.id = item.id
      this.dialogForm.name = item.title
      this.dialogForm.phone = item.desc
      this.dialogTitle = '编辑联系人'
      this.diaconfirmBtn = '确定'
      this.delbtnshow = true
      this.showDialogStyle = true
    },
    // 添加联系人对话框
    addContact: function () {
      this.dialogTitle = '新增联系人'
      this.diaconfirmBtn = '新增'
      this.delbtnshow = false
      this.showDialogStyle = true
    },
    // 对话框确认操作
    diaConfirm: function () {
      if ((this.dialogForm.name !== '') && (this.dialogForm.phone !== '')) {
        if (/^1\d{10}$/gi.test(this.dialogForm.phone)) {
          this.param.name = this.dialogForm.name
          this.param.mobile = this.dialogForm.phone
          if (this.dialogTitle === '新增联系人') {
            this.backAlarmContactAdd()
          } else {
            this.backAlarmContactMod()
          }
          this.showDialogStyle = false
          this.dialogForm = {
            name: '',
            phone: ''
          }
        } else {
          this.textvalue = '手机号格式不正确'
          this.showPositionValue = true
        }
      } else {
        this.textvalue = '请输入全部信息'
        this.showPositionValue = true
      }
    },
    // 对话框删除操作
    diaDel: function () {
      this.backAlarmContactDel()
      this.showDialogStyle = false
      this.dialogForm = {
        name: '',
        phone: ''
      }
    },
    /*
    *
    *   ******** API调用函数 ********
    *
    */
    // 添加报警联系人
    backAlarmContactAdd: function () {
      back.alarmContactAdd(this.param).then(function (response) {
        console.log(response)
        if (response.errno > 0) {
          console.log('error')
          return
        }
        this.textvalue = '添加成功！'
        this.showPositionValue = true
        this.backAlarmContactQue()
      }.bind(this))
    },
    // 获取报警联系人列表
    backAlarmContactQue: function () {
      back.alarmContactQue(this.param).then(function (response) {
        console.log('报警联系人列表')
        console.log(response)
        if (response.errno > 0) {
          console.log('error')
          return
        }
        if (response.data) {
          this.isnull = false
          this.list = []
          for (let i = 0; i < response.data.length; i++) {
            let obj = {}
            obj.id = response.data[i].id
            obj.title = response.data[i].name
            obj.desc = response.data[i].mobile
            obj.src = '/static/phoneGreen.png'
            this.list.push(obj)
          }
        } else {
          this.isnull = true
        }
        console.log('success')
      }.bind(this))
    },
    // 删除报警联系人
    backAlarmContactDel: function () {
      back.alarmContactDel(this.param).then(function (response) {
        console.log('删除')
        console.log(response)
        if (response.errno > 0) {
          this.textvalue = response.error
          this.showPositionValue = true
          return
        }
        this.textvalue = '删除成功'
        this.showPositionValue = true
        this.backAlarmContactQue()
      }.bind(this))
    },
    // 修改报警联系人信息
    backAlarmContactMod: function () {
      back.alarmContactMod(this.param).then(function (response) {
        console.log('编辑')
        console.log(response)
        if (response.errno > 0) {
          this.textvalue = response.error
          this.showPositionValue = true
          return
        }
        this.textvalue = '修改成功！'
        this.showPositionValue = true
        this.backAlarmContactQue()
      }.bind(this))
    }
  }
}
</script>

<style scoped>
.mstep {
  width: 80%;
  margin:0 auto;
  margin-top: 17%;
}
.content {
  position: relative;
  width: 100%;
  margin:0 auto;
  border: 1px solid #A4A5A4;
  margin-top: 30px;
  margin-bottom: 60px;
}
.dia_btns {
  width: 70%;
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  margin: 10px auto 20px;
}
.dia_btn {
  width: 30%;
  font-size: 15px;
}
.weui-btn + .weui-btn {
  margin-top: 0;
}
/* .btn_wrap >>> .weui-btn_primary {
  background-color: rgb(250, 64, 64);
} */
.content >>> .weui-media-box_appmsg .weui-media-box__hd {
  width: 25px;
  height: 25px;
  margin-top: 3%;
}
.content >>> .weui-media-box__title {
  margin: 5px auto;
  float: left;
  font-size: 15px;
}
.content >>> .weui-media-box__desc {
  float: right;
  margin-top: inherit;
  font-size: 15px;
}
.content >>> .weui-media-box {
  padding: 7px;
  padding-top: 0;
  height: 40px;
}
.content >>> .weui-media-box_appmsg .weui-media-box__bd {
  height: 25px;
  margin-top: 5px;
}
.content >>> .weui-cells {
  margin-top: 0px;
}
.content >>> .weui-panel {
  margin-top: 0px;
}
.butn {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
}
.add {
  font-size: 13px;
  width: 25%;
  margin: 5px
}
.btn_wrap {
  width: 50%;
  margin: 0 auto;
  margin-top: 20px;
}
</style>
