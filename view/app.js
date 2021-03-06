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
          url: that.globalData.baseUrl + '/index/auth/login',
          data: {
            code: res.code
          },
          success: function (res) {
            console.log(res)
;            if (res.data.resultcode === 0) {
  
              that.globalData.openid = res.data.data.results[0].openid
              that.getUserInfo(that.globalData.openid)

            } else {
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
  getUserInfo: function (openid) {
    var that = this
    this.wxrequest({
      url: that.globalData.baseUrl + '/index/auth/getUserMes',
      data: {
        openid: openid
      },
      success: res => {
        that.globalData.userInfo = res.data.data.results[0]
        if (that.getUserMesCallback) {
          that.getUserMesCallback(res.data.data.results)
        }
      }
    })
  },
  getUserMesCallback: function (res) {
    return res
  },
  wxrequest: function (params) {
    var that = this
    wx.request({
      url: params.url,
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: params.data,
      success: function (res) {
        if(res.data.resultcode == 0) {
          params.success(res)
        } else {
          that.login()
          that.loginReadyCallBack = res => {
            that.globalData.token = res
            // 多啦猫用户信息\
            if (params.retry) {
              params.retry()
            }
          }
        }
      }
    })
  },
  onShow: function(options) {
    console.log('----');
    console.log(options);
  },
  globalData: {
    userInfo: null,
    baseUrl: 'http://www.meat.com:8080',
    // baseUrl: 'https://api.wuacque.cn',
    // baseUrl: 'http://192.168.1.108:8088',
    openid: ''
  }
})