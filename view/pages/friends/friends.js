// pages/friends/friends.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onGotUserInfo: function (e) {
    console.log(e.detail.userInfo)
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