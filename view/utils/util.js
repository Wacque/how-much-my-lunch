const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const tagSelector = (tagName, callBack) => {
  var query = wx.createSelectorQuery();
  //选择id
  var that = this;
  query.select(tagName).boundingClientRect( rect => {
    // console.log(rect.width)
    callBack(rect)
  }).exec();
}

const showtip = (_this, textcontent, callback, interval) => {
  if (_this.data.item) {
    if (_this.data.item.canshow === false) {
      return
    }
  }

  _this.setData({       // 先将show置为true
    item: {
      text: textcontent,
      show: true,
      classchange: false,
      canshow: false
    }
  })

  setTimeout(function () {         // 
    _this.setData({       // 先将classchange置为true
      item: {
        text: textcontent,
        show: true,
        classchange: true,
        canshow: false
      }
    })

    setTimeout(function () {  // 2s后消失
      _this.setData({
        item: {
          text: textcontent,
          show: true,
          classchange: false,
          canshow: false
        }
      })

      setTimeout(function () {
        _this.setData({
          item: {
            text: textcontent,
            show: false,
            classchange: false,
            canshow: true
          }
        })
        if (callback) {
          callback()
        }
      }, 500)
    }, interval ? interval : 2000)
  }, 200)
}

module.exports = {
  formatTime,
  tagSelector,
  showtip
}

