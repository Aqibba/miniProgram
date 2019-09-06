// componments/lyric/lyric.js
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
      console.log(lrc)
      this._parseLyric(lrc)
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    lyricList: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 解析歌词
    _parseLyric(lyric) {
      let line = lyric.split('\n')
      console.log(line)
      let lyricList = []
      line.forEach((el) => {
        let time = el.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)
        if (time != null) {
          console.log(time )
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
    }
  }
})
