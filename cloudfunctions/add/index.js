// 云函数入口文件
const cloud = require('wx-server-sdk')
const db = cloud.database();
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  db.collection('userData').doc(event.openId).add({
    data: {
      nickName: event.nickName,
      tempText: event.tempText,
      liquidLevel: event.liquidLevel
    }
  })
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID
  }
}