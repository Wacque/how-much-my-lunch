const config = require('../config/index')
// 数据库操作
const MongoClient = require("mongodb").MongoClient
const test = require("assert")
const url = config.dbUrl
const dbname = config.dbName
const errcode = require('../config/errcode')
const defaultData = require('./common').defaultData

// 建立user索引
initDBIndex(config.c_user, {'username': 1})
initDBIndex(config.c_order, {'openid': 1})

// 查找
exports.find = (res, sort , _collection, data, callback, pagesize = 0, pageno = 0) => {
  __connectDB((err, client) => {
    var db = client.db(dbname)
    var collection = db.collection(_collection)
    collection.find(data).toArray((err, doc1) => {   // 返回数据长度
      if(err) {
        res.json(res.json(new defaultData(errcode.CODE_DATABASE_ERR.code, [], 0, errcode.CODE_DATABASE_ERR.msg)))
        return
      }
      collection.find(data).limit(Number(pagesize)).skip(Number(pageno) * Number(pagesize)).sort(sort).toArray((err, doc) => {
        if(err) {
          res.json(res.json(new defaultData(errcode.CODE_DATABASE_ERR.code, [], 0, errcode.CODE_DATABASE_ERR.msg)))
        }
        callback(err, doc, doc1.length)
        client.close()
      })
    })
  })
}

// 新增
exports.insertOne = (res, _collection, data, callback) => {
  __connectDB( (err, client) => {
    var db = client.db(dbname)
    var collection = db.collection(_collection)
    collection.insertOne(data, (err, r) => {
      if(err) {
        res.json(res.json(new defaultData(errcode.CODE_DATABASE_ERR.code, [], 0, errcode.CODE_DATABASE_ERR.msg)))
        return
      }
      callback(err, r)
      client.close()
    })
  })
}

exports.delete = (res, _collection, data, callback) => {
  __connectDB((err, client) => {
    var db = client.db(dbname)
    var collection = db.collection(_collection)
    collection.deleteMany(data, (err, r) => {
      if(err) {
        res.json(res.json(new defaultData(errcode.CODE_DATABASE_ERR.code, [], 0, errcode.CODE_DATABASE_ERR.msg)))
        return
      }
      callback(err, r)
      client.close()
    })
  })
}

exports.updateMany = (res, _collection, data1, data2, callback) => {
  __connectDB((err, client) => {
    var db = client.db(dbname)
    var collection = db.collection(_collection)
    collection.updateMany(data1, data2, (err, r) => {
      if(err) {
        res.json(res.json(new defaultData(errcode.CODE_DATABASE_ERR.code, [], 0, errcode.CODE_DATABASE_ERR.msg)))
        return
      }
      callback(err, r)
      client.close()
    })
  })
}

function __connectDB(action) {
  MongoClient.connect(url, {useNewUrlParser : true}, (err,  client) => {
    test.equal(null, err)
    action(err, client)
  })
}

function initDBIndex(collectionName, indexKey) {
  __connectDB((err, client) => {
    if(err) {
      throw err
    }else {
      var db = client.db(dbname)
      var collection = db.collection(collectionName)
      collection.createIndex(indexKey, null, (err, res) => {
        if(err) {
          throw err
        }else {

        }
      })
    }
  })
}
