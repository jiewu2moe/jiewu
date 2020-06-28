//var dataObj=require('../../data/data.js')

import {DBPost} from'../../db/DBPost.js';
Page({

  data:{

  },
onLoad:function(){
  var dbPost=new DBPost();
  this.setData(
    {

      postList:dbPost.getAllPostData()
    });
},

onShow: function (event) {
    this.onLoad();
},

 onTapToDetail(event){          //跳转制定详情
   var postId=event.currentTarget.dataset.postId;
   console.log(postId);
   wx.navigateTo({
     url: 'post-detail/post-detail?id='+postId
   })
 },
  onSwiperTap: function (event) {   //轮播图跳转到对应文章
    var postId = event.target.dataset.postId;
    wx.navigateTo({
      url: "post-detail/post-detail?id=" + postId
    })
  }

})