
import { app } from 'deta'
import { createRoom } from '../controller/room'
import * as waitingModel from '../model/waiting'

let pairWaiting = false


app.lib.cron(async () => {
  if (pairWaiting) return
  pairWaiting = true

  try {
    const waitings = await waitingModel.find()
    let index = 0
    while (index < waitings.length) {
      for (let k = index + 1; k < waitings.length; k++) {
        if (
          waitings[index].banUsers.indexOf(waitings[k].user) === -1 &&
                        waitings[k].banUsers.indexOf(waitings[index].user) === -1
        ) {
          createRoom([waitings[index].user, waitings[k].user])
          waitings[index].remove()
          waitings[k].remove()
          waitings.splice(k, 1)

          k = waitings.length
        }
      }
      index++
    }
    return
  } catch (error) {
  } finally {
    pairWaiting = false
  }
})
