// pages/my/my.js
const app = getApp()
Page({
  data: {
    showIcon:false,
    bgcolor:'',
    title:'',
    isShowAuth: false,
    isShowAuthAc: false,
    book_list: [],
    zw_list:[],
    tempUserInfo:{
      avatarUrl:'./../../images/no_login.png',
      nickName:'点击更换头像'
    },
    hdlx:'首页'
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
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (wx.getStorageSync('userInfo').isLoaded) {
      this.setData({
        userInfo: wx.getStorageSync('userInfo')
      })
      this.getUserInfo()
    }
    if (wx.getStorageSync('userTemp').isAuthorized){
      let nowUserInfo={}
      nowUserInfo.avatarUrl = wx.getStorageSync('userTemp').userInfo.avatarUrl
      nowUserInfo.nickName = wx.getStorageSync('userTemp').userInfo.nickName
      this.setData({
        tempUserInfo: nowUserInfo
      })
    }     
  },
  avatarlogin(){
    if (!this.data.userInfo.isLoaded) {
      this.setData({
        isShowAuth: true,
        source: wx.getStorageSync('source')
      })
    }
  },
  avatarAava(){
    if (!wx.getStorageSync('userTemp').isAuthorized){
      this.setData({
        isShowAuthAc: true
      })
    }
  },
  getUserInfo(){
    const db = wx.cloud.database()
    db.collection('zw_avor').where({
      phoneNumber: this.data.userInfo.phoneNumber
    }).get({
      success: res => {
        wx.hideLoading();
        if (res.data.length == 0) {
          this.setData({
            zw_list: []
          })
        } else {
          this.setData({
            zw_list: res.data[0].zw_list
          })
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
      }
    })
    db.collection('userdata').where({
      phoneNumber: this.data.userInfo.phoneNumber
    }).get({
      success: res => {
        wx.hideLoading();
        if (res.data.length == 0) {
          this.setData({
            book_list: []
          })
        } else {
          this.setData({
            book_list: res.data[0].book_list
          })
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
      }
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
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
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
  },
  onPageScroll: function (t) {
    if (t.scrollTop >= app.globalData.titleBarHeight) {
      this.setData({ bgcolor: "#d32423", title:'我的'})
      app.fadeInOut(this, 'fadeAni', 1)
    } else {
      this.setData({ bgcolor: "", title: '' })
      app.fadeInOut(this, 'fadeAni', 0)
    }
  },
  user_login() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    this.getUserInfo()
  },
  user_login_ac() {
    let nowUserInfo = {}
    nowUserInfo.avatarUrl = wx.getStorageSync('userTemp').userInfo.avatarUrl
    nowUserInfo.nickName = wx.getStorageSync('userTemp').userInfo.nickName
    this.setData({
      tempUserInfo: nowUserInfo
    })
  },
  addbook: function (event) {
    const readurl = event.currentTarget.dataset.readurl
    wx.navigateTo({
      url: '/pages/read/read?readurl=' + readurl
    });
  },
  tel: function () {
    wx.makePhoneCall({
      phoneNumber: '400-6300-999',
    })
  },
  go_mylib(){
    if (!this.data.userInfo.isLoaded) {
      this.setData({
        isShowAuth: true,
        source: wx.getStorageSync('source')
      })
      return;
    }
    if (this.data.book_list.length > 0) {
      wx.navigateTo({
        url: '/pages/library/library'
      });
    } else {
      wx.navigateTo({
        url: '/pages/means/means'
      });
    }
  },
  go_means(){
    wx.navigateTo({
      url: '/pages/means/means'
    });
  },
  go_myposi() {
    if (this.data.zw_list.length>0){
      wx.navigateTo({
        url: '/pages/myposition/myposition'
      });
    }else{
      wx.navigateTo({
        url: '/pages/zwseach/zwseach'
      });
    }
  }
})