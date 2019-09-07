// componments/progress-bar/progress.js

let areaWidth = 0
let viewWidth = 0
const audioManager = wx.getBackgroundAudioManager()
// 初始秒
let currentSeconds = -1
// 当前歌曲的总时长，以秒为单位
let duration = 0
// 当前是否在拖动进度条，解决当前进度条处于正在拖动的时候会和updatetime冲突事件，即在拖动滚动条上小圆点的时候会有抖动的冲突
let isMoving = false

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isSame: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    showTime: {
      currentTime: '00:00',
      totalTime: '00:00'
    },
    movableDis: 0,
    progress: 0,
  },

  lifetimes: {
    ready() {
      if (this.properties.isSame && this.data.showTime.totalTime == "00:00") {
        this._setTime()
      }
      this._getMovableDis()
      this._bindBGMEvents()
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 移动播放器滚动条的小圆点
    onMove(e) {
      // console.log(e)
      // 开始拖动
      if (e.detail.source === "touch") {
        // 拖动的距离
        this.data.progress = e.detail.x / (areaWidth - viewWidth) * 100
        this.data.movableDis = e.detail.x
        isMoving = true
      }
    },

    // 拖动后离开
    onTouchEnd() {
      // 将拖动最终的距离显示在页面上
      // 不写在onMove的原因是 setData 如果一直在设置距离会影响效率页面也会出现明显的卡顿现象，
      const currentTimeFmt = this._dateFormat(Math.floor(audioManager.currentTime))
      // 拖动滚动条小圆点左边时间跟随增加或者减少
      this.setData({
        progress: this.data.progress,
        movableDis: this.data.movableDis,
        ['showTime.currentTime']: currentTimeFmt.minutes + ':' + currentTimeFmt.seconds
      })
      // 当前歌曲的进度就是当前歌曲的总时长*滚动条拖动的距离/总长度
      audioManager.seek(duration * this.data.progress / 100)
      isMoving = false
    },

    // 查找节点
    _getMovableDis() {
      const query = this.createSelectorQuery()
      query.select('.movable-area').boundingClientRect()
      query.select('.movable-view').boundingClientRect()
      query.exec((rect) => {
        // console.log(rect)
        areaWidth = rect[0].width
        viewWidth = rect[1].width
      })
    },

    // 绑定音乐对应的事件
    _bindBGMEvents() {

      // 播放事件
      audioManager.onPlay(() => {
        console.log('onPlay')
        isMoving = false
      })


      // 停止播放事件
      audioManager.onStop(() => {
        console.log('onStop')
      })


      // 暂停事件
      audioManager.onPause(() => {
        console.log('onPause')
      })


      // 当前音频正在加载
      audioManager.onWaiting(() => {
        console.log('onWaiting')
      })


      // 音乐进入可以播放的事件
      audioManager.onCanplay(() => {
        console.log('onCanplay')
        // console.log(audioManager.duration)
        // 查找歌曲时长可能会有延迟处理延迟事件
        if (typeof audioManager.duration != 'undefined') {
          this._setTime()
        }else {
          setTimeout(() => {
            this._setTime()
          }, 1000)
        }
        
      })


      // 当前音乐播放进度
      audioManager.onTimeUpdate(() => {
        if (!isMoving) {
          // console.log('onTimeUpdate')
          // 已经播放的时长
          const currentTime = audioManager.currentTime
          // console.log(currentTime)
          // 总时长
          const duration = audioManager.duration
          // console.log(duration)
          // 转化成为分钟
          const currentTimeFmt = this._dateFormat(currentTime)
          // console.log(currentTimeFmt)

          if (currentTime.toString().split('.')[0] != currentSeconds) {
            // console.log(currentTime)

            this.setData({
              // 左边已经播放的时长
              ['showTime.currentTime']: `${currentTimeFmt.minutes}:${currentTimeFmt.seconds}`,
              // 进度条的小圆点移动的位置
              movableDis: (areaWidth - viewWidth) * currentTime / duration,
              // 小圆点已经的长度
              progress: currentTime / duration * 100,
            })
          currentSeconds = currentTime.toString().split('.')[0]

          // 联动歌词，让歌词和歌曲的进度一样
          this.triggerEvent('timeUpdate', {
            currentTime
          })
          }
        }        
      })


      // 播放完成事件
      audioManager.onEnded(() => {
        console.log('onEnded')
        // 播放完成当前歌曲自动播放下一首歌曲
        this.triggerEvent('musicEnd')
      })


      // 播放出错事件
      audioManager.onError((err) => {
        console.error(res.errMsg)
        console.error(res.errCode)
        wx.showToast({
          title: '错误' + res.errCode,
        })
      })

    },

    // 获取歌曲总时长
    _setTime() {
      duration = audioManager.duration
      // console.log(duration)

      const durationFmt = this._dateFormat(duration)
      // console.log(durationFmt)
      
      // 将当前歌曲的总时长转换成为分钟后显示
      this.setData({
        ['showTime.totalTime']: `${durationFmt.minutes}:${durationFmt.seconds}`
      })
    },

    // 将获取的总时长转换成为 分钟:秒 的格式
    _dateFormat(seconds) {
      const minutes = Math.floor(seconds / 60)
      seconds = Math.floor(seconds % 60)
      return {
        'minutes': this._parse0(minutes),
        'seconds': this._parse0(seconds)
      }
    },

    // 不够10的在前面补 0
    _parse0(seconds) {
      return seconds < 10 ? '0' + seconds : seconds
    }
  }
})
