
import { sendText, sendMenu } from '../service/messenger'
import { rules } from '../config'
import * as waitingModel from '../model/waiting'
import * as roomModel from '../model/room'
import * as userModel from '../model/user'

export const userAddWaiting = async (user) => {
  const exist = await waitingModel.findOneByUser(user.key)

  const historyRooms = await roomModel.findByUserToday(user.key)

  if (historyRooms.length === rules.dailyPairLimit) {
    await sendText({
      bid: user.bid,
      text: `今日配對次數已用盡，請明日再試，珍惜每天能配對的 ${rules.dailyPairLimit} 位同學！`,
    })
    return
  }

  if (exist) {
    // 正在等待
    await sendText({
      bid: user.bid,
      text: '正在配對中，請稍候',
    })
  } else {
    const banUsers = []

    // 避免連續遇到同一人
    for (const room of historyRooms.slice(0, rules.repeatLimit)) {
      for (const one of room.users) {
        if (user._id.toString() !== one._id.toString()) {
          banUsers.push(one)
        }
      }
    }
    await waitingModel.create(user.key, banUsers)

    await userModel.enterWaiting(user.key)

    // 加入等待完成
    sendMenu('waiting', user)
    await sendText({
      bid: user.bid,
      text: `今日剩餘配對 ${rules.dailyPairLimit - historyRooms.length} 次，請珍惜每天能配對的 ${rules.dailyPairLimit} 位同學！`,
    })
  }
}

export const userLeaveWaiting = async (user) => {
  const exist = await waitingModel.findOneByUser(user.key)

  if (exist) {
    // 離開配對
    await waitingModel.delByUser(user.key)
    await userModel.enterHome(user.key)
    sendMenu('home', user)
  } else {
    // 無配對
    sendText({
      bid: user.bid,
      text: '目前非配對狀態，操作無效',
    })
  }
}
