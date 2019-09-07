// pages/player/player.js

let musiclist = []

// 正在播放的歌曲的index
let nowPlayingIndex = 0

// 获取全局唯一的背景音频管理器
const audioManager = wx.getBackgroundAudioManager()

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '',
    // 当前是否正在播放
    isPlaying: false,
    // 当前歌词是否显示
    isShowLyric: false,
    // 初始歌词
    lyric: '',
    // 是否为同一首歌曲
    isSame: false,
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

  // 将子组件--进度条--中获得的时间传递到子组件--歌词显示--中
  timeUpdate(e) {
    this.selectComponent('.lyric').update(e.detail.currentTime)
  },

  /**
   * 加载当前的歌曲数据
   */
  _loadMusicDetail(musicId) {

    // 判断当前点击的歌曲是否是同一首歌曲
    if (musicId === app.getPlayingMusicId()) {
      this.setData({
        isSame: true
      })
    }else {
      this.setData({
        isSame: false
      })
    }

    // 如果当前惦记的歌曲不是同一首歌才停止播放 
    if (!this.data.isSame) {
      // 暂停正在播放的歌曲
      audioManager.stop()
    }

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
		
    app.setPlayingMusicId(musicId)

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

      // VIP歌曲播放权限设置
      if (result.data[0].url == null) {
        wx.showToast({
          title: '未获得当前歌曲播放权限',
        })
        return
      }
 
      // 如果不是同一首歌曲
      if (!this.data.isSame) {
        // 歌曲播放地址
        audioManager.src = result.data[0].url
        audioManager.title = music.name
        // 海报
        audioManager.coverImgUrl = music.al.picUrl
        // 歌手
        audioManager.singer = music.ar[0].name
        // 歌曲名
        audioManager.epname = music.al.name
      }

      // 当播放地址/海报/歌手 全部存在时, 调用isPlaying函数开始播放音乐
      this.setData({
        isPlaying: true
      })
      wx.hideLoading()
    }).catch(err => {
      console.log(err)
    })

    // 加载当前歌曲的歌词
    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url:'lyric',
        musicId
      }
    }).then((res) => {
      // console.log(res)
      let lyric = '暂无歌词提供'
      let lrc = JSON.parse(res.result).lrc
      if (lrc) {
        lyric = lrc.lyric
      }
      this.setData({
        lyric
      })
    }).catch(err => {
      console.log(err)
    })
  },

  /**
   * 当前歌曲的歌词
   */

  showLyric() {
    this.setData({
      // 当点击了歌曲封面时候就进行封面和歌词中间的切换，也就是让 isShowLyric 取反
      isShowLyric: !this.data.isShowLyric
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