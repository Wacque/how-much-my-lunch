// pages/friends/friends.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    friends: null,
    coverShow: false,
    name: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onGotUserInfo: function (e) {
    // nickName: fields.nickName, avatar: fields.avatarUrl, gender: fields.gender
    var that = this
    app.wxrequest({
      url: app.globalData.baseUrl + '/setusermes',
      data: {
        openid: app.globalData.openid,
        avatar: e.detail.userInfo.avatarUrl,
        nickName: e.detail.userInfo.nickName,
        gender: e.detail.userInfo.gender
      },
      success: res => {
        // 先新增一个friend， 再将friend数据push到friends减少一次查询
        that.addFriend(e.detail.userInfo.nickName, e.detail.userInfo.avatarUrl)
      }
    })
  },

  // 将新增的朋友推到数组减少查询
  unshiftFriend: function(avatar, name) {
    var friends = this.data.friends
    if (!isNaN(parseInt(avatar))) {     // avata为数字
      var avatar = `../../assets/image/animal/a${avatar}.png`
    }
    
    friends.unshift({
      friendAvatar: avatar,
      friendName: name
    })

    this.setData({
      friends: friends
    })
  },
  addConfirm: function() {
    if(this.data.name !== '') {
      this.addFriend()
    }
  },
  // addFriend
  addFriend: function (myName, myAvatar) {
    var that = this
    var avatarArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    var name = '';
    var avatar = '';
    if (myName || myAvatar) {
      name = myName
      avatar = myAvatar
    }else {
      name = that.data.name
      avatar = avatarArr[Math.ceil(Math.random() * 19)]
    }
    app.wxrequest({
      url: app.globalData.baseUrl + '/addFriend',
      data: {
        openid: app.globalData.openid,
        name: name,
        avatar: avatar
      },
      success: res => {
        if (res.data.resultcode === 0) {
          that.setData({
            coverShow: false
          })
          // 将新增的朋友推到数组减少查询
          that.unshiftFriend(avatar, name)
        }
      }
    })
  },

  // queryfriend
  queryFriend: function() {
    var that = this
    app.wxrequest({
      url: app.globalData.baseUrl + '/queryFriend',
      data: {
        openid: app.globalData.openid
      },
      success: res => {
        var res = res.data.data.results
        for(let i = 0; i < res.length; i ++) {
          if (!isNaN(parseInt(res[i].friendAvatar))) {         // 判断avatar为数字
            res[i].friendAvatar = `../../assets/image/animal/a${res[i].friendAvatar}.png`
          } 
        }
        that.setData({
          friends: res
        })
      }
    })
  },

  onLoad: function (options) {
    var arr = []
    if(!app.globalData.userInfo) {
      app.getUserMesCallback = res => {
        
      }
    }else {
      
    }
    this.queryFriend()
  },

  showCover: function() {
    this.setData({
      coverShow: true,
      name: ''
    })
  },

  hideCover: function(e) {
    this.setData({
      coverShow: false,
      name: ''
    })
  },

  //勿删！！ 用于捕获点击事件阻止向父级的hideCover事件传递
  catchtapText() {
    console.log('catch')
  },

  friendInput: function(e) {
    this.setData({
      name: e.detail.value
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