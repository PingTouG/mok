const key = 'MOK_DB'

const get = (payload) => {
  try {
    const history = uni.getStorageSync(key)

    return history ? history : []
  } catch (error) {
    uni.showToast({
      title: error.message,
      icon: 'none',
    })
  }
}

const set = (payload) => {
  try {
    uni.setStorageSync(key, payload)
  } catch (error) {
    uni.showToast({
      title: error.message,
      icon: 'none',
    })
  }
}

// 查询
export const select = (where = {}) => {
  const history = get()

  return history.filter((item) =>
    Object.keys(where).every((key) => item[key] === where[key])
  )
}

// 添加
export const add = (payload) => {
  const history = get()
  history.unshift(payload)
  set(history)
}

// 更新
export const update = (payload) => {
  let history = get()
  history = history.map((item) => (item.id === payload.id ? payload : item))
  set(history)
}

// 删除
export const remove = (id) => {
  let history = get()
  history = history.filter((item) => item.id !== id)
  set(history)
}
