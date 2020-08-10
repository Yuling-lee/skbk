const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    showIcon: true,
    isShowAuth: false,
    bgcolor: '',
    addrvalue: '',
    dwvalue: '',
    gwvalue: '',
    hdlx: '报名人数',
    addr: [],
    danwei: [],
    gangwei: [],
    img_url: 'https://sahd.offcn.com/cq/skbk/view.png',
    bmrs: []
  },

  onLoad: function (options) {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    if (!wx.getStorageSync('source') || wx.getStorageSync('source') == 'default') {
      if (options.scene) {
        wx.setStorageSync('source', options.scene);
      } else {
        wx.setStorageSync('source', 'default');
      }
    }

    //wx.showLoading({ title: '查询中' })
    var that = this;
    wx.request({
      url: 'https://zg99.offcn.com/index/chaxun/getlevel?actid=19127&callback=?',
      type: 'GET',
      dataType: 'jsonp',
      data: { level: '1', grfiled: '', grtext: ''},
      success: function (res) {
        var first_data = res.data.substring(1, res.data.length - 1)
        var res_data = JSON.parse(first_data);
        var now_arr = []
        if (res_data.status == "1") {
          for (var index in res_data.lists) {
            now_arr.push(res_data.lists[index].diqu)
          }
          that.setData({
            addr: now_arr,
            danwei: ['请选择单位'],
            gangwei: ['请选择岗位']
          });
        }else {
          console.log(res.msg);
        }
      }
    })
  },

  bindAreaPickerChange: function (e) {
    var that = this;
    that.setData({
      index: e.detail.value,
      addrvalue: that.data.addr[e.detail.value]
    })
    wx.request({
      url: 'https://zg99.offcn.com/index/chaxun/getlevel?actid=19127&callback=?',
      type: 'GET',
      dataType: 'jsonp',
      data: { level: '2', grfiled: 'diqu', grtext: this.data.addrvalue},
      success: function (res) {
        var two_data = res.data.substring(1, res.data.length - 1)
        var res_data = JSON.parse(two_data);
        var now_dw = ['请选择单位']
        if (res_data.status == "1") {
          for (var index in res_data.lists) {
            now_dw.push(res_data.lists[index].dw_name)
          }
          that.setData({
            danwei: now_dw,
            indexs:0,
            indexv: 0
          });
        } else {
          console.log(res.msg);
        }
      }
    });
  },

  bindDwPickerChange: function (e) {
    var that = this;
    that.setData({
      indexs: e.detail.value,
      dwvalue: that.data.danwei[e.detail.value]
    })
    wx.request({
      url: 'https://zg99.offcn.com/index/chaxun/getlevel?actid=19127&callback=?',
      type: 'GET',
      dataType: 'jsonp',
      data: { level: '3', grfiled: 'dw_name', grtext: this.data.dwvalue, onefiled: 'diqu', onetext: this.data.addrvalue},
      success: function (res) {
        var two_data = res.data.substring(1, res.data.length - 1)
        var res_data = JSON.parse(two_data);
        var now_gw = ['请选择岗位']
        if (res_data.status == "1") {
          for (var index in res_data.lists) {
            now_gw.push(res_data.lists[index].gw_name)
          }
          that.setData({
            indexv: 0,
            gangwei: now_gw
          });
        } else {
          console.log(res.msg);
        }
      }
    });
  },
  bindgwPickerChange: function (e) {
    var that = this;
    that.setData({
      indexv: e.detail.value,
      gwvalue: that.data.gangwei[e.detail.value]
    })
  },
  

  async seach_result() {
    if (!this.data.userInfo.isLoaded) {
      this.setData({
        isShowAuth: true,
        source: wx.getStorageSync('source')
      })
      return;
    }
    if (this.data.addrvalue == "") {
      wx.showToast({
        title: '选择地区或部门',
        icon: 'none'
      })
      return;
    }
    if (this.data.dwvalue == "") {
      wx.showToast({
        title: '选择单位',
        icon: 'none'
      })
      return;
    }
    if (this.data.gwvalue == "") {
      wx.showToast({
        title: '选择岗位',
        icon: 'none'
      })
      return;
    }
    wx.setStorageSync('diqu', this.data.addrvalue);
    wx.setStorageSync('dw_name', this.data.dwvalue);
    wx.setStorageSync('gw_name', this.data.gwvalue);
    wx.navigateTo({
      url: '/pages/bmresult/bmresult'
    })
  },

  user_login() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    app.fadeInOut(this, 'fadeAni', 0)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.fadeInOut(this, 'fadeAni', 0)
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })

    db.collection('diqu_bmrs').get({
      success: res => {
        this.setData({
          bmrs: res.data
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
      }
    })

    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var pic_url = 'https://sahd.offcn.com/cq/skbk/view.png?' + timestamp;
    this.setData({
      img_url: pic_url
    });
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
      title: "重庆公务员报名人数查询，点击查看！",
      path: "/pages/bmseach/bmseach?source=" + wx.getStorageSync('source'),
      success: function (res) {
        console.log(res, "转发成功")
      },
      fail: function (res) {
        console.log(res, "转发失败")
      }
    }
  },
  onPageScroll: function (t) {
    if (t.scrollTop >= app.globalData.titleBarHeight) {
      this.setData({ bgcolor: "#417cfc" })
      app.fadeInOut(this, 'fadeAni', 1)
    } else {
      this.setData({ bgcolor: "" })
      app.fadeInOut(this, 'fadeAni', 0)
    }
  }
})