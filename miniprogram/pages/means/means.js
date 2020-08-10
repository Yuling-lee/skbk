// pages/means/means.js
const app = getApp()
let actid=''
let alerdyList = {}
const db = wx.cloud.database()
let planUrl = ""
Page({
  data: {
    isShowAuth: false,
    showIcon: true,
    bgcolor:'',
    book_list: [],
    showTip: false,
    isFirst: true,
    hdlx:'图书'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    actid = options.actid ? options.actid.replace(/\s+/g, '') : 'default_sk_0001'
    wx.showLoading({
      mask: true,
      title: '加载中'
    });
    const db = wx.cloud.database()
    db.collection('book_list').where({
      groupid:actid
    }).get({
      success: res => {
        this.setData({
          book_list: res.data[0].book_list
        },()=>{
          this.init_result();
        });
        wx.hideLoading();
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
      }
    })
    if (!wx.getStorageSync('source') || wx.getStorageSync('source') == 'default') {
      if (options.scene) {
        wx.setStorageSync('source', options.scene);
      } else {
        wx.setStorageSync('source', 'default');
      }
    }
    
    
  },
  init_result() {
    if (!this.data.userInfo.isLoaded) {
      this.setData({
        isShowAuth: true,
        source: wx.getStorageSync('source')
      })
      return;
    }
    db.collection('userdata').where({
      phoneNumber: this.data.userInfo.phoneNumber
    }).get({
      success: res => {
        wx.hideLoading();
        if (res.data.length == 0) {
          alerdyList = {
            book_list: []
          }
          this.setData({
            isFirst: true
          })
        } else {
          if (res.data[0].book_list.length > 0) {
            alerdyList = res.data[0]
            let now_list = this.data.book_list
            let fav_list = alerdyList.book_list
            for (var i = 0; i < now_list.length; i++) {
              let isSwitch = true;
              for (var k = 0; k < fav_list.length; k++) {
                if (now_list[i].bookid == fav_list[k].bookid) {
                  now_list[i].isFav = true
                  isSwitch = false
                  break;
                }
              }
              if (isSwitch) {
                now_list[i].isFav = false
              }
            }
            this.setData({
              book_list: now_list,
              isFirst: false
            })
          } else {
            alerdyList = res.data[0]
            alerdyList.zw_list=[]
            this.setData({
              isFirst: false
            })
          }
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
  copyText: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '加群链接复制成功'
            })
          }
        })
      }
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
  addbook: function (event) {
    if (event.currentTarget.dataset.isfav){
      if (!this.data.userInfo.isLoaded) {
            this.setData({
              isShowAuth: true,
              source: wx.getStorageSync('source')
            })
            planUrl = '/pages/read/read?readurl=' + event.currentTarget.dataset.readurl
            return;
      }
      const readurl = event.currentTarget.dataset.readurl
      wx.navigateTo({
        url: '/pages/read/read?readurl=' + readurl
      });
      return;
    }
    if (!this.data.userInfo.isLoaded) {
      this.setData({
        isShowAuth: true,
        source: wx.getStorageSync('source')
      })
      return;
    }
    const now_json = this.data.book_list[event.currentTarget.dataset.index]
    wx.showLoading({
      mask: true,
      title: '添加中.....'
    });
    if (!this.data.isFirst) {
      const updatearr = alerdyList
      if (updatearr.book_list) {
        updatearr.book_list.unshift(now_json)
      } else {
        updatearr.book_list = []
        updatearr.book_list.push(now_json)
      }
      db.collection('userdata').doc(updatearr._id).update({
        data: {
          book_list: updatearr.book_list
        },
        success: res => {
          let now_list = this.data.book_list
          let fav_list = alerdyList.book_list
          for (var i = 0; i < now_list.length; i++) {
            let isSwitch = true;
            for (var k = 0; k < fav_list.length; k++) {
              if (now_list[i].bookid == fav_list[k].bookid) {
                now_list[i].isFav = true
                isSwitch = false
                break;
              }
            }
            if (isSwitch) {
              now_list[i].isFav = false
            }
          }
          this.setData({
            book_list: now_list,
            showTip: true
          })
          wx.showToast({
            title: '已添加在书架了，快去阅读吧！'
          })
          wx.hideLoading();
        },
        fail: err => {
          wx.hideLoading();
          console.error('[数据库] [更新记录] 失败：', err)
        }
      })
    } else {
      const updatearr = {}
      updatearr.book_list = []
      updatearr.book_list.push(now_json)
      updatearr.phoneNumber = this.data.userInfo.phoneNumber
      db.collection('userdata').add({
        data: {
          book_list: updatearr.book_list,
          phoneNumber: updatearr.phoneNumber
        },
        success: res => {
          this.init_result()
          this.setData({
            showTip: true
          })
          wx.showToast({
            title: '已添加在书架了，快去阅读吧！'
          })
          wx.hideLoading();
          console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '添加书架失败，退出重新添加吧!'
          })
          wx.hideLoading();
          console.error('[数据库] [新增记录] 失败：', err)
        }
      })
    }
  },
  user_login() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    this.init_result();
  },
  close_tip() {
    this.setData({
      showTip: false
    })
  },
  go_target() {
    wx.navigateTo({
      url: '/pages/library/library',
    })
  }
})