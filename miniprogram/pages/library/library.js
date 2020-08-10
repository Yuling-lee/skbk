// pages/means/means.js
const app = getApp()
let actid = ''
let alerdyList = {}
let deleteList=[]
const db = wx.cloud.database()
let planUrl = ""
Page({
  data: {
    isShowAuth: false,
    showIcon: true,
    bgcolor: '',
    book_list: [],
    showEditor: false,
    deleteNum:20,
    showBar:false,
    hdlx:'图书'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync('userInfo').isLoaded) {
      this.setData({
        userInfo: wx.getStorageSync('userInfo')
      })
      this.getUserInfo()
    }
    if (!wx.getStorageSync('source') || wx.getStorageSync('source') == 'default') {
      if (options.scene) {
        wx.setStorageSync('source', options.scene);
      } else {
        wx.setStorageSync('source', 'default');
      }
    };
  },
  getUserInfo() {
    const db = wx.cloud.database()
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
          alerdyList = res.data[0]
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
  onPageScroll: function (t) {
    if (t.scrollTop >= app.globalData.titleBarHeight) {
      this.setData({ bgcolor: "#d32423" })
      app.fadeInOut(this, 'fadeAni', 1)
    } else {
      this.setData({ bgcolor: "" })
      app.fadeInOut(this, 'fadeAni', 0)
    }
  },
  go_editor() {
    deleteList = []
    if (this.data.showEditor){
      this.setData({
        showEditor: !this.data.showEditor,
        showBar: !this.data.showBar,
        deleteNum:0
      })
    }else{
      let now_lib = this.data.book_list
      for (var i = 0; i < now_lib.length; i++) {
        now_lib[i].isDelete = false
      }
      this.setData({
        showEditor: !this.data.showEditor,
        book_list: now_lib,
        showBar: !this.data.showBar,
        deleteNum: 0
      })
    }
  },
  cancelDelete(){
    this.setData({
      showEditor:false,
      showBar: false,
      deleteNum: 0
    })
  },
  addbook: function (event) {
    if (!this.data.userInfo.isLoaded) {
      this.setData({
        isShowAuth: true,
        source: wx.getStorageSync('source')
      })
      planUrl = '/pages/read/read?readurl=' + event.currentTarget.dataset.readurl
      return;
    }
    if (this.data.showEditor){
      deleteList = []
      let now_lib = this.data.book_list
      if (now_lib[event.currentTarget.dataset.index].isDelete) {
        now_lib[event.currentTarget.dataset.index].isDelete = false
      } else {
        now_lib[event.currentTarget.dataset.index].isDelete = true
      }
      for (var i = 0; i < now_lib.length; i++) {
        if (!now_lib[i].isDelete) {
          deleteList.push(now_lib[i])
        }
      }
      this.setData({
        book_list: now_lib,
        deleteNum: this.data.book_list.length - deleteList.length
      })
    }else{
      const readurl = event.currentTarget.dataset.readurl
      wx.navigateTo({
        url: '/pages/read/read?readurl=' + readurl
      });
    }
   
  },
  user_login() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    if (planUrl!=''){
      wx.navigateTo({
        url: planUrl
      });
    }
  },
  go_means(){
    wx.navigateTo({
      url: '/pages/means/means'
    });
  },
  deleteLib(){
    if(this.data.deleteNum<=0){
      wx.showToast({
        icon: 'none',
        title: '未选择图书'
      })
      return;
    }
    let that=this;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          wx.showLoading({
            mask: true,
            title: '删除中.....'
          });
          db.collection('userdata').doc(alerdyList._id).update({
            data: {
              book_list: deleteList
            },
            success: res => {
              that.setData({
                book_list: deleteList,
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
  }
})