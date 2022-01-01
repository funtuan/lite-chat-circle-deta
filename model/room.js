
import dayjs from 'dayjs'
import {
  roomDB,
} from '../deta'

function outputModel(data) {
  if (data.users) {
    data.users = data.users.split(',')
  }
  return data
}

export const findOneByKey = async (key) => {
  return outputModel(await roomDB.get(key))
}

export const findByUserToday = async (userKey) => {
  const res = roomDB.fetch({
    'users?contains': userKey,
    'createdAt?gt': +new Date(dayjs().format('YYYY/MM/DD')),
  })
  let allItems = res.items

  while (res.last) {
    res = await roomDB.fetch({}, { last: res.last })
    allItems = allItems.concat(res.items)
  }

  return allItems.map((one) => outputModel(one)).sort((a, b) => b.createdAt - a.createdAt )
}

export const create = async ({ users = [] } = {}) => {
  const room = await roomDB.put({
    status: 'open',
    users: users.join(),
    chats: [],
    closeAt: null,
    createdAt: +new Date(),
  })

  return outputModel(room)
}

export const addChat = async (key, chat) => {
  let room = await findOneByKey(key)

  room = await roomDB.update({
    chats: [
      ...room.chats,
      {
        ...chat,
        createdAt: +new Date(),
      },
    ],
  }, key)

  return outputModel(room)
}

export const close = async (key) => {
  const room = await roomDB.put({
    status: 'close',
    closeAt: +new Date(),
  }, key)

  return outputModel(room)
}
