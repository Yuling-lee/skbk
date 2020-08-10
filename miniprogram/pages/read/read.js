var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    readurl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync('userInfo').isLoaded) {
      this.setData({
        userInfo: wx.getStorageSync('userInfo'),
        readurl: options.readurl
      })
    } else {
      wx.showToast({
        title: '未登录！',
        icon:'none',
        duration:2500,
        complete:function(){
          wx.navigateBack({
            delta: 1,
            fail(e) {
              wx.switchTab({
                url: '/pages/index/index'
              })
            }
          })
        }
      })
    }
    if (!wx.getStorageSync('source') || wx.getStorageSync('source') == 'default') {
      if (options.scene) {
        wx.setStorageSync('source', options.scene);
      } else {
        wx.setStorageSync('source', 'default');
      }
    }
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
    this.setData({
      readurl: ''
    })
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
  onShareAppMessage: function (res) {
    var that = this;
    return {
      title: "你的专业能报考哪些重庆公务员考试岗位呢，一键查询！",
      path: "/pages/index/index?source=" + wx.getStorageSync('source'),
      success: function (res) {
        console.log(res, "转发成功")
      },
      fail: function (res) {
        console.log(res, "转发失败")
      }
    }
  }
})