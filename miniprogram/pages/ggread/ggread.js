// pages/ggread/ggread.js
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
    hdlx:'公告详情',
    sourse:'',
    userInfo:'',
    readurl:'',
    coverTop:0,
    img_url: 'https://sahd.offcn.com/cq/skbk/cqgg_pic.jpg'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    this.getUrl()
    if (!wx.getStorageSync('source') || wx.getStorageSync('source') == 'default') {
      if (options.scene) {
        wx.setStorageSync('source', options.scene);
        this.setData({
          sourse: options.scene
        })
      } else {
        wx.setStorageSync('source', 'default');
        this.setData({
          sourse:'options.scene'
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
        }else if (res.model.indexOf('iPhone') !== -1) {
          totalTopHeight = 68
        }
        that.setData({
          coverTop:totalTopHeight+'px'
        });
      }
    })
  },
  getUrl(){
    db.collection('gg_list').where({
       'groupid':'ggurl_0512'
    }).get({
      success: res => {
         this.setData({
          readurl:res.data[0].readurl
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
  async bindGetPhoneNumber(e) {
    const that=this
    wx.showLoading({
      title: '正在获取',
    })
    if (e.detail.errMsg == 'getPhoneNumber:ok') {      
        try {
          const result = await wx.cloud.callFunction({
            name: 'login',
            data: {
              encryptedData: e.detail.encryptedData,
              iv: e.detail.iv,
              sourse: this.data.sourse,
              hdlx:this.data.hdlx
            }
          })
          if (result.result.code == 0) {
            this.setData({
              isShow: false
            })
            result.result.data.isLoaded = true
            that.setUserInfo(result.result.data)
          }
          wx.hideLoading({
            complete: (res) => {
              wx.showToast({
                title: '登录成功',
                icon: 'none',
                complete:function(){
                    wx.navigateTo({
                      url: '/pages/read/read?readurl=' + that.data.readurl
                    })
                }
              })
            }
          })
        } catch (err) {
          wx.hideLoading({
            complete: (res) => {
              wx.showToast({
                title: '获取手机号码失败，请重试',
                icon: 'none'
              })
            }
          })
        }
    } else {
      wx.hideLoading({
        complete: (res) => {
          wx.showToast({
            title: '获取手机号码失败，请重试',
            icon: 'none'
          })
        }
      })
    }
  },
  goRead(){
    wx.navigateTo({
      url: '/pages/read/read?readurl=' + this.data.readurl
    })
  },
  // 设置用户数据
  setUserInfo(userInfo = {}, cb = () => { }) {
    wx.setStorageSync('userInfo', userInfo);
    this.setData({
      userInfo:userInfo
    })
  },
  close_auth(){
    this.setData({
      isShow: false
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
      this.getUrl()
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      var pic_url = 'https://sahd.offcn.com/cq/skbk/cqgg_pic.jpg?' + timestamp;
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
      title: "重庆公务员公告已出，点击查看！",
      path: "/pages/ggread/ggread?source=" + wx.getStorageSync('source'),
      success: function (res) {
        console.log(res, "转发成功")
      },
      fail: function (res) {
        console.log(res, "转发失败")
      }
    }
  }
})