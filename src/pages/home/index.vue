<template>
  <view class="home-page">
    <u-sticky>
      <view class="home-page__header">
        <view
          class="header__item header__time"
          :class="{'header__time--open':timeVisible}"
          @click="timeVisible = true"
        >
          <view class="header__item-title">{{year}}年</view>
          <view class="header__item-info">
            <text class="header__time-month">{{parseInt(month)}}</text>月
          </view>
        </view>
        <view class="header__money">
          <view class="header__item">
            <view class="header__item-title">收入</view>
            <view class="header__item-info">
              <u-count-to
                :end-val="incomeMoney"
                :color="numberStyle.color"
                :decimals="numberStyle.decimals"
                :autoplay="numberStyle.autoplay"
                :font-size="numberStyle.fontSize"
                :separator="numberStyle.separator"
              />
            </view>
          </view>
          <view class="header__item">
            <view class="header__item-title">结算</view>
            <view class="header__item-info header__item-result">
              <u-count-to
                :end-val="money"
                :color="numberStyle.color"
                :decimals="numberStyle.decimals"
                :autoplay="numberStyle.autoplay"
                :font-size="numberStyle.fontSize + 16"
                :separator="numberStyle.separator"
              />
            </view>
          </view>
          <view class="header__item">
            <view class="header__item-title">支出</view>
            <view class="header__item-info">
              <u-count-to
                :end-val="spendingMoney"
                :color="numberStyle.color"
                :decimals="numberStyle.decimals"
                :autoplay="numberStyle.autoplay"
                :font-size="numberStyle.fontSize"
                :separator="numberStyle.separator"
              />
            </view>
          </view>
        </view>
      </view>
    </u-sticky>
    <view class="home-page__history">
      <template v-if="historyList.length > 0">
        <u-card
          v-for="history in historyList"
          :key="history.time"
          :head-style="{backgroundColor:'#fafafa'}"
        >
          <view class="card__head" slot="head">
            <view class="card__head-time">{{history.time}}</view>
            <view class="card__head-money">
              <view class="head-money__item">
                <text class="head-money__item-tag">支</text>
                <u-count-to
                  :end-val="history.spendingMoney.toFixed(2)"
                  :font-size="numberStyle.fontSize"
                  :decimals="numberStyle.decimals"
                  :autoplay="numberStyle.autoplay"
                  :separator="numberStyle.separator"
                />
              </view>
              <view class="head-money__item">
                <text class="head-money__item-tag">收</text>
                <u-count-to
                  :end-val="history.incomeMoney.toFixed(2)"
                  :font-size="numberStyle.fontSize"
                  :decimals="numberStyle.decimals"
                  :autoplay="numberStyle.autoplay"
                  :separator="numberStyle.separator"
                />
              </view>
            </view>
          </view>
          <view class slot="body">
            <u-swipe-action
              :show="item.show"
              :index="item.id"
              v-for="item in history.history"
              :key="item.id"
              @click="handleSwipeClick"
              @open="handleSwipeOpen"
              :options="options"
            >
              <view class="history__item">
                <view class="history__item-icon">
                  <u-icon
                    name="rmb-circle-fill"
                    :color="item.type  === 'INCOME' ? '#ff9900' : '#2979ff'"
                    size="40"
                  />
                </view>
                <view class="history__item-note">{{item.note}}</view>
                <view
                  class="history__item-money"
                  style="color: #ff9900;"
                  v-if="item.type === 'INCOME'"
                >
                  <text class="history__item-prefix">+</text>
                  <text>{{item.money.toFixed(2)}}</text>
                </view>
                <view class="history__item-money" style="color: #2979ff;" v-else>
                  <text class="history__item-prefix">-</text>
                  <text>{{item.money.toFixed(2)}}</text>
                </view>
              </view>
            </u-swipe-action>
          </view>
        </u-card>
      </template>
      <view class="history__no-data" v-else>
        <u-empty text="无消费/收入记录" mode="coupon" />
      </view>
    </view>
    <view class="home-page__add">
      <u-icon
        class="home-page__add-icon"
        name="plus"
        color="#fff"
        size="64"
        @click="handleAddShow"
      />
    </view>
    <u-picker
      mode="time"
      v-model="timeVisible"
      :default-time="time"
      :params="params"
      @confirm="handleDateConfirm"
    />
    <!-- 添加弹窗 -->
    <u-popup v-model="addVisible" mode="bottom" border-radius="8" height="760rpx">
      <view class="add__container">
        <view class="add__tools">
          <text class="add__cancel" @click="handleAddCancel">取消</text>
          <text class="add__ok" @click="handleAddOk">完成</text>
        </view>
        <view class="add__header">
          <view class="add-header__type-time">
            <view>
              <u-button
                class="add-header__type-item"
                :type="addForm.type === 'SPENDING' ? 'primary' :'default'"
                shape="circle"
                size="mini"
                plain
                @click="handleAddTypeChange('SPENDING')"
              >支出</u-button>
              <u-button
                class="add-header__type-item"
                :type="addForm.type === 'INCOME' ? 'primary' :'default'"
                shape="circle"
                size="mini"
                plain
                @click="handleAddTypeChange('INCOME')"
              >收入</u-button>
            </view>
            <u-button shape="circle" size="mini" plain @click="handleAddDateShow">
              {{addDateShowString}}
              <u-icon name="arrow-down-fill" color="#c8c9cc" size="14" />
            </u-button>
          </view>
          <view class="add__money">￥ {{addForm.money}}</view>
          <view class="add__note">
            <text class="add__note-label">备注：</text>
            <u-input
              :custom-style="{width:'80vw'}"
              maxlength="20"
              :clearable="false"
              v-model="addForm.note"
              placeholder="请输入备注(最多输入20字)"
            />
          </view>
        </view>
        <u-grid :col="3">
          <u-grid-item
            v-for="keyboard in keyboards"
            :key="keyboard"
            :bg-color="keyboard | keyboardBg"
            :index="keyboard"
            @click="handleKeyboardClick"
          >
            <view>
              <text v-if="keyboard !== 'backspace'">{{keyboard}}</text>
              <u-icon name="backspace" size="30" v-else />
            </view>
          </u-grid-item>
        </u-grid>
      </view>
    </u-popup>
    <!-- 添加的日期 -->
    <u-calendar
      mode="date"
      v-model="addDateVisible"
      :default-time="addDate"
      @change="handleDateChange"
    />

    <!-- 删除二次确认 -->
    <u-modal
      v-model="removeAgainVisible"
      title="警告"
      content="此操作将删除此数据，是否继续？"
      show-cancel-button
      @confirm="handleRemove"
      @cancel="handleRemoveCancel"
    />
    <!-- 错误提示 -->
    <u-toast ref="uToast" />
  </view>
</template>

<script>
import { getUserInfo, setUserInfo } from '@/api/user'
import { select, add, remove, update } from '@/api/db'

const date = new Date()
const year = date.getFullYear()
const month = date.getMonth() + 1
const day = date.getDate()

const defaultAddForm = {
  type: 'SPENDING',
  year,
  month,
  day,
  money: '',
  note: ''
}

export default {
  filters: {
    time({ year, month, day }) {
      return `${year}-${month}-${day}`
    },
    keyboardBg(keyboard) {
      return typeof keyboard === 'string' ? '#f4f4f5' : '#fff'
    }
  },
  data() {
    return {
      timeVisible: false,
      addDateVisible: false,
      addVisible: false,
      removeAgainVisible: false,
      addLoading: false,
      year,
      month,
      params: {
        year: true,
        month: true
      },
      addParams: {
        year: true,
        month: true,
        day: true
      },
      history: [],
      historyList: [],
      timeList: [],
      addForm: { ...defaultAddForm },
      id: ''
    }
  },
  computed: {
    incomeMoney() {
      let money = 0

      this.history
        .filter(item => item.type === 'INCOME')
        .forEach(item => (money += item.money))

      return money
    },
    spendingMoney() {
      let money = 0

      this.history
        .filter(item => item.type === 'SPENDING')
        .forEach(item => (money += item.money))

      return money
    },
    money() {
      return this.incomeMoney - this.spendingMoney
    },
    time() {
      return `${this.year}-${this.month}`
    },
    addDate() {
      return `${this.addForm.year}-${this.addForm.month}-${this.addForm.day}`
    },
    addDateShowString() {
      return `${this.addForm.month}月${this.addForm.day}日 `
    },
    numberStyle() {
      return {
        color: '#fff',
        decimals: 2,
        autoplay: true,
        fontSize: 32,
        separator: ','
      }
    },
    options() {
      return [
        {
          text: '编辑',
          style: {
            backgroundColor: '#007aff'
          }
        },
        {
          text: '删除',
          style: {
            backgroundColor: '#fa3534'
          }
        }
      ]
    },
    keyboards() {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, 'backspace']
    }
  },
  watch: {
    history(history) {
      // 获取时间列表
      const timeList = new Set()
      history.forEach(item => {
        const { year, month, day } = item
        const time = `${year}${month}${day}`
        timeList.add(time)
      })
      const timeArray = Array.from(timeList).reverse()

      const dataSource = []
      history.forEach(item => {
        item['show'] = false

        const { year, month, day } = item
        const time = `${year}${month}${day}`

        // 查找当前日期所在位置
        const index = timeArray.findIndex(item => item === time)

        if (dataSource[index]) {
          dataSource[index]['history'].push(item)
          dataSource[index][
            item.type === 'INCOME' ? 'incomeMoney' : 'spendingMoney'
          ] += item.money
        } else {
          // 若不存在则新建
          dataSource[index] = {
            time: `${month
              .toString()
              .padStart(2, '0')}月${day.toString().padStart(2, '0')}日`,
            incomeMoney: item.type === 'INCOME' ? item.money : 0,
            spendingMoney: item.type === 'SPENDING' ? item.money : 0,
            history: [item]
          }
        }
      })

      this.historyList = [...dataSource]
    }
  },
  methods: {
    // 获取记录
    getHistory(payload) {
      this.history = select(payload)
    },
    // 日期选择确认事件
    handleDateConfirm({ year, month }) {
      this.year = parseInt(year)
      this.month = parseInt(month)

      this.getHistory({ year: this.year, month: this.month })
    },
    // 添加弹窗显示
    handleAddShow() {
      this.addVisible = true
    },
    // 点击数字键盘事件
    handleKeyboardClick(value) {
      let {
        addForm: { money }
      } = this

      switch (value) {
        case '.':
          if (money.length < 20 && !money.includes('.') && money.length > 0) {
            this.addForm.money += value
          }
          break
        case 'backspace':
          if (money.length) {
            this.addForm.money = money.substr(0, money.length - 1)
          }
          break
        default:
          if (money.length < 20) {
            this.addForm.money += value
          }
      }
    },
    // 滑块点击：删除按钮点击
    handleSwipeClick(id, index) {
      this.id = id
      // 0为编辑
      if (index === 0) {
        const target = this.history.find(item => item.id === id)
        if (target) {
          this.addForm = { ...target, money: target.money.toString() }
          this.addVisible = true
        }
      } else {
        this.removeAgainVisible = true
      }
    },
    // 删除显示
    handleSwipeOpen(id) {
      this.historyList = this.historyList.map(target => {
        target.history = target.history.map(item => {
          item['show'] = item.id === id

          return item
        })

        return target
      })
    },
    // 删除
    handleRemove() {
      if (this.id) {
        uni.showLoading()
        try {
          remove(this.id)
          this.getHistory({ year: this.year, month: this.month })
        } catch (error) {
          this.$refs.uToast.show({
            title: error.message,
            type: 'error',
            position: 'top'
          })
        } finally {
          uni.hideLoading()
        }
      }
    },
    // 删除取消
    handleRemoveCancel() {
      this.id = ''
    },
    // 添加取消事件
    handleAddCancel() {
      this.addForm = { ...defaultAddForm }
      this.addVisible = false
    },
    // 添加确定事件
    handleAddOk() {
      if (!this.addLoading && this.addValidator()) {
        this.addForm.money = parseFloat(this.addForm.money)
        const payload = { id: Date.now(), ...this.addForm }
        this.addLoading = true
        uni.showLoading()
        try {
          if (this.id) {
            payload['id'] = this.id
            update(payload)
          } else {
            add(payload)
          }

          this.getHistory({ year: this.year, month: this.month })
          this.addVisible = false
          this.addForm = { ...defaultAddForm }
          this.id = ''
        } catch (error) {
          this.$refs.uToast.show({
            title: error.message,
            type: 'error',
            position: 'top'
          })
        } finally {
          this.addLoading = false
          uni.hideLoading()
        }
      }
    },
    // 添加验证
    addValidator() {
      if (Number(this.addForm.money) === 0) {
        this.$refs.uToast.show({
          title: '请输入正确的金额',
          type: 'warning',
          position: 'top'
        })

        return false
      }

      return true
    },
    // 添加类型改变事件
    handleAddTypeChange(value) {
      this.addForm.type = value
    },
    // 添加的日期展示
    handleAddDateShow() {
      this.addDateVisible = true
    },
    // 添加的日期选择
    handleDateChange({ year, month, day }) {
      this.addForm.year = year
      this.addForm.month = month
      this.addForm.day = day
    }
  },
  // 页面显示
  onShow() {
    this.getHistory({ year: this.year, month: this.month })
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
.home-page {
  &__header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 24rpx 24rpx 48rpx 24rpx;
    background-color: $u-type-primary;
    border-bottom-left-radius: 24rpx;
    border-bottom-right-radius: 24rpx;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  }

  .header {
    &__time {
      border: 1px #fff dashed;
      border-radius: 16rpx;
      transition: all 0.5s;

      &--open {
        border-bottom-right-radius: 48rpx;
      }

      &-month {
        font-size: 48rpx;
        color: #fff;
        font-weight: 700;
        margin-right: 4rpx;
      }
    }

    &__money {
      display: flex;
      align-items: center;
      justify-content: space-around;
      flex: 1 0 auto;
    }

    &__item {
      padding: 24rpx;
      text-align: center;
      box-sizing: border-box;

      &-title {
        font-size: 24rpx;
        margin-bottom: 12rpx;
        color: #eee;
      }

      &-info {
        color: #fff;
        box-sizing: border-box;
      }
    }
  }

  &__add {
    position: fixed;
    bottom: 100rpx;
    right: 12rpx;
    z-index: 99;
    background-color: #2979ff;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    display: flex;
    align-items: center;
    justify-content: center;

    &-icon {
      margin: 0 4rpx 8rpx 4rpx;
    }
  }

  &__history {
    margin-top: 56rpx;
    padding: 0 12rpx;
  }

  .history {
    &__item {
      display: flex;
      justify-content: space-between;
      align-content: center;
      padding: 30rpx 0;
      border-bottom: 1px #f2f6fc solid;

      &-icon {
        margin-right: 16rpx;
      }

      &-note {
        flex: 1 0 auto;
      }

      &-prefix {
        margin-right: 8rpx;
      }

      &-money {
        font-weight: 700;
        flex: 0 0 auto;
        margin-right: 8rpx;
      }
    }

    &__no-data {
      height: 60vh;
    }
  }

  .add {
    &__container {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      position: absolute;
      width: 100%;
      bottom: 0;
    }

    &__header {
      width: 100%;
      padding: 0 24rpx 0 24rpx;
    }

    &__money {
      font-size: 48rpx;
      font-weight: 700;
      margin-bottom: 24rpx;
    }

    &-header {
      &__type-time {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24rpx;
      }

      &__type-item {
        margin-right: 12rpx;
      }
    }

    &__note {
      margin-bottom: 24rpx;
      display: flex;
      align-items: center;

      &-label {
        color: #606266;
      }
    }

    &__tools {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12rpx 24rpx;
      margin-bottom: 24rpx;
      border-bottom: 1px solid #f2f6fc;
      width: 100%;
    }

    &__cancel {
      padding: 12rpx 24rpx;
      color: #c0c4cc;
    }
    &__ok {
      padding: 12rpx 24rpx;
      color: #2979ff;
    }
  }

  .card__head {
    display: flex;
    justify-content: space-between;

    &-time {
      font-weight: 700;
    }

    &-money {
      display: flex;
    }

    .head-money__item {
      margin-left: 32rpx;

      &-tag {
        background-color: #f3f8f8;
        color: #909399;
        padding: 4rpx 8rpx;
        margin-right: 16rpx;
      }
    }
  }
}
</style>