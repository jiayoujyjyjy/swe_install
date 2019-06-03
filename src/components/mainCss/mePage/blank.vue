<template>
  <!-- 跳转到该页面后，立即跳转回wechatBind页面，因为在wechatBind页面执行跳转到wechatBind页面不会发生跳转，所以写一个中转页面 -->
  <div id="blank" >
  </div>
</template>

<script>
import Routers from '@/router'

export default {
  name: 'blankDiv',
  data () {
    return {
    }
  },
  mounted: function () {
    // var userId = this.$store.state.userId
    // var authorization = this.$store.state.Authorization
    Routers.push({ path: '/mainCss/wechatBind' })
  }
}
</script>

<style scoped>
</style>
