<template>
  <div class="typein">
    <x-button plain type="primary" class="deviceEnter" link="/header/step1Info">设备录入</x-button>
  </div>
</template>

<script>
import { XButton } from 'vux'
export default {
  name: 'alarmset',
  components: { XButton },
  data () {
    return {
      msg: '设备录入'
    }
  },
  methods: {
    step: function () {
      this.$router.push('/header/step1Info')
    }
  },
  created: function () {
    this.$store.commit('setHeaderTitle', this.msg)
  }
}
</script>

<style scoped>
.typein {
  padding-top: 46px;
}
.deviceEnter {
  position: absolute;
  top: 40%;
  left: 30%;
  width: 40%;
}
</style>
