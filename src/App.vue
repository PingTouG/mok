<script>
import { getUserInfo } from '@/api/user'

export default {
  onLaunch: function() {
    wx.cloud.init({
      env: process.env.VUE_APP_CLOUD_ID,
      traceUser: true
    })
    const userInfo = getUserInfo()

    if (userInfo) {
      uni.reLaunch({
        url: '/pages/home/index'
      })
    }
  },
  onShow: function() {},
  onHide: function() {
    console.log('App Hide')
  }
}
</script>

<style lang="scss">
@import 'uview-ui/index.scss';
</style>
