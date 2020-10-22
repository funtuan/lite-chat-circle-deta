import { userMessage } from './queue'
import { loadUserByBid } from '../controller/user'
import { userAddWaiting, userLeaveWaiting } from '../controller/waiting'
import { addChat, readChat, userLeaveRoom } from '../controller/room'
import { sendMenu } from '../service/messenger'

userMessage.process(10, async (job, done) => {
    const { data } = job
    if (!data.user) {
        done()
        return;
    }
    data.user = await loadUserByBid(data.user)
    switch (data.type) {
        case 'text':
            textHandler(data)
            break;
        case 'postback':
            postbackHandler(data)
            break;
        case 'image':
            imageHandler(data)
            break;
        case 'read':
            readHandler(data)
            break;
        default:
            break;
    }
    done()
})

function textHandler(data) {
    switch (data.text) {
        case '開始聊天':
            userAddWaiting(data.user)
            break;
        case '取消配對':
            userLeaveWaiting(data.user)
            break;
        case '離開聊天':
            userLeaveRoom(data.user)
            break;
        default:
            if (data.user.onlineRoom) {
                addChat(data)
            } else {
                sendMenu(data.user.status, data.user)
            }
            break;
    }
}

function postbackHandler(data) {
    switch (data.postback.payload) {
        case 'START_WAITING_PAYLOAD':
            userAddWaiting(data.user)
            break;
        case 'LEAVE_WAITING_PAYLOAD':
            userLeaveWaiting(data.user)
            break;
        case 'LEAVE_ROOM_PAYLOAD':
            userLeaveRoom(data.user)
            break;
        default:
            sendMenu(data.user.status, data.user)
            break;
    }
}

const likeStickerIds = [
    369239343222814,
    369239383222810,
    369239263222822,
]

function imageHandler(data) {
    const { sticker_id } = data.payload
    console.log('imageHandler', data)
    if (sticker_id && likeStickerIds.indexOf(sticker_id) !== -1) {
        sendMenu(data.user.status, data.user)
    }
    if (!sticker_id && data.user.onlineRoom) {
        addChat(data)
    }
}


function readHandler(data) {
    if (data.user.onlineRoom) {
        readChat(data)
    }
}