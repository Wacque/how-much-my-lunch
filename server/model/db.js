const config = require('../config/index')
// 数据库操作
const MongoClient = require("mongodb").MongoClient
const test = require("assert")
const url = config.dbUrl
const dbname = config.dbName

// 建立user索引
initDBIndex(config.c_user)

// 查找
exports.find = (_collection, data, callback, pagesize = 0, pageno = 0) => {
  __connectDB((err, client) => {
    var db = client.db(dbname)
    var collection = db.collection(_collection)
    collection.find(data).toArray((err, doc1) => {   // 返回数据长度
      test.equal(null, err)
      collection.find(data).limit(Number(pagesize)).skip(Number(pageno) * Number(pagesize)).toArray((err, doc) => {
        test.equal(null, err)
        callback(err, doc, doc1.length)
        client.close()
      })
    })
  })
}

// 新增
exports.insertOne = (_collection, data, callback) => {
  __connectDB( (err, client) => {
    var db = client.db(dbname)
    var collection = db.collection(_collection)
    collection.insertOne(data, (err, r) => {
      test.equal(null, err)
      callback(err, r)
      client.close()
    })
  })
}

exports.delete = (_collection, data, callback) => {
  __connectDB((err, client) => {
    var db = client.db(dbname)
    var collection = db.collection(_collection)
    collection.deleteMany(data, (err, r) => {
      test.equal(null, err)
      callback(err, r)
      client.close()
    })
  })
}

exports.updateMany = (_collection, data1, data2, callback) => {
  __connectDB((err, client) => {
    var db = client.db(dbname)
    var collection = db.collection(_collection)
    collection.updateMany(data1, data2, (err, r) => {
      test.equal(null, err)
      callback(err, r)
      client.close()
    })
  })
}

// 删除
function __connectDB(action) {
  MongoClient.connect(url, {useNewUrlParser : true}, (err,  client) => {
    test.equal(null, err)
    action(err, client)
  })
}

function initDBIndex(collectionName) {
  __connectDB((err, client) => {
    if(err) {
      throw err
    }else {
      var db = client.db(dbname)
      var collection = db.collection(collectionName)
      collection.createIndex({
        'username': 1}, null, (err, res) => {
        if(err) {
          throw err
        }else {
          console.log(collectionName + '索引建立成功')
        }
      })

    }
  })
}
