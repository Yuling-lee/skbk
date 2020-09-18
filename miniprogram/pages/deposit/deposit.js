const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowAuth: false,
    showIcon: true,
    bgcolor: '',
    hdlx: '定金膨胀',
    sourse: '',
    userInfo: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    if (!wx.getStorageSync('source') || wx.getStorageSync('source') == 'default') {
      if (options.scene) {
        wx.setStorageSync('source', options.scene);
        this.setData({
          sourse: options.scene
        })
      } else {
        wx.setStorageSync('source', 'default');
        this.setData({
          sourse: 'options.scene'
        })
      }
    }
  },
  gozb: function (event) {
    const url = event.currentTarget.dataset.url
    if (this.data.userInfo.isLoaded) {
      wx.navigateToMiniProgram({
        appId: 'wxca86930ec3e80717',
        path: url,
        envVersion: 'release'
      })
    } else {
      planUrl = event.currentTarget.dataset.url
      planUrltype = 2
      this.setData({
        isShowAuth: true,
        source: wx.getStorageSync('source')
      })
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
      title: "重庆公务员考试报名人数查询，点击查看！",
      path: "/pages/bmseach/bmseach?source=" + wx.getStorageSync('source'),
      success: function (res) {
        console.log(res, "转发成功")
      },
      fail: function (res) {
        console.log(res, "转发失败")
      }
    }
  }
})