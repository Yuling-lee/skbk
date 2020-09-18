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
    hdlx: '成绩预约',
    sourse: '',
    userInfo: '',
    isyuyue:false
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
          sourse: 'wechat'
        })
      }
    }
    wx.request({
      url: 'https://zg99.offcn.com/index/biaodan/getphonestatus?actid=22933&callback=?',
      type: 'GET',
      dataType: 'jsonp',
      data: { phone: wx.getStorageSync('userInfo').phoneNumber},
      success: function (res) {
        var user_data = res.data.substring(1, res.data.length - 1)
        var res_data = JSON.parse(user_data);
        if (res_data.status == "1") {
          that.setData({
            isyuyue: true
          });
        }else {
          that.setData({
            isyuyue: false
          });
        }
      }
    })
  },
  async yuyue_result() {
    var that = this

    if (!this.data.userInfo.isLoaded) {
      this.setData({
        isShowAuth: true,
        source: wx.getStorageSync('source')
      })
      return;
    }
    wx.request({
      url: 'https://zg99.offcn.com/index/biaodan/register?actid=22933&callback=?',
      type: 'GET',
      dataType: 'jsonp',
      data: { phone: wx.getStorageSync('userInfo').phoneNumber,area: wx.getStorageSync('userInfo').sourse},
      success: function (res) {
        var yy_data = res.data.substring(1, res.data.length - 1)
        var res_data = JSON.parse(yy_data);
        if (res_data.status == "1") {
          wx.showToast({
            title: '预约成功！',
            icon: 'none'
          })
          that.setData({
            isyuyue: true
          })
        }else{
          wx.showToast({
            title: res_data.msg,
            icon: 'none'
          })
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
  onShareAppMessage: function (res) {
    var that = this;
    return {
      title: "重庆公务员考试笔试成绩查询，点击预约！",
      path: "/pages/firing/firing?source=" + wx.getStorageSync('source'),
      success: function (res) {
        console.log(res, "转发成功")
      },
      fail: function (res) {
        console.log(res, "转发失败")
      }
    }
  }
})