// componments/progress-bar/progress.js

let areaWidth = 0
let viewWidth = 0
const audioManager = wx.getBackgroundAudioManager()
let currentSeconds = -1
Component({
  /**
   * 组件的属性列表
   */
  properties: {

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
      this._getMovableDis()
      this._bindBGMEvents()
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _getMovableDis() {
      // 查找节点
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
        console.log('onTimeUpdate')
        // 已经播放的时长
        const currentTime = audioManager.currentTime
        // console.log(currentTime)
        // 总时长
        const duration = audioManager.duration
        console.log(duration)
        // 转化成为分钟
        const currentTimeFmt = this._dateFormat(currentTime)
        console.log(currentTimeFmt)

        if (currentTime.toString().split('.')[0] != currentSeconds) {
          console.log(currentTime)

          this.setData({
            // 左边已经播放的时长
            ['showTime.currentTime']: `${currentTimeFmt.minutes}:${currentTimeFmt.seconds}`,
            // 进度条的小圆点移动的位置
            movableDis: (areaWidth - viewWidth) * currentTime / duration,
            // 小圆点已经的长度
            progress: currentTime / duration * 100,
          })
        }

        currentSeconds = currentTime.toString().split('.')[0]
        
      })
      // 播放完成事件
      audioManager.onEnded(() => {
        console.log('onEnded')
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
      const duration = audioManager.duration
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
