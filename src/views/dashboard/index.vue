<template>
  <div class="dashboard-container">
    <div class="dashboard-text">欢迎登录本系统: <span class="dashboard-special">{{ name }}</span>。</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
  &-special {
    color: darkred;
  }
}
</style>
