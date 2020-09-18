//index.js
const app = getApp()
const db = wx.cloud.database()
let planUrl = ""
let planUrltype = 1
let ggtimer = null
Page({
  data: {
    title: '',
    isShowAuth: false,
    zb_list: [],
    nowindex: 0,
    hdlx: "首页",
    interval:4000,
    duration: 800,
    imgUrls: [],
    navlist:[]
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
  },
  onShow: function () {
    const that = this
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    db.collection('gg_list').get({
      success: res => {
        this.setData({
          zb_list: res.data[1].zb_list,
          imgUrls: res.data[5].bannerlist,
          navlist: res.data[6].navlist,
        })
        clearInterval(ggtimer)
        let num = this.data.gg_list.length;
        ggtimer = setInterval(function () {
          let random = Math.floor(Math.random() * num);
          that.setData({
            nowindex: random
          })
        }, 2500)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
      }
    })
    
  },
  onHide() {
    clearInterval(ggtimer)
  },
  gologin: function () {
    wx.showToast({
      icon: 'none',
      title: '还未登录，先登录吧！'
    })
    wx.switchTab({
      url: '/pages/my/my'
    })
  },

  go_zwk: function (event) {
    const url = event.currentTarget.dataset.url
    if (this.data.userInfo.isLoaded) {
      wx.navigateToMiniProgram({
        appId: 'wx63ad0fa9a5b1e3fb',
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
  go_notice: function (event) {
    const url = event.currentTarget.dataset.url
    wx.navigateTo({
      url: url
    })
  },
  gogg: function (event) {
    const url = event.currentTarget.dataset.url
    if (this.data.userInfo.isLoaded) {
      wx.navigateTo({
        url: url
      })
    } else {
      planUrl = event.currentTarget.dataset.url
      planUrltype = 1
      this.setData({
        isShowAuth: true,
        source: wx.getStorageSync('source')
      })
    }
  },
  goRead: function (event){
    const url = event.currentTarget.dataset.url
    wx.navigateTo({
      url: '/pages/read/read?readurl=' + url
    })
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
  go_noticex: function (event) {
    const url = event.currentTarget.dataset.url
    if (this.data.userInfo.isLoaded) {
      wx.navigateTo({
        url: url
      })
    } else {
      planUrl = event.currentTarget.dataset.url
      planUrltype = 1
      this.setData({
        isShowAuth: true,
        source: wx.getStorageSync('source')
      })
    }
  },
  user_login() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    if (planUrl != '') {
      if (planUrltype == 1) {
        wx.navigateTo({
          url: planUrl
        });
      } else {
        wx.navigateToMiniProgram({
          appId: 'wxca86930ec3e80717',
          path: planUrl,
          envVersion: 'release'
        })
      }
    }
  },
  onPageScroll: function (t) {
    if (t.scrollTop >= app.globalData.titleBarHeight) {
      this.setData({ bgcolor: "#e3251d", title: '首页' })
      app.fadeInOut(this, 'fadeAni', 1)
    } else {
      this.setData({ bgcolor: "", title: '' })
      app.fadeInOut(this, 'fadeAni', 0)
    }
  },
  onShareAppMessage: function (res) {
    var that = this;
    return {
      title: "2020重庆公务员考试考前白皮书，点击领取！",
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
