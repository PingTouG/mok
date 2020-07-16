const run = payload => wx.cloud.callFunction(payload)

// 查询
export const fetchUserHistories = () => run({ name: 'getUserHistory' })

// 添加
export const addUserHistory = (payload) => run({
    name: 'addUserHistory', data: {
        payload
    }
})