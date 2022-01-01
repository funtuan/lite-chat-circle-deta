
import {
  userDB,
} from '../deta'

export const findOneByKey = async (key) => {
  return userDB.get(key)
}

export const loginOrRegister = async ({
  type,
  bid,
}) => {
  return userDB.put({
    type,
    bid,
    status: 'home',
    onlineRoom: null,
  }, `${type}:${bid}`)
}

export const enterRoom = async (key, roomKey) => {
  const user = await userDB.update({
    onlineRoom: roomKey,
    status: 'room',
  }, key)

  return user
}

export const enterHome = async (key) => {
  const user = await userDB.update({
    onlineRoom: null,
    status: 'home',
  }, key)

  return user
}

export const enterWaiting = async (key) => {
  const user = await userDB.update({
    onlineRoom: null,
    status: 'waiting',
  }, key)

  return user
}
