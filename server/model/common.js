const crypto = require('crypto')

exports.defaultData = function (resultcode, results , total, msg) {
  this.resultcode = resultcode
  this.data = {
    "results": results
  }
  this.total = total
  this.msg = msg
}

exports.encodeMD5 = (string) => {
  var md5 = crypto.createHash('md5').update(string).digest('hex');
  return md5
}
