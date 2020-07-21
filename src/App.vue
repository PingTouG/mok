<script>
import { getUserInfo } from '@/api/user'

export default {
  onLaunch: function() {
    const userInfo = getUserInfo()

    if (userInfo) {
      uni.reLaunch({
        url: '/pages/home/index'
      })
    }
  }
}
</script>

<style lang="scss">
@import 'uview-ui/index.scss';
</style>
