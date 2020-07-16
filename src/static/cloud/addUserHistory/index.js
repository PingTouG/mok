const cloud = require('wx-server-sdk')
cloud.init()

exports.main = async (event, context) => {
    const db = cloud.database()
    const history = db.collection('history')

    const { OPENID } = cloud.getWXContext()
    const { payload } = event

    const _ = db.command

    const { data } = await history.where({
        "openid": OPENID
    }).update({
        data: {
            history: _.push(payload)
        }
    })

    return {
        openid: OPENID,
        data: data,
    }
}