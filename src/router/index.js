import Vue from 'vue'
import VueRouter from 'vue-router'
import VueCookies from 'vue-cookies'
import { sessionGetStore, sessionSetStore } from '@/components/config/Utils'
// import ChildSlot from '@/components/childSlot'
import Header from '@/components/header'
import Login from '@/components/login'
import ForgetPassword from '@/components/forgetPassword'
import Register from '@/components/registered'
import MainCss from '@/components/mainCss'
import Typein from '@/components/mainCss/typein'
import Step1Info from '@/components/mainCss/typeinPage/step1Info.vue'
import Step2Scan from '@/components/mainCss/typeinPage/step2Scan.vue'
import Step3Test from '@/components/mainCss/typeinPage/step3Test.vue'
import DeviceList from '@/components/mainCss/deviceList'
import DeviceSet from '@/components/mainCss/deviceListPage/deviceSet'
import DeviceInfo from '@/components/mainCss/deviceListPage/deviceSet/deviceInfo'
import DeviceTest from '@/components/mainCss/deviceListPage/deviceSet/deviceTest'
import PowerSet from '@/components/mainCss/deviceListPage/deviceSet/powerSet'
import AlarmSet from '@/components/mainCss/deviceListPage/deviceSet/alarmSet'
import DeviceTransfer from '@/components/mainCss/deviceListPage/deviceSet/deviceTransfer'
import OtherBeneficiary from '@/components/mainCss/deviceListPage/deviceSet/otherBeneficiary'
import Data from '@/components/mainCss/data'
import Me from '@/components/mainCss/me'
import MyInfo from '@/components/mainCss/mePage/myInfo'
import ChangePassword from '@/components/mainCss/mePage/changePassword'
import ChangePhone from '@/components/mainCss/mePage/changePhone'
import WechatBind from '@/components/mainCss/mePage/wechatBind'
import Blank from '@/components/mainCss/mePage/blank'

import store from '../vuex/store'

Vue.use(VueRouter)
Vue.use(VueCookies)

const router = new VueRouter({
  routes: [
    // { path: '/childSlot', name: 'childSlot', component: ChildSlot }, // 测试slot用法的
    { path: '/', redirect: '/header' }, // 重定向
    { path: '/header',
      component: Header,
      children: [
        { path: '', redirect: 'login' },
        { path: 'login', name: 'login', component: Login },
        { path: 'register', name: 'register', component: Register },
        { path: 'forgetPassword', name: 'forgetPassword', component: ForgetPassword },
        { path: 'step1Info', name: 'step1Info', component: Step1Info },
        { path: 'step2Scan', name: 'step2Scan', component: Step2Scan },
        { path: 'step3Test', name: 'step3Test', component: Step3Test }
      ]
    },
    { path: '/mainCss',
      component: MainCss,
      children: [
        { path: '', redirect: 'me' }, // 默认跳转至me.vue组件，即一打开/mainCss，就相当于跳到/mainCss/me
        { path: 'me', name: 'me', component: Me },
        { path: 'data', name: 'data', component: Data },
        { path: 'myInfo', name: 'myInfo', component: MyInfo },
        { path: 'changePassword', name: 'changePassword', component: ChangePassword },
        { path: 'changePhone', name: 'changePhone', component: ChangePhone },
        { path: 'blank', name: 'blank', component: Blank },
        { path: 'wechatBind', name: 'wechatBind', component: WechatBind },
        { path: 'deviceList', name: 'deviceList', component: DeviceList },
        { path: 'deviceSet', name: 'deviceSet', component: DeviceSet },
        { path: 'deviceInfo', name: 'deviceInfo', component: DeviceInfo },
        { path: 'deviceTest', name: 'deviceTest', component: DeviceTest },
        { path: 'powerSet', name: 'powerSet', component: PowerSet },
        { path: 'alarmSet', name: 'alarmSet', component: AlarmSet },
        { path: 'deviceTransfer', name: 'deviceTransfer', component: DeviceTransfer },
        { path: 'otherBeneficiary', name: 'otherBeneficiary', component: OtherBeneficiary },
        { path: 'typein', name: 'typein', component: Typein }
      ]
    }
  ]
})
router.beforeEach((to, from, next) => {
  console.log(from.name)
  console.log(to.name)
  if (from.name === 'step3Test' && to.name === 'deviceList') {
    sessionSetStore('devicelist', 'y')
  }
  if (to.name === 'step1Info') {
    // 只有在step1Info页面重载窗口才会满足from.name=null，to.name=step1Info的情况
    if (from.name === null) {
      // 重载窗口不改变session中step1的值，避免陷入死循环
    } else {
      // 其他页面去往step1Info页面，iphone都需要刷新
      sessionSetStore('step1', 'y')
    }
  }
  if (to.name === 'step2Scan') {
    if (from.name === null) {
    } else {
      sessionSetStore('step2', 'y')
    }
  }
  if (to.name === 'step3Test') {
    if (from.name === null) {
    } else {
      sessionSetStore('step3', 'y')
    }
  }
  if (sessionGetStore('isFirst')) {
    // alert('不是第一次进页面')
    console.log('不是第一次进页面')
    VueCookies.set('page', to.name, 300)
    // next()
  } else {
    console.log('第一次进页面')
    // alert('第一次进页面')
    sessionSetStore('isFirst', 'n')
    // cookie存储不能设置'path'为名称，会命中系统关键字
    if (VueCookies.get('page')) {
      console.log('有cookie')
      if (to.name === VueCookies.get('page')) {
        console.log('一样')
        VueCookies.set('page', to.name, 300)
        // next()
      } else {
        // 重定向
        // alert('重定向')
        console.log('不一样')
        var nextpath
        var arr = ['login', 'register', 'forgetPassword', 'step1Info', 'step2Scan', 'step3Test']
        if (arr.indexOf(VueCookies.get('page')) > -1) {
          nextpath = '/header/' + VueCookies.get('page')
        } else {
          nextpath = '/mainCss/' + VueCookies.get('page')
        }
        sessionSetStore('redirect', 'y')
        // 1、page存入cookie的时间比userId等早，page的cookie存在userId等的cookie一定存在
        // 2、此处commit，安卓接下来没问题，但是iphone设置了到页面reload窗口，所以vuex数据回丢失，但是在step三个页面，都根据重定向的情况做了处理
        store.commit('setUserId', VueCookies.get('userId'))
        store.commit('setAuthorization', VueCookies.get('Authorization'))
        store.commit('setUserRole', VueCookies.get('userRole'))
        // 针对iphone的数据备份
        sessionSetStore('userId', VueCookies.get('userId'))
        sessionSetStore('Authorization', VueCookies.get('Authorization'))
        sessionSetStore('userRole', VueCookies.get('userRole'))
        console.log(nextpath)
        console.log(to.name)
        next({ path: nextpath })
      }
    } else {
      // alert('没有cookie')
      VueCookies.set('page', to.name, 300)
      // next()
    }
  }
  if (to.name === 'blank') {
    next()
  }
  // 微信绑定页面，当授权完成，服务器会返回地址，带有userId和authorization参数，形如
  // http://service.swehongshi.com/?time=1546677992989/#/mainCss/wechatBind?userId=userId参数值&Authorization=Authorization参数值
  // 带有时间戳，注意判断url的方式
  if (document.URL.indexOf('userId') > 0) {
    var valuelist = document.URL.split('&')
    var userId = valuelist[0].split('=')[2]
    var authorization = valuelist[1].split('=')[1]
    store.commit('setUserId', userId)
    store.commit('setAuthorization', authorization)
    // 这里要理解一下,避免进入死循环，next({ path: '/test' })的方法，中断当前的导航，然后进行一个新的导航，
    // 它将当前的to.path由当前值更改为指定的值test，然后重新执行钩子，而不是继续往下走，
    // 在我们这个情况中，程序在执行的时候，document.URL还没有发生改变，如果我们不采取任何措施，那么重新执行钩子的时候，会再次进入当前的if中，
    // 导致程序无限循环，所以在上面写了一句，如果to.name=blank，就直接进行下一个钩子，避免了无限循环
    next({ path: '/mainCss/blank' })
  }
  next()
})

export default router
