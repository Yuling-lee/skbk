// pages/result/result.js
const app = getApp()
let deleteList=[]
let alerdyList={}
const db = wx.cloud.database()
Page({
  data: {
    showIcon: true,
    bgcolor: '',
    result: [],
    showId: -1,
    isShowAuth: false,
    showEditor: false,
    deleteNum: 0,
    showBar: false
  },
  onLoad: function (options) {
    if (wx.getStorageSync('userInfo').isLoaded) {
      this.setData({
        userInfo: wx.getStorageSync('userInfo')
      })
      this.getUserInfo()
    }else{
      wx.navigateTo({
        url: '/pages/zwseach/zwseach',
      })
    }
    if (!wx.getStorageSync('source') || wx.getStorageSync('source') == 'default') {
      if (options.scene) {
        wx.setStorageSync('source', options.scene);
      } else {
        wx.setStorageSync('source', 'default');
      }
    }
  },
  getUserInfo() {
    db.collection('zw_avor').where({
      phoneNumber: this.data.userInfo.phoneNumber
    }).get({
      success: res => {
        wx.hideLoading();
        if (res.data.length == 0) {
          this.setData({
            result: []
          })
        } else {
          alerdyList = res.data[0]
          this.setData({
            result: res.data[0].zw_list
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
  showDetail(event) {
    this.setData({
      showId: event.currentTarget.dataset.index
    })
  },
  go_editor() {
     deleteList=[]
    if (this.data.showEditor) {
      this.setData({
        showEditor: !this.data.showEditor,
        showBar: !this.data.showBar,
        deleteNum: 0
      })
    } else {
      let now_lib = this.data.result
      for (var i = 0; i < now_lib.length; i++) {
        now_lib[i].isDelete = false
      }
      this.setData({
        showEditor: !this.data.showEditor,
        result: now_lib,
        showBar: !this.data.showBar,
        deleteNum: 0
      })
    }
  },
  cancelDelete() {
    this.setData({
      showEditor: false,
      showBar: false,
      deleteNum: 0
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
  addEditor: function (event) {
    deleteList = []
    let now_lib = this.data.result
    if (now_lib[event.currentTarget.dataset.index].isDelete){
      now_lib[event.currentTarget.dataset.index].isDelete=false
    }else{
      now_lib[event.currentTarget.dataset.index].isDelete =true
    }
    for (var i = 0; i < now_lib.length;i++){
      if (!now_lib[i].isDelete){
        deleteList.push(now_lib[i])
      }
    }
    this.setData({
      result: now_lib,
      deleteNum: this.data.result.length - deleteList.length
    })
  },
  user_login() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    if (this.data.result.length <= 0) {
      wx.navigateTo({
        url: '/pages/zwseach/zwseach',
      })
    }
  },
  deleteLib() {
    if (this.data.deleteNum <= 0) {
      wx.showToast({
        icon: 'none',
        title: '未选择收藏职位'
      })
      return;
    }
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          wx.showLoading({
            mask: true,
            title: '删除中.....'
          });
          db.collection('zw_avor').doc(alerdyList._id).update({
            data: {
              zw_list: deleteList
            },
            success: res => {
              that.setData({
                result: deleteList,
                showEditor: false,
                showBar: false
              })
              wx.showToast({
                title: '删除成功'
              })
            },
            fail: err => {
              console.error('[数据库] [更新记录] 失败：', err)
            }
          })
          wx.hideLoading();

        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  go_zwsearch() {
    wx.navigateTo({
      url: '/pages/zwseach/zwseach',
    })
  },
})