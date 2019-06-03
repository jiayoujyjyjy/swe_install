<template>
  <div class="otherBeneficiary">
    <x-table :cell-bordered="false" style="padding:10px;">
      <thead>
        <tr>
          <th>姓名</th>
          <th>手机号</th>
          <th>百分比</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in tdlist" :key="item.name" @click="tdInfoMod(item)">
          <td>{{item.name}}</td>
          <td>{{item.mobile}}</td>
          <td>{{item.percent}}</td>
        </tr>
      </tbody>
    </x-table>
    <x-button type="primary" plain @click.native="tdAdd">新增受益人</x-button>
    <div>
      <x-dialog v-model="dialogVisible" hide-on-blur :dialog-style="{'max-width': '100%', width: '76%', height: '37%'}">
        <p style="font-size:20px; margin-top: 15px; margin-bottom: 10px;">{{dialogTitle}}</p>
        <group>
          <x-input title="姓名" placeholder="请输入姓名" v-model="dialogForm.name"></x-input>
          <x-input title="手机号" placeholder="请输入手机号" v-model="dialogForm.mobile"></x-input>
          <x-input title="百分比" placeholder="请输入百分比" v-model="dialogForm.percent"></x-input>
        </group>
        <div class="flexbox" v-if="isMod">
          <x-button type="primary" class="flexbtn" mini plain @click.native="tdMod">修改</x-button>
          <x-button type="warn" class="flexbtn" mini plain @click.native="tdDel">删除</x-button>
        </div>
        <div v-else>
          <x-button type="primary" class="flexbtn" mini plain @click.native="tdAddConfirm">确定</x-button>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import { back } from 'api'
import { Group, XTable, XButton, XDialog, XInput, AlertModule } from 'vux'
// import { truncate } from 'fs';
export default {
  name: 'otherBeneficiary',
  components: { Group, XTable, XButton, XDialog, XInput, AlertModule },
  data () {
    return {
      msg: '第三方受益人设置',
      param: {
        'userId': '',
        'Authorization': '',
        'sn': '',
        'id': '', // 第三方受益人id
        'name': '',
        'mobile': '',
        'percent': ''
      },
      tdlist: [{
        id: '',
        name: '物业',
        mobile: '32456676822',
        percent: '10%'
      }, {
        id: '',
        name: '小区',
        mobile: '32456676822',
        percent: '5%'
      }, {
        id: '',
        name: '其他',
        mobile: '32456676822',
        percent: '5%'
      }],
      dialogVisible: false,
      dialogTitle: '',
      dialogForm: {
        name: '',
        mobile: '',
        percent: '',
        id: ''
      },
      isMod: false
    }
  },
  created: function () {
    this.$store.commit('setHeaderTitle', this.msg)
    this.param.userId = this.$store.state.userId
    this.param.Authorization = this.$store.state.Authorization
    this.param.auth = this.$store.state.userRole
    this.param.sn = this.$store.state.sn
    this.param.name = this.$store.state.name
  },
  mounted: function () {
    this.param.sn = this.$store.state.sn
    this.backtdQue()
  },
  methods: {
    tdInfoMod: function (item) {
      console.log(item)
      this.dialogTitle = '修改受益人信息'
      this.dialogForm = {
        name: item.name,
        mobile: item.mobile,
        percent: item.percent,
        id: item.id
      }
      this.isMod = true
      this.dialogVisible = true
    },
    tdAdd: function () {
      console.log('新增受益人')
      this.dialogTitle = '新增受益人'
      // this.dialogForm = {}
      this.isMod = false
      this.dialogForm.name = ''
      this.dialogForm.mobile = ''
      this.dialogForm.percent = ''
      this.dialogVisible = true
    },
    tdAddConfirm: function () {
      console.log('确认新增')
      this.param.id = this.dialogForm.id
      this.param.name = this.dialogForm.name
      this.param.mobile = this.dialogForm.mobile
      this.param.percent = this.dialogForm.percent
      console.log(this.param)
      this.backtdAdd()
      this.dialogVisible = false
    },
    tdMod: function () {
      console.log('修改')
      this.param.id = this.dialogForm.id
      this.param.name = this.dialogForm.name
      this.param.mobile = this.dialogForm.mobile
      this.param.percent = this.dialogForm.percent
      console.log(this.param)
      this.backtdMod()
      this.dialogVisible = false
    },
    tdDel: function () {
      console.log('删除')
      this.param.id = this.dialogForm.id
      console.log(this.param)
      this.backtdDel()
      this.dialogVisible = false
    },
    /*
    *
    *   ******** API调用函数 ********
    *
    */
    // 获取受益人列表
    backtdQue: function () {
      back.getBenficiaryList(this.param).then(function (response) {
        console.log('获取充电桩下的受益人列表')
        console.log(response)
        if (response.errno === 0) {
          this.tdlist = response.data
        } else {
          AlertModule.show({
            title: '提示',
            content: response.error
          })
        }
      }.bind(this))
    },
    // 新增受益人
    backtdAdd: function () {
      var _this = this
      back.addBenficiary(this.param).then(function (response) {
        console.log('添加第三方受益人')
        console.log(response)
        if (response.errno > 0) {
          AlertModule.show({
            title: '提示',
            content: response.error
          })
        }
        _this.backtdQue()
      })
    },
    // 删除受益人
    backtdDel: function () {
      var _this = this
      back.delBenficiary(this.param).then(function (response) {
        console.log('删除第三方受益人')
        console.log(response)
        if (response.errno > 0) {
          AlertModule.show({
            title: '提示',
            content: response.error
          })
        }
        _this.backtdQue()
      })
    },
    // 修改受益人信息
    backtdMod: function () {
      var _this = this
      back.changeBenficiary(this.param).then(function (response) {
        console.log('修改第三方受益人')
        console.log(response)
        if (response.errno > 0) {
          AlertModule.show({
            title: '提示',
            content: response.error
          })
        }
        _this.backtdQue()
      })
    }
  }
}
</script>

<style scoped>
.otherBeneficiary {
  padding: 56px 10px 0;
  height: 100%;
  box-sizing: border-box;
}
button.weui-btn, input.weui-btn {
  margin-top:30px;
  width: 75%
}
.vux-x-dialog >>> .weui-cells {
  font-size: 16px;
}
.flexbox {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
}
.flexbtn {
  margin: 0 20px 20px;
}
</style>
