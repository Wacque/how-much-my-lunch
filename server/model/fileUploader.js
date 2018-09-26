const multer  = require('multer');//用express的第三方中间件 multer 实现文件上传功能。


function upload(dest, filename) {
  var storage = multer.diskStorage({
    destination: function (req, file, cb){
      //文件上传成功后会放入public下的upload文件夹
      cb(null, dest)
    },
    filename: filename
  });
  var upload = multer({
    storage: storage
  });

  return upload
}

module.exports.upload = upload