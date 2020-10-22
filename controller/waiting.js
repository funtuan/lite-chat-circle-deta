import moment from 'moment';
import Waiting from '../mongoose/model/Waiting'
import Room from '../mongoose/model/Room'
import { sendText, sendMenu } from '../service/messenger'
import { rules } from '../config';

export const userAddWaiting = async (user) => {
    const exist = await Waiting.findOne({
        user: user._id,
    })
    const historyRooms = await Room.find({
        users: user,
        createdAt: {"$gt":new Date(moment().format('MM/DD/YYYY'))},
    }).sort({'createdAt': -1}).limit(rules.dailyPairLimit).populate('users')

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
        const newWaiting = new Waiting({ user })
        newWaiting.banUsers = []

        // 避免連續遇到同一人
        for (const room of historyRooms.slice(0, rules.repeatLimit)) {
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
        await sendText({
            bid: user.bid,
            text: `今日剩餘配對 ${rules.dailyPairLimit - historyRooms.length} 次，請珍惜每天能配對的 ${rules.dailyPairLimit} 位同學！`,
        })
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