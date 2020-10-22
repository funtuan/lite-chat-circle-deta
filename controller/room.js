import imgur from 'imgur'
import Room from '../mongoose/model/Room'
import User from '../mongoose/model/User'
import { sendText, sendMenu, sendRead } from '../service/messenger'


export const createRoom = async (users) => {
    const room = new Room({
        status: 'open',
        users,
        chats: [],
    })
    await room.save()

    for (const user of users) {
        user.onlineRoom = room._id
        user.status = 'room'
        await user.save()
        setTimeout(()=> {
            sendMenu('startRoom', user)
        }, 1000)
    }
    return;
}

export const userLeaveRoom = async (user) => {
    const room = await Room.findById(user.onlineRoom)

    if (!room) {
        await sendText({
            bid: user.bid,
            text: '現在沒有加入任何聊天',
        })
        sendMenu('home', user)
        return;
    }

    user.onlineRoom = null
    user.status = 'home'
    await user.save()
    await sendText({
        bid: user.bid,
        text: '已成功離開聊天',
    })
    sendMenu('home', user)

    const roomOtherUsers = room.users.filter(one => one.toString() !== user._id.toString())
    for (const otherUserId of roomOtherUsers) {
        const otherUser = await User.findById(otherUserId)
        if (otherUser) {
            otherUser.onlineRoom = null
            otherUser.status = 'home'
            await otherUser.save()
            await sendText({
                bid: otherUser.bid,
                text: '對方離開聊天，請重新配對',
            })
            sendMenu('home', otherUser)
        }
    }

    room.status = 'close'
    await room.save()
    return;
}

export const addChat = async (data) => {
    const room = await Room.findById(data.user.onlineRoom).populate('users')
    if (data.type === 'image') {
        const json = await imgur.uploadUrl(data.payload.url)
        data.text = json.data.link
    }
    room.chats.push(data)
    await room.save()

    for (const user of room.users) {
        if (user._id.toString() != data.user._id.toString() && user.onlineRoom && user.onlineRoom === data.user.onlineRoom) {
            switch (data.type) {
                case 'text':
                    await sendText({
                        bid: user.bid,
                        text: data.text,
                    })
                    break;
                case 'image':
                    await sendText({
                        bid: user.bid,
                        text: data.text,
                    })
                    break;
                default:
                    break;
            }
        }
    }

    return;
}

export const readChat = async (data) => {
    const room = await Room.findById(data.user.onlineRoom).populate('users')

    for (const user of room.users) {
        if (user._id.toString() != data.user._id.toString()) {
            sendRead(user)
        }
    }

    return;
}

