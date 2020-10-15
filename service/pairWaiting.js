import cron from 'node-cron'
import AsyncLock from 'async-lock'
import Waiting from '../mongoose/model/Waiting'
import { createRoom } from '../controller/room'
const lock = new AsyncLock({maxPending: 1});


cron.schedule('* * * * * *', async () => {
    lock.acquire(`pairWaiting`, async() => {
        let waitings = await Waiting.find({}).sort({'createdAt': 1}).populate('user')
        let index = 0
        while (index < waitings.length) {
            for (let k = index + 1; k < waitings.length; k++) {
                if (
                    waitings[index].banUsers.indexOf(waitings[k].user._id) === -1 &&
                    waitings[k].banUsers.indexOf(waitings[index].user._id) === -1
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
        return;
    }, function(err, ret) {})
});