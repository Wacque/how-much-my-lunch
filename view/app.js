
//app.js
App({
  onLaunch: function () {
    this.login()
  },
  login: function () {
    // 登录
    var that = this
    wx.login({
      success: (res) => {
        that.wxrequest({
          retry: that.login,
          url: that.globalData.baseUrl + '/login',
          data: {
            code: res.code
          },
          success: function (res) {
            if (res.data.resultcode === 0) {
              that.globalData.openid = res.data.data.results[0].openid
              that.getUserInfo()

            }else {
              wx.showModal({
                title: '错误',
                data: res.msg
              })
            }
            if (that.loginReadyCallBack) {
              that.loginReadyCallBack(that.globalData.openid)
            }
          }
        })
      }
    })
  },
  loginReadyCallBack: function (res) {
    return res
  },
  getUserInfo: function() {
    var that = this
    this.wxrequest({
      url: that.globalData.baseUrl + '/getUserMes',
      data: {
        openid: that.globalData.openid
      },
      success: res => {
        that.globalData.userInfo = res.data.data.results
        if (that.getUserMesCallback) {
          that.getUserMesCallback(res.data.data.results)
        }
      }
    })
  },
  getUserMesCallback: function(res) {
    return res
  },
  wxrequest: function (params) {
    var that = this
    wx.request({
      url: params.url ,
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: params.data,
      success: function (res) {
        if ((res.data.errmsg && res.data.errmsg.indexOf('80013401') > -1) || (res.data.errmsg && res.data.errmsg.indexOf('80013402') > -1) || (res.data.errmsg && res.data.errmsg.indexOf('80000006') > -1)) {
          // if (res.data.errmsg.indexOf('80013401') > -1 || res.data.errmsg.indexOf('80000006') > -1) {
          that.login()
          that.loginReadyCallBack = res => {
            that.globalData.token = res
            // 多啦猫用户信息\
            if (params.retry) {
              params.retry()
            }
          }
          // }

        }else {
          // if(res.data.resultcode == 0) {
          params.success(res)
          // }

        }
      }
    })
  },
  globalData: {
    userInfo: null,
    // baseUrl: 'https://router.wuacque.cn',
    baseUrl: 'http://192.168.199.116:3002',
    openid: ''
  }
})