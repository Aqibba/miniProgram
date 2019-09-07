// componments/lyric/lyric.js

// 当前歌词的高度
let lyricHeight = 0

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShowLyric: {
      type: Boolean,
      value: false
    },
    lyric: String,

  },

  observers: {
    lyric(lrc) {
      // console.log(lrc)
      // 如果当前歌曲没有歌词
      if (lrc == '暂无歌词提供') {
        this.setData({
          lyricList: [
            {
              lrc,
              time: 0
            }
          ],
          lyricIndex: -1
        })
      } else {
        this._parseLyric(lrc)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 歌词列表 
    lyricList: [],
    // 当前歌词的索引
    lyricIndex: 0,
    // 滚动条滚动的高度
    scrollTop: 0
  },
  
  // 在解析歌曲的歌词之前获取当前使用的设备的宽度
  // 换算rpx和px
  lifetimes: {
    ready() {
      // 小程序将所有的手机设备全部分成为750份
      wx.getSystemInfo({
        success(res) {
          // console.log(res)
          // 求出1rpx的大小对应的px高度
          lyricHeight = res.screenWidth / 750 * 64
        },
      })
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 解析歌词
    _parseLyric(lyric) {
      let line = lyric.split('\n')
      // console.log(line)
      let lyricList = []
      line.forEach((el) => {
        let time = el.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)
        if (time != null) {
          // console.log(time )
          let lrc = el.split(time)[1]
          let timeReg = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
          // 时间转换成为秒数
          let s = parseInt(timeReg[1]) * 60 + parseInt(timeReg[2]) + parseInt(timeReg[3]) / 1000
          lyricList.push({
            lrc,
            time:s
          })

        }
      })
      this.setData({
        lyricList
      })
    },

    

    // 接受从父组件--player--中传来的时间值
    update(currentTime){
      // console.log(currentTime)
      let lyricList = this.data.lyricList
      // 判断当前存储歌词数组的长度
      // 如果等于0，就是没有歌词直接返回
      if (lyricList.length == 0) {
        return
      }
      if (currentTime > lyricList[lyricList.length - 1].time) {
        if (this.data.lyricIndex != -1) {
          this.setData({
            lyricIndex: -1,
            scrollTop: lyricList.length * lyricHeight
          })
        }
      }
      // 如果不是0，那么就是有歌词
      // 有歌词的时候循环遍历所有的歌词取出每一句歌词
      for (let i = 0; i < lyricList.length; i++) {
        // 如果进度条前进的时间和当前歌词显示的时间相等或者当前显示歌词的时间，就高亮显示当前歌词
        if (currentTime <= lyricList[i].time) {
          this.setData({
            lyricIndex: i - 1,
            scrollTop: (i - 1) * lyricHeight
          })
          break
        }
      }
    }
  }
})
