import cron from 'node-cron'
import Waiting from '../mongoose/model/Waiting'
import { createRoom } from '../controller/room'


cron.schedule('*/3 * * * * *', async () => {
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
});