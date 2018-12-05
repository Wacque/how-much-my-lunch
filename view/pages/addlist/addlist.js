// pages/addlist/addlist.js

const app = getApp()
const utils = require('../../utils/util.js')

const itemDefautObj = {         // 默认数据
  active: false, complete: false, value: '', realPay: ''
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sideShow: false,
    items: [],
    // [{ _id: 0, active: false, complete: false, friendName: '阿贵', friendAvatar: 11, peopleDisable: true, value: ''}],

    // active用于是否显示删除的状态
    // complate填写完成
    people: [] ,
    // [{ _id: 0, friendName: '阿贵', friendAvatar: 11, peopleDisable: true,  }, { _id: 1, friendName: '阿猫', friendAvatar: 3, peopleDisable: false}, { _id: 2, friendName: '阿狗', friendAvatar: 8, peopleDisable: false }, { _id: 3, friendName: '阿猪', friendAvatar: 5, peopleDisable: false }, { _id: 4, friendName: '阿牛', friendAvatar: 2, peopleDisable: false}],
    startX: 0,
    touchcurrent: 0,      // 当前操作的
    coverShow: false,
    payed: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryFriend()
  },

  // queryfriend
  queryFriend: function () {
    var that = this
    app.wxrequest({
      url: app.globalData.baseUrl + '/index/friend/queryFriend',
      data: {
        openid: app.globalData.openid
      },
      retry: function () {
        that.queryFriend();
      },
      success: res => {
        var res = res.data.data.results
        for (let i = 0; i < res.length; i++) {
          if(i === 0) {
            res[i].peopleDisable = true
          } else{
            res[i].peopleDisable = false
          }
          
          if (!isNaN(parseInt(res[i].friend_avatar))) {         // 判断friendAvatar为数字
            res[i].friend_avatar = `../../assets/image/animal/a${res[i].friend_avatar}.png`
          }
        }

        var items = []
        // 默认添加第一个
        var item = []
        items.push(Object.assign(itemDefautObj, res[0]))

        that.setData({
          people: res,
          items: items
        })
      }
    })
  },

  // 滑动
  handleToucheStart(e) {
    this.setData({
      startX: e.touches[0].clientX,       // 记录起点
      touchcurrent: e.currentTarget.dataset.index    // 记录下被操作的item
    })
  },
  handleToucheEnd(e) {
    // this.setData({
    //   startX: e.touches[0].clientX,       // 记录起点
    //   touchcurrent: e.currentTarget.dataset.index    // 记录下被操作的item
    // })
  },
  handleToucheMove(e) {
    // 当未完成计算且item长度大于1时，删除功能可用
    // console.log(this.data.items[this.data.touchcurrent].inputdisabled)
    if(!this.data.items[this.data.touchcurrent].inputdisabled && this.data.items.length > 1) {
      if (this.data.startX - e.touches[0].clientX > 50) {
        var data = this.data.items
        for (let i = 0; i < data.length; i++) {
          data[i].active = false
        }
        data[this.data.touchcurrent].active = true

      } else if (this.data.startX - e.touches[0].clientX < 50) {
        var data = this.data.items
        for (let i = 0; i < data.length; i++) {
          data[i].active = false
        }
      }

      this.setData({
        items: data
      })
    }
  },

  showSide(e) {
    var currentVal = this.data.items[e.currentTarget.dataset.index].value
    if (currentVal === '' || !/^[0-9]+$/g.test(currentVal)) {
      utils.showtip(this, '数字！', _ => {
      }, 800)

      let items = this.data.items
      items[e.currentTarget.dataset.index].value = ''
      this.setData({
        items: items
      })

      return
    }
    this.setData({
      sideShow: true
    })
  },

  hideSide() {
    if (this.data.sideShow) {       // 只有当侧边栏状态为true
      this.setData({
        sideShow: false
      })
    }
    
  },
  
  // 点击其他区域
  containerTab() {
    var data = this.data.items
    for (let i = 0; i < data.length; i++) {
      data[i].active = false
    }
    this.setData({
      items: data
    })
  },
  
  // 单个价格输入
  textInput(e) {
    let items = this.data.items
    items[e.currentTarget.dataset.index].value = e.detail.value
    this.setData({
      items: items
    })
  },

  textBlur(e) {
    var data = this.data.items
    // 不能为空且为数字
    if (e.detail.value === '' || !/^[0-9]+$/g.test(e.detail.value)) {
      utils.showtip(this, '数字！', _ => {
      }, 800)
      data[e.currentTarget.dataset.index].complete = false
    }else {
      data[e.currentTarget.dataset.index].complete = true
    }
    data[e.currentTarget.dataset.index].value = e.detail.value
   
    this.setData({
      items: data
    })
  },

  // 添加一个朋友
  addAFriend(e) {
    var items = this.data.items;
    var people = this.data.people;
    if (!people[e.currentTarget.dataset.index].peopleDisable) {      // 当人物peopleDisable为false
      var tempItem = Object.assign(itemDefautObj, people[e.currentTarget.dataset.index]);
      people[e.currentTarget.dataset.index].peopleDisable = true;     // 将任务置为不可用
      items.push(tempItem);
      this.setData({
        items: items,
        sideShow: false,
        people: people
      })
    }
  },

  // 删除
  delete(e) {
    var items = this.data.items;
    var people = this.data.people;
    var operIndex = e.currentTarget.dataset.index;

    for(let i = 0; i < people.length;i ++) {
      if (people[i]._id == items[operIndex]._id ) {
        people[i].peopleDisable = false;
      }
    }

    items.splice(operIndex, 1);

    this.setData({
      people: people,
      items: items
    })
  },

  // 调起对话框
  showCover() {     
    this.setData({
      coverShow: true,
      sideShow: false
    })
  },
  hideCover() {
    this.setData({
      coverShow: false,
      sideShow: true
    })
  },
  //勿删！！ 用于捕获点击事件阻止向父级的hideCover事件传递
  catchCoverInput() {

  },
  // 输入的总金额
  caculateInput(e) {
    this.setData({
      payed: e.detail.value
    })
  },
  // 计算
  caculate() {
    var payed = this.data.payed
    if (payed === '' || !/^[0-9]+$/g.test(payed)) {
      utils.showtip(this, '数字！', _ => {
      }, 800)

      this.setData({
        payed: ''
      })
      return
    }
    var data = this.data.items
    var sum = 0;
    if (data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        sum += Number(data[i].value) 
      }
    }

    for (var j = 0; j < data.length; j++) {
      data[j].realPay = (data[j].value / sum * payed).toFixed(2)
      data[j].inputdisabled = true
    }

    this.setData({
      items: data,
      coverShow: false
    })
    this.inserOrder(data)
  },
  inserOrder: function(data) {
    var detail = []
    for(let i = 0; i < data.length; i++) {
      var obj = {}
      obj.friend_id = data[i].id
      obj.price = data[i].realPay * 100
      obj.origin_price = data[i].value * 100
      detail.push(obj)
    }

    console.log(detail);
    app.wxrequest({
      url: app.globalData.baseUrl + '/index/order/addOrder',
      data: {
        openid: app.globalData.openid,
        detail: JSON.stringify(detail),
      },
      success: res => {
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