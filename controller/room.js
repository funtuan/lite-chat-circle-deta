
import imgur from 'imgur'
import { sendText, sendMenu, sendRead } from '../service/messenger'
import * as roomModel from '../model/room'
import * as userModel from '../model/user'
import * as waitingModel from '../model/waiting'

export const createRoom = async (users) => {
  const room = await roomModel.create({
    users,
  })

  for (const user of users) {
    userModel.enterRoom(user.key, room.key)
    waitingModel.delByUser(user.key)

    setTimeout(()=> {
      sendMenu('startRoom', user)
    }, 1000)
  }
  return
}

export const userLeaveRoom = async (user) => {
  const room = await roomModel.findOneByKey(user.onlineRoom)

  if (!user.onlineRoom || !room) {
    await sendText({
      bid: user.bid,
      text: '現在沒有加入任何聊天',
    })
    sendMenu('home', user)
    return
  }

  await userModel.enterHome(user.key)

  await sendText({
    bid: user.bid,
    text: '已成功離開聊天',
  })
  sendMenu('home', user)

  const roomOtherUsers = room.users.filter((one) => one.toString() !== user.key.toString())
  for (const otherUserKey of roomOtherUsers) {
    const otherUser = await userModel.findOneByKey(otherUserKey)
    if (otherUser) {
      await userModel.enterHome(otherUser.key)

      await sendText({
        bid: otherUser.bid,
        text: '對方離開聊天，請重新配對',
      })
      sendMenu('home', otherUser)
    }
  }

  await roomModel.close(room.key)
  return
}

export const addChat = async (user, {
  type,
  payload,
  text,
}) => {
  const room = await roomModel.findOneByKey(user.onlineRoom)
  if (type === 'image') {
    const json = await imgur.uploadUrl(payload.url)
    if (json.data && json.data.link) {
      text = json.data.link
    }
  }
  if (text) {
    await roomModel.addChat(room.key, {
      user,
      text,
    })

    for (const userKey of room.users) {
      if (userKey !== user.key) {
        const otherUser = await userModel.findOneByKey(userKey)
        if (otherUser.onlineRoom === room.key) {
          switch (type) {
            case 'text':
              await sendText({
                bid: user.bid,
                text: text,
              })
              break
            case 'image':
              await sendText({
                bid: user.bid,
                text: text,
              })
              break
            default:
              break
          }
        }
      }
    }
  }

  return
}

export const readChat = async ({
  user,
}) => {
  const room = await roomModel.findOneByKey(user.onlineRoom)

  for (const userKey of room.users) {
    if (userKey !== user.key) {
      const otherUser = await userModel.findOneByKey(userKey)
      if (otherUser.onlineRoom === room.key) {
        sendRead(user)
      }
    }
  }

  return
}

