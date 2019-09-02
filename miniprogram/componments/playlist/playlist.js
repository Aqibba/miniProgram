// componments/playlist/playlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
		playlist:{
			type: Object
		}
  },
	
	// 数据监听器
	observers: {
		// 取出对象中的playCount的属性，使用 ['对象.属性'] 写法
		['playlist.playCount'](count) { 
			this.setData({
				_count: this._tranNum(count, 2)
			})
		}
	},
  /**
   * 组件的初始数据
   */
  data: {
		_count: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
		// 转换数字，传入的数字和小数点后保留的位数
		_tranNum(num, point) {
			// 将得到的数字转换为字符串
			let str = num.toString().split('.')[0]
			// 判断当前的数字的长度来判断他是几位数方便加单位
			if (str.length < 6) {
				return str
			} else if (str.length >= 6 && str.length <= 8) {
				let decimal = str.substring(str.length - 4, str.length - 4 + point)
				return parseFloat(parseInt(num / 10000) + '.' + decimal) + '万'
			} else if (str.length > 8) {
				let decimal = str.substring(str.length - 8, str.length - 8 + point)
					return parseFloat(parseInt(num / 100000000) + '.' + decimal) + '亿'
			}
		},
    musicList() {
      wx.navigateTo({
        url: `../../pages/musiclist/musiclist?id=${this.properties.playlist.id}`,
        
      })
    }
  }
})
