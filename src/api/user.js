const key = 'MOK_USER-INFO'

// 存储用户信息
export const setUserInfo = (payload) => {
    if (payload) {
        uni.setStorage({
            key,
            data: payload
        })
    }
}

// 获取用户信息
export const getUserInfo = () => {
    try {
        return uni.getStorageSync(key)
    } catch (error) {
        uni.showToast({
            title: error.message,
            icon: 'none'
        })
    }
}

// 删除用户信息
export const removeUserInfo = () => {
    try {
        return uni.removeStorageSync(key)
    } catch (error) {
        uni.showToast({
            title: error.message,
            icon: 'none'
        })
    }
}

export default {
    setUserInfo,
    getUserInfo,
    removeUserInfo,
}