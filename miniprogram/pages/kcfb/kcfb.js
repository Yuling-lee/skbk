// pages/zyseach/zyseach.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,
    isShowAuth: false,
    bgcolor:'',
    diquList: [],
    diquvalue: '',
    schoollist: [],
    schoolvalue: '',
    inputactive:false,
    result:[],
    noresult:true,
    hdlx:'考场分布'
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
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
    var that = this;
    wx.request({
      url: 'https://zg99.offcn.com/index/chaxun/getlevel?actid=22866&callback=?',
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
            diquList: now_arr,
            schoollist: ['请选择学校'],
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
      diquvalue: that.data.diquList[e.detail.value]
    })
    wx.request({
      url: 'https://zg99.offcn.com/index/chaxun/getlevel?actid=22866&callback=?',
      type: 'GET',
      dataType: 'jsonp',
      data: { level: '2', grfiled: 'diqu', grtext: this.data.diquvalue},
      success: function (res) {
        var two_data = res.data.substring(1, res.data.length - 1)
        var res_data = JSON.parse(two_data);
        var now_dw = ['请选择学校']
        if (res_data.status == "1") {
          for (var index in res_data.lists) {
            now_dw.push(res_data.lists[index].school)
          }
          that.setData({
            schoollist: now_dw,
            indexs:0
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
      schoolvalue: that.data.schoollist[e.detail.value]
    })
  },
  
  async seach_result(){
    var that = this

    if (!this.data.userInfo.isLoaded) {
      this.setData({
        isShowAuth: true,
        source: wx.getStorageSync('source')
      })
      return;
    }
    if (this.data.diquvalue == "") {
      wx.showToast({
        title: '请选择地区',
        icon: 'none'
      })
      return;
    }
    if (this.data.schoolvalue == "") {
      wx.showToast({
        title: '请选择学校',
        icon: 'none'
      })
      return;
    }
    wx.showLoading({ title: '查询中' })
    wx.request({
      url: 'https://zg99.offcn.com/index/chaxun/getlist?actid=22866&callback=?',
      type: 'GET',
      dataType: 'jsonp',
      data: { diqu: that.data.diquvalue, school: that.data.schoolvalue, limits: '20' },
      success: function (res) {
        var three_data = res.data.substring(1, res.data.length - 1)
        var res_data = JSON.parse(three_data);
        if (res_data.status == "1") {
          wx.hideLoading()
          that.setData({
            result: res_data.lists
          });
        } else {
          wx.hideLoading()
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  preview_img:function(event){//图片预览函数
    let src = event.currentTarget.dataset.imgsrc;
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
    })
  },
  bindseaveimage:function(event){
    wx.showLoading({ title: '下载中' })
    wx.getImageInfo({
      src: event.currentTarget.dataset.src,//这里放你要下载图片的数组(多张) 或 字符串(一张) 下面代码不用改动
      success: function (ret) {
        var path = ret.path;
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success(result) {
            wx.hideLoading()
            wx.showToast({
              title: '下载图片成功',
              duration: 2000,
              mask: true,
            });
          },
          fail(result) {
            wx.showToast({
              title: '失败,你取消了' + JSON.stringify(result),
              duration: 2000,
              mask: true,
            });
            wx.openSetting({
              success: (res) => {
                console.log(res);
              }
            })
          }
        });
      }
    });
  },
  user_login() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
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
    var that = this;
    return {
      title: "不知道重庆省考的考场分布图，一键查询！",
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