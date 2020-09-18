const app = getApp();
Component({
  properties: {
    //小程序页面的表头
    title: {
      type: String,
      default: '重庆省考百科'
    },
    wordcolor:{
      type: String,
      default: '#000'
    },
    bgcolor: {
      type: String,
      default: ''
    },
    //是否展示返回和主页按钮
    showIcon: {
      type: Boolean,
      default: true
    },
    //是否显示标题
    showTitle: {
      type: Boolean,
      default: true
    },
    //是否显示搜索框
    showSearch: {
      type: Boolean,
      default: true
    }
  },

  data: {
    statusBarHeight: 0,
    titleBarHeight: 0,
  },

  ready: function () {
    // 因为很多地方都需要用到，所有保存到全局对象中
    if (app.globalData && app.globalData.statusBarHeight && app.globalData.titleBarHeight) {
      this.setData({
        statusBarHeight: app.globalData.statusBarHeight,
        titleBarHeight: app.globalData.titleBarHeight
      });
    } else {
      let that = this
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
          }else if (res.model.indexOf('iPhone') !== -1) {
            totalTopHeight = 68
          }
          app.globalData.statusBarHeight = res.statusBarHeight
          app.globalData.titleBarHeight = totalTopHeight - res.statusBarHeight
          that.setData({
            statusBarHeight: app.globalData.statusBarHeight,
            titleBarHeight: app.globalData.titleBarHeight
          });
        },
        failure() {
          that.setData({
            statusBarHeight: 0,
            titleBarHeight: 0
          });
        }
      })
    }
  },

  methods: {
    headerBack() {
      wx.navigateBack({
        delta: 1,
        fail(e) {
          wx.switchTab({
            url: '/pages/index/index'
          })
        }
      })
    },
    headerHome() {
      wx.switchTab({
        url: '/pages/index/index'
      })
    },
    headerSearch() {
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
  }
})
