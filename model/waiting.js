
import {
  waitingDB,
} from '../deta'

export const findOneByUser = async (userKey) => {
  return waitingDB.get(userKey)
}

export const create = async (userKey, banUsers) => {
  const waiting = await waitingDB.put({
    user: userKey,
    banUsers,
    createdAt: +new Date(),
  }, userKey)

  return waiting
}

export const find = async () => {
  const res = waitingDB.fetch({})
  let allItems = res.items

  while (res.last) {
    res = await waitingDB.fetch({}, { last: res.last })
    allItems = allItems.concat(res.items)
  }

  return allItems.sort((a, b) => a.createdAt - b.createdAt )
}

export const delByUser = async (userKey) => {
  await waitingDB.delete(userKey)
}
