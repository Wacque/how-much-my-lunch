// pages/friends/friends.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    friends: [],
    coverShow: false,
    name: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onGotUserInfo: function (e) {
    // nickName: fields.nickName, avatar: fields.avatarUrl, gender: fields.gender
    app.wxrequest({
      url: app.globalData.baseUrl + '/setusermes',
      data: {
        openid: app.globalData.openid,
        avatar: e.detail.userInfo.avatarUrl,
        nickName: e.detail.userInfo.nickName,
        gender: e.detail.userInfo.gender
      },
      success: res => {
        console.log(res)
      }
    })
  },
  onLoad: function (options) {
    var arr = []
    if(!app.globalData.userInfo) {
      app.getUserMesCallback = res => {
        app.globalData.userInfo = res;
        arr.push(res);
        this.setData({
          userInfo: res,
          friends: arr
        })

        console.log(this.data.userInfo)
      }
    }else {
      arr.push(app.globalData.userInfo);
      this.setData({
        userInfo: app.globalData.userInfo,
        friends: arr
      })
      console.log(this.data.userInfo)
    }
    
  },

  showCover: function() {
    this.setData({
      coverShow: true
    })
  },

  friendInput: function(e) {
    this.setData({
      name: e.detail.value
    })
  },

  addFriend: function() {
    var avatarArr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
    var avatar = avatarArr[Math.ceil(Math.random() * 20)]
    var that = this
    console.log(avatar)
    app.wxrequest({
      url: app.globalData.baseUrl + '/addFriend',
      data: {
        openid: app.globalData.openid,
        name: that.data.name,
        avatar: avatar
      },
      success: res => {
        if(res.data.data.resultcode === 0) {
          var friends = that.data.friends
          that.setData({
            coverShow: false
          })

          console.log(res)
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})