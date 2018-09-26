//index.js
//获取应用实例
const app = getApp()
const utils = require('../../utils/util.js')
const interValNum = 100
let scrollCount = 0
const scrollBottomLerp = 30

Page({
  data: {
    listData: null,
    itemHeight: 0,
    scrollerHeight: 0,
    scrollHeight: 0,
    plusbarShow: true,
    listCount: 0
  },
  onLoad: function () {
   
    this.firstLoad()
  },

  firstLoad() {
    wx.request({
      url: app.globalData.baseUrl + '/firstLoad',
      data: {
        pagesize: 0,
        pageno: 0
      },
      success: res => {
        var data = res.data.data.results
        for(let i = 0 ;i < data.length; i ++) {
          data[i].which = Math.ceil(Math.random() * 10) 
        }
        this.setData({
          listData: data
        })
        this.render()

        // 获取窗口高度
        utils.tagSelector('.scrollView', size => {
          this.setData({
            scrollerHeight: size.height
          })
        })
      }
    })
  },

  render(data) {
    var data = this.data.listData;
    var i = this.data.listCount;
    var interval = setInterval(_ => {
      if(i < data.length) {
        data[i].show = true
        this.setData({
          listData: data
        })
      }else {
        clearInterval(interval)
        this.setData({
          listCount: i
        })
        return
      }
      i++ 
    }, interValNum)
  },

  scroller (e) {
    if (e.detail.scrollTop > 0) {    // 防止ios回弹
      if (e.detail.deltaY > 0) {  // 向上滚动
        if (!this.data.plusbarShow) {
          this.setData({
            plusbarShow: true
          })
        }
      } else { // 向下滚动
        if (this.data.plusbarShow) {
          this.setData({
            plusbarShow: false
          })
        }
      }
    }
    
  },

  upper() {
    this.plusbarShow = true
  },

  lower() {
    utils.showtip(this, '底线！这是底线', _ => {
      console.log('finish')
    }, 500)
  },

  addlist () {
    wx.navigateTo({
      url: '../addlist/addlist',
    })
  }
})
