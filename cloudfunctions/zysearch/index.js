// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  traceUser: true,
  env: 'cqzgjy-yy1bgwy-135tv'
})
const db = cloud.database()
const _ = db.command
const MAX_LIMIT=100

// 云函数入口函数
exports.main = async (event, context) => {
  let data_xueli = event.data_xueli
  let data_major = event.data_major
  let xueli_reg = eval("/" + data_xueli + "/")
  let major_reg = eval("/" + data_major + "/")
  let countResul=''
  countResult = await db.collection('zy_list').where({
    item02: major_reg,
    item03: xueli_reg,
  }).get()
  if(countResult){
    return countResult
  }else{
    return []
  }
  
}