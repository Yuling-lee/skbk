// component/select/select.js
Component({
  properties: {
    propArray: {
      type: Array,
      value: []
    },
    selectText: {
      type: String,
      value: "请选择"
    },
    selectShow: {
      type: Boolean,
      value: false
    },
    stype: {
      type: String,
      value: "0"
    },
    icnoname:{
      type: String,
      value: ""
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    animationDatax: '',
    selectShow:true,
    textColor: "#999999",
    edDetail:true,
    isActive: false,
    inputVal:''
  },
  lifetimes: {
    ready() {
    }
  },
  methods: {
    //控制下拉显示
    selectToggle: function () {
      let animation = this.animation;
      if (this.data.selectShow) {
        this.setData({
          selectShow: !this.data.selectShow
        })
        this.hideDetail()
      } else {
        this.setData({
          selectShow: !this.data.selectShow
        })
        //下拉动画
        this.showDetail()
      }
    },
    showDetail() {
      this.setData({
        edDetail:false
      })
      this.triggerEvent('changez', { isIndexs: false});
    },
    hideDetail() {
      this.setData({
        selectShow: !this.data.selectShow
      })
      setTimeout(function () {
        this.setData({
          edDetail: true
        })
        this.triggerEvent('changez', { isIndexs: true});
      }.bind(this),100)
    },
    //选择事件
    setText: function (e) {
      var nowData = this.properties.propArray;
      var nowIdx = e.target.dataset.index;
      var nowText = nowData[nowIdx].text;
      this.setData({
        textColor: "#d32423",
        selectShow: true,
        selectText: nowText
      })
      if (this.selectText !=''){
        this.setData({
          isActive:true
        })
      }else{
        this.setData({
          isActive: false
        })
      }
      this.triggerEvent('m_select_touch', { selIndex: nowIdx, stype: this.properties.stype });
      this.hideDetail()
    }
  }
})