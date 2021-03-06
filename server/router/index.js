const db = require('../model/db')
const config = require('../config/index')
const errcode = require('../config/errcode')
const formidable = require('formidable')
const httpsRequest = require('../model/httpsRequest')
const defaultData = require('../model/common').defaultData
// const moment = require('moment')

// console.log(moment(new Date()))
// 登录
exports.login = (req, res, next) => {
  const form = new formidable.IncomingForm()
  form.parse(req, (err, fields, file) => {
    const JSCODE = fields.code
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${config.app_id}&secret=${config.session}&js_code=${JSCODE}&grant_type=authorization_code`
    httpsRequest.get({url}, (result) => {
      const httpRes = result
      db.find(res, {}, config.c_user, {openid : httpRes.openid}, (err, dbRes) => {
        // 如果存在该openid
        if(dbRes.length > 0) {
          db.updateMany(res, config.c_user, {openid : httpRes.openid}, {$set: {expires_in : httpRes.expires_in}}, (err, dbRes) => {
            res.json(new defaultData(errcode.CODE_SUCCESS.code, [{openid: httpRes.openid}], 0, errcode.CODE_SUCCESS.msg ))
          })
        }else {
          // 存openid和过期时间
          db.insertOne(res, config.c_user, {openid : httpRes.openid, expires_in : httpRes.expires_in}, (err, dbRes) => {
            res.json(new defaultData(errcode.CODE_SUCCESS.code, [{openid: httpRes.openid}], 0, errcode.CODE_SUCCESS.msg ))
          })
        }
      })
    })
  })
}

// 饭单查询
exports.order_query = (req, res, next) => {
  const form = new formidable.IncomingForm()
  form.parse(req, (err, fields, file) => {
    tokenQuery(res, fields.openid, _ => {
      db.find(res, {}, config.c_order, {openid: fields.openid}, (err, dbRes, count) => {
        dbRes.sort((a,b) => {
          return (new Date(b.time) - new Date(a.time) )
        })
        res.json(new defaultData(errcode.CODE_SUCCESS.code, dbRes, count, errcode.CODE_SUCCESS.msg ))
      }, fields.pagesize, fields.pageno)
    })
  })
}

// exports.orderQuery = (req, res, next) => {
//   console.log('res')
//   const form = new formidable.IncomingForm()
//   form.parse(req, (err, fields, file) => {
//     // tokenQuery(res, fields.openid, (err, res) => {
//     //   db.find(res, config.c_order, {openid: fields.openid}, (err,dbRes, count) => {
//     //     console.log('hahahha')
//     //     // dbRes.sort((a,b) => {
//     //     //   console.log(new Date(b.time) - new Date(a.time))
//     //     //   return (new Date(b.time) - new Date(a.time) )
//     //     // })
//     //     // res.json(new defaultData(errcode.CODE_SUCCESS.code, dbRes  , count, errcode.CODE_SUCCESS.msg))
//     //   },fields.pagesize ,fields.pageno )
//     // })
//   })
// }

// set用户信息
exports.setUserMes = (req, res, next) => {
  const form = new formidable.IncomingForm()
  form.parse(req, (err, fields, file) => {
    tokenQuery(res, fields.openid, _ => {
      db.updateMany(res, config.c_user, {openid: fields.openid}, {$set: {nickName: fields.nickName, avatar: fields.avatar, gender: fields.gender}}, (err, dbRes) => {
        res.json(new defaultData(errcode.CODE_SUCCESS.code, [], 0, errcode.CODE_SUCCESS.msg))
      })
    })
  })
}

// 用户信息查询
exports.getUserMes = (req, res, next) => {
  const form = new formidable.IncomingForm()
  form.parse(req, (err, fields, file) => {
    tokenQuery(res, fields.openid, _ => {
      let mes = {}
      if(mes.hasOwnProperty('avatar')) {
        mes.avatar = userMes[0].avatar
        mes.nickName = userMes[0].nickName
        res.json(new defaultData(errcode.CODE_SUCCESS.code, [mes], 1, errcode.CODE_SUCCESS.msg))
      }else {
        res.json(new defaultData(errcode.CODE_SUCCESS.code, [], 1, errcode.CODE_SUCCESS.msg))
      }

    })
  })
}

// addFriend
exports.addFriend = (req, res, next) => {
  const form = new formidable.IncomingForm()
  form.parse(req, (err, fields, file) => {
    tokenQuery(res, fields.openid, _ => {
      db.insertOne(res, config.c_friends, {referto: fields.openid, friendName: fields.name, friendAvatar: fields.avatar}, (err, dbRes) => {
        res.json(new defaultData(errcode.CODE_SUCCESS.code, [], 0, errcode.CODE_SUCCESS.msg))
      })
    })
  })
}

// queryFriend
exports.queryFriend = (req, res, next) => {
  const form = new formidable.IncomingForm()
  form.parse(req, (err, fields, file) => {
    tokenQuery(res, fields.openid, _ => {
      db.find(res, {}, config.c_friends, {referto: fields.openid}, (err, dbRes, count) => {
        res.json(new defaultData(errcode.CODE_SUCCESS.code, dbRes, count, errcode.CODE_SUCCESS.msg))
      }, 0, 0)
    })
  })
}

// insertOrder
exports.insertOrder = (req, res, next) => {
  const form = new formidable.IncomingForm()
  form.parse(req, (err, fields, file) => {
    tokenQuery(res, fields.openid, _ => {
      const tempTime = new Date()
      const formatTime =  tempTime.toLocaleString()
      const orderNo = `mo${tempTime.getTime()}`
      const detail = JSON.parse(fields.detail)

      db.insertOne(res, config.c_order, {openid: fields.openid, orderNo: orderNo, time: formatTime, detail: detail}, (err,dbRes) => {
        res.json(new defaultData(errcode.CODE_SUCCESS.code, [], 0, errcode.CODE_SUCCESS.msg ))
      })

    })
  })
}



// 查询用户是否合法
function tokenQuery(res, token, callback) {
  db.find(res,{}, config.c_user, {openid: token}, (err, dbRes) => {
    if(dbRes.length > 0) {
      callback(dbRes)
    }else {
      res.json(new defaultData(errcode.CODE_WRONG_TOKEN.code, [], 0, errcode.CODE_WRONG_TOKEN.msg))
    }
  }, 0, 0)
}
