const app = getApp()
let fav_json = {}
Page({
  data: {
    showIcon: true,
    bgcolor: '',
    result: [],
    showId: -1,
    isShowAuth: false,
    hdlx: '报名人数',
    diqu:'',
    dw_name:'',
    gw_name: '',

  },
  onLoad: function (options) {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    });
    if (!this.data.userInfo.isLoaded) {
      this.setData({
        isShowAuth: true,
        source: wx.getStorageSync('source')
      });
      return;
    }
    if (!wx.getStorageSync('source') || wx.getStorageSync('source') == 'default') {
      if (options.scene) {
        wx.setStorageSync('source', options.scene);
      } else {
        wx.setStorageSync('source', 'default');
      }
    }
    this.setData({
      diqu: wx.getStorageSync('diqu'),
      isFirst: true
    })
    this.setData({
      dw_name: wx.getStorageSync('dw_name'),
      isFirst: true
    })
    this.setData({
      gw_name: wx.getStorageSync('gw_name'),
      isFirst: true
    })

    var that = this
    wx.request({
      url: 'https://zg99.offcn.com/index/chaxun/getlist?actid=19127&callback=?',
      type: 'GET',
      dataType: 'jsonp',
      data: { diqu: that.data.diqu, dw_name: that.data.dw_name, gw_name: that.data.gw_name, limits: '20' },
      success: function (res) {
        var two_data = res.data.substring(1, res.data.length - 1)
        var res_data = JSON.parse(two_data);
        if (res_data.status == "1") {
          that.setData({
            result: res_data.lists
          });
        } else {
          console.log(res.msg);
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
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
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

  go_search() {
    wx.navigateTo({
      url: '/pages/baoming/baoming'
    })
  },
  onPageScroll: function (t) {
    if (t.scrollTop >= app.globalData.titleBarHeight) {
      this.setData({ bgcolor: "#d32423" })
      app.fadeInOut(this, 'fadeAni', 1)
    } else {
      this.setData({ bgcolor: "" })
      app.fadeInOut(this, 'fadeAni', 0)
    }
  },
  user_login() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    if (this.data.result.length <= 0) {
      wx.navigateTo({
        url: '/pages/bmseach/bmseach',
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    return {
      title: "重庆公务员报名人数查询，点击查看！",
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