// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const rp = require('request-promise')
// 音乐的API接口
const URL = 'http://musicapi.xiecheng.live/personalized'
// 初始化数据库
const db = cloud.database()
const playlistCollection = db.collection('playlist')
// 定义每一次取出的最大条数
const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async (event, context) => {
  // 定义一个变量获取服务器中已有的歌单数据
  // const list = await playlistCollection.get()
  // 获取集合中总的数据条数
	const countResult = await playlistCollection.count()
	const total = countResult.total
  // console.log(total)
  // 计算一共取几次
	const batchTime = Math.ceil(total / MAX_LIMIT)
	const tasks = []
  // 遍历取出的次数
	for (let i = 0; i < batchTime; i++) {
    // 下一次从哪里开始取数据
		let pro = playlistCollection.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
		tasks.push(pro)
	}
	let list = {
		data: []
	}
	if (tasks.length > 0) {
		list = (await Promise.all(tasks)).reduce((acc, cur) => {
			return {
				data: acc.data.concat(cur.data)
			}
		})
	}
  // 定义一个变量获取API服务端中的的歌单数据
  const playlist = await rp(URL).then((res) => {
    // 将返回值转化为JSON字符串
    return JSON.parse(res).result
  })
  // 比较两个歌单数据，去除重复的歌单
  const newData = []
  // 循环取出API中的数据
  for (let i = 0; i <playlist.length; i++) {
    // 创建一个标志位，判断当前数据收重复，true表示当前ID不重复
    let flag = true
    // 循环取出数据库中的数据
    for (let j = 0; j < list.data.length; j++) {
      if (playlist[i].id === list.data[j].id) {
        flag = false
        break
      }
    }
    if (flag) {
      newData.push(playlist[i])
    }
  }
  for (let i = 0; i < newData.length; i++) {
    // 插入数据库是一条一条的插入
    await playlistCollection.add({
      data: {
        // 通过扩展运算符取出 playlist 中的每一个值
        ...newData[i],
        // 获取当前歌单插入服务器的时间
        createTime: db.serverDate(),
      }
    }).then((res) => {
      console.log('插入成功' + res)
    }).catch((err) => {
      console.log('插入失败' + err)
    })
  }
	return newData.length
}