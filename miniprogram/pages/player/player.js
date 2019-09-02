// pages/player/player.js

let musiclist = []

// 正在播放的歌曲的index
let nowPlayingIndex = 0

Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    // 获取本地存储的musiclist数据
    musiclist = wx.getStorageSync('musiclist')
    // 获取正在播放的歌曲的index
    nowPlayingIndex = options.index

    this._loadMusicDetail()
  },

  /**
   * 加载当前的歌曲数据
   */
  _loadMusicDetail() {
    let music = musiclist[nowPlayingIndex]
    console.log(music)
    // 更改歌曲名
    wx.setNavigationBarTitle({
      title: music.name,
    })
    // 获取歌曲图片地址
    this.setData({
      picUrl: music.al.picUrl
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

  }
})