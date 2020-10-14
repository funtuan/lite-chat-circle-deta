import Waiting from '../mongoose/model/Waiting'
import Room from '../mongoose/model/Room'
import { sendText, sendMenu } from '../service/messenger'

export const userAddWaiting = async (user) => {
    const exist = await Waiting.findOne({
        user: user._id,
    })

    if (exist) {
        // 正在等待
        await sendText({
            bid: user.bid,
            text: '正在配對中，請稍候',
        })
    } else {
        const newWaiting = new Waiting({ user })
        newWaiting.banUsers = []

        // 避免連續遇到同一人
        const historyRooms = await Room.find({users: user}).sort({'createdAt': -1}).limit(2).populate('users')
        for (const room of historyRooms) {
            for (const one of room.users) {
                if (user._id.toString() !== one._id.toString()) {
                    newWaiting.banUsers.push(one)
                }
            }
        }

        await newWaiting.save()
        user.status = 'waiting'
        await user.save()
        // 加入等待完成
        sendMenu('waiting', user)
    }
}

export const userLeaveWaiting = async (user) => {
    const waiting = await Waiting.findOne({
        user: user._id,
    })

    if (waiting) {
        // 離開配對
        await waiting.remove()
        user.status = 'home'
        await user.save()
        sendMenu('home', user)
    } else {
        // 無配對
        sendText({
            bid: user.bid,
            text: '目前非配對狀態，操作無效',
        })
    }
}