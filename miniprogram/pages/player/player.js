// pages/player/player.js

let musiclist = []

// 正在播放的歌曲的index
let nowPlayingIndex = 0

// 获取全局唯一的背景音频管理器
const audioManager = wx.getBackgroundAudioManager()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '',
    isPlaying: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    // 获取本地存储的musiclist数据
    musiclist = wx.getStorageSync('musiclist')
    // 获取正在播放的歌曲的index
    nowPlayingIndex = options.index

    this._loadMusicDetail(options.musicId)
  },

  /**
   * 加载当前的歌曲数据
   */
  _loadMusicDetail(musicId) {
    // 暂停正在播放的歌曲
    audioManager.stop()
    let music = musiclist[nowPlayingIndex]
    // console.log(music.id)
    // 更改歌曲名
    wx.setNavigationBarTitle({
      title: music.name,
    })
    // 获取歌曲图片地址
    this.setData({
      // 海报图片地址
      picUrl: music.al.picUrl,
      // 是否正在播放, false 不播放
      isPlaying: false
    })
		
    wx.showLoading({
      title: '玩命加载中...',
    })

		wx.cloud.callFunction({
      name: 'music',
      data: {
        musicId,
        $url: 'musicUrl',
      }
    }).then((res) => {
      // console.log(res)
      let result = JSON.parse(res.result)
      // 歌曲播放地址
      audioManager.src = result.data[0].url
      audioManager.title = music.name
      // 海报
      audioManager.coverImgUrl = music.al.picUrl
      // 歌手
      audioManager.singer = music.ar[0].name
      // 歌曲名
      audioManager.epname = music.al.name
      // 当播放地址/海报/歌手 全部存在时, 调用isPlaying函数开始播放音乐
      this.setData({
        isPlaying: true
      })
      wx.hideLoading()
    }).catch(err => {
      console.log(err)
    })
  },

  // 正在播放
  togglePlaying() {
    if (this.data.isPlaying) {
      // 暂停
      audioManager.pause()
    }else {
      // 开始
      audioManager.play()
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },

  // 上一首
  onPrev() {
    nowPlayingIndex--
    // console.log('正在播放的为第' + nowPlayingIndex)
    // 第一首歌在前一首就是最后一首 
    if (nowPlayingIndex < 0) {
      nowPlayingIndex = musiclist.length - 1 
    }

    this._loadMusicDetail(musiclist[nowPlayingIndex].id)
  },

  // 下一首
  onNext() {
    nowPlayingIndex++
    // console.log('正在播放的为第' + nowPlayingIndex)
    // 最后一首再向后就是第一首
    if (nowPlayingIndex === musiclist.length) {
      nowPlayingIndex = 0
    }

    this._loadMusicDetail(musiclist[nowPlayingIndex].id)
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