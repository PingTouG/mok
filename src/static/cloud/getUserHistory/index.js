const cloud = require('wx-server-sdk')
cloud.init()

exports.main = async (event, context) => {
    const db = cloud.database()
    const history = db.collection('history')

    const { OPENID } = cloud.getWXContext()
    const { data } = await history.where({
        "openid": OPENID
    }).get()

    // 若不存在此用户记录，则创建空记录
    if (data.length === 0) {
        history.add({
            data: {
                openid: OPENID,
                history: []
            }
        })
    }

    return {
        openid: OPENID,
        data: data,
    }
}