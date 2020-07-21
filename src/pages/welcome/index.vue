<template>
  <view class="welcome-page">
    <view class="welcome-page__notice" v-if="noticeShow">
      <u-notice-bar
        mode="horizontal"
        :list="['Mok手记不收集任何数据，请勿随意删除以免造成数据丢失。']"
        :close-icon="true"
        @close="handleCloseNotice"
      />
    </view>
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

export default {
  data() {
    return {
      noticeShow: true
    }
  },
  methods: {
    handleGetUserInfo(response) {
      const {
        detail: { userInfo }
      } = response
      if (userInfo) {
        setUserInfo(userInfo)
        uni.reLaunch({
          url: '/pages/home/index'
        })
      } else {
        this.$refs.uToast.show({
          title: '此小程序需要授权才能使用',
          type: 'warning',
          position: 'top'
        })
      }
    },
    handleCloseNotice() {
      this.noticeShow = false
    }
  },
  onShareAppMessage() {
    return {
      path: '/pages/welcome/index',
      title: '记录，让生活更美好',
      imageUrl:
        'http://r.photo.store.qq.com/psc?/V12sBGmc0L7T7G/45NBuzDIW489QBoVep5mcSRsSKNLujlDSymoHHoIHUVBgsePoPxMB86a8a*.D*Ix*TWw1n87pJO6LGRw68MBuNnugL3XbtT1V2u5DSaw0uo!/r'
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

  &__notice {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
  }

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
