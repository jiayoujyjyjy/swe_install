import axios from 'axios'
import * as url from './urlConfig'

// 对后台进行请求
export const back = {
  // 1.用户模块
  // 1.1 用户注册
  userRegister (param) {
    return axios({
      url: `${url.backbasurl}/operation/user/register`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        name: param.name,
        password: param.password,
        auth: param.auth,
        mobile: param.mobile,
        code: param.code,
        province: param.province,
        city: param.city
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 1.2 用户登录
  userLogin (param) {
    return axios({
      url: `${url.backbasurl}/operation/user/login`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        mobile: param.mobile,
        password: param.password
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 1.3 修改用户密码
  changePassword (param) {
    return axios({
      url: `${url.backbasurl}/operation/user/password`,
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId
      },
      data: {
        password: param.password,
        mobile: param.mobile,
        code: param.code
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 1.4 获取用户信息
  userInfo (param) {
    return axios({
      url: `${url.backbasurl}/operation/user`,
      method: 'get',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 1.5 获取用户的微信绑定信息
  userWxInfo (param) {
    return axios({
      url: `${url.backbasurl}/operation/wx/user`,
      method: 'get',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 1.6 解绑微信
  wxUnbind (param) {
    return axios({
      url: `${url.backbasurl}/operation/wx/user`,
      method: 'put',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 1.7 绑定微信
  wxBind (param) {
    return axios({
      url: `${url.backbasurl}/operation/wx/user/address`,
      method: 'get',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 2. 设备模块
  // 2.1 新增充电桩
  chargingPileAdd (param) {
    return axios({
      url: `${url.backbasurl}/operation/device`,
      method: 'post',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization,
        'Content-Type': 'application/json'
      },
      data: {
        name: param.name,
        sn: param.sn,
        password: param.password,
        label: param.label,
        address: param.address,
        lat: param.lat,
        lon: param.lon,
        ele: param.ele,
        type: param.type,
        province: param.province,
        city: param.city
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 2.2 绑定插座
  bindSocket (param) {
    return axios({
      url: `${url.backbasurl}/operation/device/bindSocket`,
      method: 'post',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization,
        'Content-Type': 'application/json'
      },
      data: {
        sn: param.sn,
        sockets: param.sockets
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 2.3 将充电桩修改为配置完成
  configFinsh (param) {
    return axios({
      url: `${url.backbasurl}/operation/device/bindState?sn=${param.sn}`,
      method: 'put',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 2.4 向充电桩发送命令
  socketOrder (param) {
    return axios({
      url: `${url.backbasurl}/operation/device/cmd`,
      method: 'post',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization,
        'Content-Type': 'application/json'
      },
      data: {
        sn: param.sn,
        id: param.id,
        on: param.on
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 2.5 修改充电桩计费规则
  changeRule (param) {
    return axios({
      url: `${url.backbasurl}/operation/device/range?sn=${param.sn}&isSend=${param.isSend}`,
      method: 'put',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization,
        'Content-Type': 'application/json'
      },
      data: {
        ranges: param.range
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 2.6 获取充电桩列表
  stationList (param) {
    return axios({
      url: `${url.backbasurl}/operation/device/list`,
      method: 'get',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 2.7 获取充电桩信息
  stationInfo (param) {
    return axios({
      url: `${url.backbasurl}/operation/device?sn=${param.sn}`,
      method: 'get',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 2.8 获取充电桩下的插座列表
  socketList (param) {
    return axios({
      url: `${url.backbasurl}/operation/device/socketList?sn=${param.sn}`,
      method: 'get',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 2.9 获取充电桩功率区间
  powerInterval (param) {
    return axios({
      url: `${url.backbasurl}/operation/device/range?sn=${param.sn}`,
      method: 'get',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 2.10 移交充电桩
  changeOwner (param) {
    return axios({
      url: `${url.backbasurl}/operation/device/share`,
      method: 'put',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization,
        'Content-Type': 'application/json'
      },
      data: {
        name: param.name,
        mobile: param.mobile,
        sn: param.sn
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 2.11 修改充电桩信息
  stationMod (param) {
    return axios({
      url: `${url.backbasurl}/operation/device`,
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        sn: param.sn,
        name: param.name,
        lat: param.lat,
        lon: param.lon,
        ele: param.ele,
        address: param.address,
        label: param.label
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 2.12 删除充电桩
  stationDel (param) {
    return axios({
      url: `${url.backbasurl}/operation/device?sn=${param.sn}`,
      method: 'delete',
      headers: {
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 2.13 获取充电桩状态
  stationState (param) {
    return axios({
      url: `${url.backbasurl}/operation/device/station?sn=${param.sn}`,
      method: 'get',
      headers: {
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 2.14 获取插座状态
  socketState (param) {
    return axios({
      url: `${url.backbasurl}/operation/device/socketState?sn=${param.sn}`,
      method: 'get',
      headers: {
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 2.15 修改用户信息
  userInfoMod (param) {
    return axios({
      url: `${url.backbasurl}/operation/user`,
      method: 'put',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization,
        'Content-Type': 'application/json'
      },
      data: {
        province: param.province,
        city: param.city
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 2.16 修改手机号
  userMobileMod (param) {
    return axios({
      url: `${url.backbasurl}/operation/user/mobile?newMobile=${param.mobile}&code=${param.code}`,
      method: 'put',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
        newMobile: param.mobile,
        code: param.code
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 3.工具模块
  // 3.1 刷新token
  refreshCode (param) {
    return axios({
      url: `${url.backbasurl}/operation/util/token`,
      method: 'get',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 3.2 发送短信验证码
  sendCode (param) {
    return axios({
      url: `${url.backbasurl}/operation/util/sms?mobile=${param.mobile}`,
      method: 'get',
      headers: {
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 3.3 JS-SDK加密接口
  jsSdkGet (param) {
    return axios({
      url: `${url.backbasurl}/operation/wx/sign/js?url=${param}`,
      method: 'get',
      headers: {
      },
      data: {
      },
      withCredentials: true
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 4.统计模块
  // 4.1 获取用户收益
  incomeQue (param) {
    return axios({
      url: `${url.backbasurl}/operation/wx/user/total?auth=${param.auth}`,
      method: 'get',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 4.2 获取一段时间收益
  incomeFilterQue (param) {
    return axios({
      url: `${url.backbasurl}/operation/wx/user/income?sn=${param.sn}&startTime=${param.startTime}&endTime=${param.endTime}`,
      method: 'get',
      headers: {
        // 'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 4.3 添加第三方受益人
  addBenficiary (param) {
    return axios({
      url: `${url.backbasurl}/operation/benefit`,
      method: 'post',
      headers: {
        // 'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
        sn: param.sn,
        name: param.name,
        mobile: param.mobile,
        percent: param.percent
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 4.4 删除第三方受益人
  delBenficiary (param) {
    return axios({
      url: `${url.backbasurl}/operation/benefit?id=${param.id}`,
      method: 'delete',
      headers: {
        // 'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
        id: param.id
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 4.5 修改第三方受益人
  changeBenficiary (param) {
    return axios({
      url: `${url.backbasurl}/operation/benefit`,
      method: 'put',
      headers: {
        // 'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
        id: param.id,
        sn: param.sn,
        name: param.name,
        mobile: param.mobile,
        percent: param.percent
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 4.6 获取充电桩下的受益人列表
  getBenficiaryList (param) {
    return axios({
      url: `${url.backbasurl}/operation/benefit/list?sn=${param.sn}`,
      method: 'get',
      headers: {
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 4.7 获取客户（受益人）总收益
  getBenficiaryTotal (param) {
    return axios({
      url: `${url.backbasurl}/operation/benefit/total`,
      method: 'get',
      headers: {
        userId: param.userId
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 4.8 分页获取客户（受益人）一段时间内的订单列表
  getBenficiarySub (param) {
    return axios({
      url: `${url.backbasurl}/operation/benefit/history?start=${param.start}&end=${param.end}&page=${param.page}&size=${param.size}`,
      method: 'get',
      headers: {
        userId: param.userId
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 5.报警模块
  // 5.1 添加报警联系人
  alarmContactAdd (param) {
    return axios({
      url: `${url.backbasurl}/operation/wx/warn`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': param.Authorization
      },
      data: {
        sn: param.sn,
        name: param.name,
        mobile: param.mobile
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 5.2 获取报警联系人列表
  alarmContactQue (param) {
    return axios({
      url: `${url.backbasurl}/operation/wx/warn/list?sn=${param.sn}`,
      method: 'get',
      headers: {
        'Authorization': param.Authorization
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 5.3 删除报警联系人
  alarmContactDel (param) {
    return axios({
      url: `${url.backbasurl}/operation/wx/warn?id=${param.id}`,
      method: 'delete',
      headers: {
        'Authorization': param.Authorization
      },
      data: {
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 5.4 修改报警联系人信息
  alarmContactMod (param) {
    return axios({
      url: `${url.backbasurl}/operation/wx/warn`,
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': param.Authorization
      },
      data: {
        id: param.id,
        name: param.name,
        mobile: param.mobile
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  }
}
