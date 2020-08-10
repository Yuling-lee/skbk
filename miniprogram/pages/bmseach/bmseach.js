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
    hdlx: '报名人数',
    sourse: '',
    userInfo: '',
    coverTop: 0,
    total: [],
    endDate: '',
    isShow: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    this.getNum()
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
    wx.getSystemInfo({
      success: function (res) {
        if (!app.globalData) {
          app.globalData = {}
        }
        let totalTopHeight = 68
        if (res.model.indexOf('iPhone X') !== -1) {
          totalTopHeight = 98
        } else if (res.model.indexOf('iPhone 11') !== -1) {
          totalTopHeight = 98
        } else if (res.model.indexOf('iPhone') !== -1) {
          totalTopHeight = 68
        }
        that.setData({
          coverTop: totalTopHeight + 'px'
        });
      }
    })
  },
  getNum() {
    db.collection('gg_list').get({
      success: res => {
        this.setData({
          total: res.data[3].number,
          endDate: res.data[3].dataend,
          isShow: res.data[3].status
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
      }
    })
  },
  gobm: function (event) {
    const url = event.currentTarget.dataset.url
    wx.navigateTo({
      url: url
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
    this.getNum()
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