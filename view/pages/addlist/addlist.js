// pages/addlist/addlist.js
const itemDefautObj = {         // 默认数据
  active: false, complete: false, value: '', realPay: ''
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sideShow: false,
    items: [{ peopleid: 0, active: false, complete: false, name: '阿贵', avatar: 11, peopleDisable: true, value: ''}],

    // active用于是否显示删除的状态
    // complate填写完成
    people: [{ peopleid: 0, name: '阿贵', avatar: 11, peopleDisable: true,  }, { peopleid: 1, name: '阿猫', avatar: 3, peopleDisable: false}, { peopleid: 2, name: '阿狗', avatar: 8, peopleDisable: false }, { peopleid: 3, name: '阿猪', avatar: 5, peopleDisable: false }, { peopleid: 4, name: '阿牛', avatar: 2, peopleDisable: false}],
    startX: 0,
    touchcurrent: 0,      // 当前操作的
    coverShow: false,
    payed: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  // itemClick(e) {
  //   var data = this.data.items
  //   for(let i = 0; i < data.length; i ++) {
  //     data[i].active = false
  //   }
  //   this.setData({
  //     items: data
  //   })
  // },

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
  },
  showSide() {
    console.log('show')
    this.setData({
      sideShow: true
    })
  },
  hideSide() {
    if (this.data.sideShow) {       // 只有当侧边栏状态为true
      console.log('hide')
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

  textBlur(e) {
    var data = this.data.items
    console.log(e)
    if(e.detail.value === '') {
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
    console.log(e)
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
      if (people[i].peopleid == items[operIndex].peopleid ) {
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
  // 输入的总金额
  caculateInput(e) {
    this.setData({
      payed: e.detail.value
    })
  },
  // 计算
  caculate() {
    console.log(this.data.items)
    var payed = this.data.payed
    var data = this.data.items
    var sum = 0;
    if (data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        sum += Number(data[i].value) 
      }
    }

    for (var j = 0; j < data.length; j++) {
      data[j].realPay = (data[j].value / sum * payed).toFixed(2)
      // console.log(data[j].value + '=>' + (data[j].value / sum * payed).toFixed(2))
    }
    this.setData({
      items: data
    })
    console.log(data)
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