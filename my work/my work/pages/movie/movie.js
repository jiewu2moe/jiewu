// pages/movie/movie.js
var until=require('../../util/util.js')
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    containerShow: true,
    searchPanelShow: false,
    searchResult: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function(event){
    var inTheatersUrl = app.globalData.doubanBase +
      "/v2/movie/in_theaters" + "?start=0&count=3";
  
    var comingSoonUrl=app.globalData.doubanBase+
    "/v2/movie/coming_soon"+"?start=0&count=3";
    var top250Url=app.globalData.doubanBase+
    "/v2/movie/top250"+"?star=0&count=3";
    
   
    this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映");
    this.getMovieListData(comingSoonUrl,"comingSoon","即将上映");
    this.getMovieListData(top250Url,"top250","豆瓣Top250");
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

  },

  getMovieListData:function(url,settedKey,categoryTitle){
    var that=this;
    wx.request({
      url: url,
      method:'GET',
      header:{
        "content-type":"json"
      },
      success:function(res){
        that.processDoubanData(res.data,settedKey,categoryTitle)
      },
      fail:function(error){
        console.log(error)
      }
    })
  },
  

  processDoubanData:function(moviesDouban,settedKey,categoryTitle){
    var movies=[];
    console.log(moviesDouban)
    for(var idx in moviesDouban.subjects){
      var subject=moviesDouban.subjects[idx];
      var title=subject.title;
      if(title.lenth>=6){
        title=title.substring(0,6)+"...";
      }
      var temp={
        stars:until.convertToStarsArray(subject.rating.stars),
        title:title,
        average:subject.rating.average,
        coverageUrl:subject.images.large,
        movieId:subject.id
      }
      movies.push(temp)
    }
    var readyData={};
    readyData[settedKey]={
      categoryTitle:categoryTitle,
      movies:movies
    }
    this.setData(readyData);
    console.log('hide');
    wx.hideNavigationBarLoading();
  },
  
  
  onMoreTap: function (event) {
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: "more-movie/more-movie?category=" + category
    })
  },

  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieId;
    wx.navigateTo({
      url: "movie-detail/movie-detail?id=" + movieId
    })
  },


//收藏隐藏主面板
  onBindFocus: function (event) {
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },

  onCancelImgTap: function (event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult: {},
      inputValue: ''
    }
    )
  },

  onBindConfirm: function (event) {
    var keyWord = event.detail.value;
    var searchUrl = app.globalData.doubanBase +
      "/v2/movie/search?q=" + keyWord;
    this.getMovieListData(searchUrl, "searchResult", "");

  }
})