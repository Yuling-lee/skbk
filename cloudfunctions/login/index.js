const cloud = require('wx-server-sdk')
const WXBizDataCrypt = require('./WXBizDataCrypt')
const duration = 24 * 3600 * 1000 // 开发侧控制登录态有效时间
cloud.init({
  traceUser: true,
  env: 'cqzgjy-yy1bgwy-135tv'
})

// 云函数入口函数
exports.main = async (event) => {
  const {
    OPENID,
    APPID
  } = cloud.getWXContext()

  const db = cloud.database()
  const users = await db.collection('users1').where({
    _openid: OPENID
  }).get()

  if (!users.data.length) {
    return {
      message: 'user not found',
      code: 1
    }
  }

  // 进行数据解密
  const user = users.data[0]
  const wxBizDataCrypt = new WXBizDataCrypt(APPID, user.session_key)
  const data = wxBizDataCrypt.decryptData(event.encryptedData, event.iv)
  const expireTime = Date.now() + duration

  try {
    const result = await db.collection('users1').where({
      _openid: OPENID
    }).update({
      data: {
        expireTime,
        phoneNumber: data.phoneNumber,
        sourse: event.sourse,
        hdlx: event.hdlx
      }
    })

    if (!result.stats.updated) {
      return {
        message: 'update failure',
        code: 1
      }
    }
  } catch (e) {
    return {
      message: e.message,
      code: 1
    }
  }


  return {
    message: 'success',
    code: 0,
    data: {
      ...data
    },
  }
}
