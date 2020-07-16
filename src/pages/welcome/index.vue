<template>
  <view class="welcome-page">
    <view class="welcome-page__header">
      <view class="welcome-page__title">MOK手记</view>
      <view class="welcome-page__description">记录，让生活更美好</view>
    </view>
    <button
      class="welcome-page__open-btn"
      open-type="getUserInfo"
      plain
      size="mini"
      @getuserinfo="handleGetUserInfo"
    >
      <u-icon name="fingerprint" color="#fff" size="128" />
      <view class="open-btn__text">开启记账</view>
    </button>

    <u-toast ref="uToast" />
  </view>
</template>

<script>
import { setUserInfo } from '@/api/user'
import { fetchUserHistories } from '@/api/history'

export default {
  methods: {
    handleGetUserInfo(response) {
      const {
        detail: { userInfo }
      } = response
      if (userInfo) {
        uni.showLoading()

        fetchUserHistories()
          .then(res => {
            const {
              result: { data }
            } = res
            const payload = {
              ...userInfo,
              history: data.length === 0 ? [] : data[0].history
            }

            setUserInfo(payload)

            uni.reLaunch({
              url: '/pages/home/index'
            })
          })
          .catch(err => {
            this.$refs.uToast.show({
              title: err.message,
              type: 'error',
              position: 'top'
            })
          })
          .finally(() => {
            uni.hideLoading()
          })
      } else {
        this.$refs.uToast.show({
          title: '此小程序需要授权才能使用',
          type: 'warning',
          position: 'top'
        })
      }
    }
  }
}
</script>

<style lang="scss">
.welcome-page {
  height: 100vh;
  box-sizing: border-box;
  background-color: $u-type-primary;
  padding-top: 240rpx;
  text-align: center;

  &__header {
    color: #fff;
    margin-bottom: 120rpx;
  }

  &__title {
    font-size: 80rpx;
    margin-bottom: 24rpx;
  }

  &__description {
    font-size: 28rpx;
  }

  &__open-btn {
    color: #fff !important;
    padding: 0 !important;
    border: none !important;
    transition: width 0.05s;

    &:active {
      transform: scale(0.95);
    }
  }

  .open-btn__text {
    font-size: 24rpx;
  }
}
</style>
