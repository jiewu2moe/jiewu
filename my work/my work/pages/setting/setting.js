var util = require('../post/post.js')
var app = getApp();

Page({
  data: {
    cache: [
      { iconurl: '/images/icon/wx_app_clear.png', title: '缓存清理', tap: 'clearCache' }
    ],
    device: [
      { iconurl: '/images/icon/wx_app_cellphone.png', title: '系统信息', tap: 'showSystemInfo' },
      { iconurl: '/images/icon/wx_app_network.png', title: '网络状态', tap: 'showNetWork' },
      { iconurl: '/images/icon/wx_app_shake.png', title: '摇一摇', tap: 'shake' },
      
    ],
 
  
    compassVal: 0,
    compassHidden: true,
    shakeInfo: {
      gravityModalHidden: true,
      num: 1,
      enabled: false
    },
    shakeData: {
      x: 0,
      y: 0,
      z: 0
    },
  },

  onLoad: function () {
    this.setData({
      userInfo:app.globalData.g_userInfo
      
    })
  },

  //显示模态窗口
  showModal: function (title, content, callback) {
    wx.showModal({
      title: title,
      content: content,
      confirmColor: '#1F4BA5',
      cancelColor: '#7F8389',
      success: function (res) {
        if (res.confirm) {
          callback && callback();
        }
      }
    })
  },

  // 缓存清理
  clearCache: function () {
    this.showModal('缓存清理', '确定要清除本地缓存吗？', function () {
      wx.clearStorage({
        success: function (msg) {
          wx.showToast({
            title: "缓存清理成功",
            duration: 1000,
            mask: true,
            icon: "success"
          })
        },
        fail: function (e) {
          console.log(e)
        }
      })
    });
  },

  //显示系统信息
  showSystemInfo: function () {
    wx.navigateTo({
      url: 'device/device'
    });
  },

  //网络状态
  showNetWork: function () {
    var that = this;
    wx.getNetworkType({
      success: function (res) {
        var networkType = res.networkType
        that.showModal('网络状态', '您当前的网络：' + networkType);
      }
    })
  },

  

  //摇一摇
  shake: function () {
    var that = this;
    //启用摇一摇
    this.gravityModalConfirm(true);

    wx.onAccelerometerChange(function (res) {
      //摇一摇核心代码，判断手机晃动幅度
      var x = res.x.toFixed(4),
        y = res.y.toFixed(4),
        z = res.z.toFixed(4);
      var flagX = that.getDelFlag(x, that.data.shakeData.x),
        flagY = that.getDelFlag(y, that.data.shakeData.y),
        flagZ = that.getDelFlag(z, that.data.shakeData.z);

      that.data.shakeData = {
        x: res.x.toFixed(4),
        y: res.y.toFixed(4),
        z: res.z.toFixed(4)
      };
      if (flagX && flagY || flagX && flagZ || flagY && flagZ) {
        // 如果摇一摇幅度足够大，则认为摇一摇成功
        if (that.data.shakeInfo.enabled) {
          that.data.shakeInfo.enabled = false;
          that.playShakeAudio();
         
        }
      }
    });
  },


  //启用或者停用摇一摇功能
  gravityModalConfirm: function (flag) {
    if (flag !== true) {
      flag = false;
    }
    var that = this;
    this.setData({
      shakeInfo: {
        gravityModalHidden: !that.data.shakeInfo.gravityModalHidden,
        num: 0,
        enabled: flag
      }
    })
  },

  //计算摇一摇的偏移量
  getDelFlag: function (val1, val2) {
    return (Math.abs(val1 - val2) >= 1);
  },

  // 摇一摇成功后累加摇一摇次数并跳转至推荐文章
  playShakeAudio: function () {
    var that = this;
    wx.playBackgroundAudio({
      dataUrl: 'http://7xqnxu.com1.z0.glb.clouddn.com/wx_app_shake.mp3',
      title: '',
      coverImgUrl: ''
    });
    wx.onBackgroundAudioStop(function () {
      that.data.shakeInfo.num++;
      var postId = Math.floor(Math.random() * 5+1);
      console.log(postId);
      wx.navigateTo({
        url: "/pages/post/post-detail/post-detail?id=" + postId
      })
      that.setData({
        shakeInfo: {
          num: that.data.shakeInfo.num,
          enabled: true,
          gravityModalHidden: false
        }
      });
    });
  },

 

  

 

})