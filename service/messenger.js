import FBMessenger from 'fb-messenger'
import { homeMenu, waitingMenu, roomMenu, startRoomMenu } from '../messengerTemplate/generic'
import { fbMessenger } from '../config'

const messenger = new FBMessenger(fbMessenger)

export const sendText = async ({
    bid,
    text,
}) => {
    console.log('sendText', {
        id: bid,
        text,
    })
    await messenger.sendTextMessage({
        id: bid,
        text,
    }) 
}

export const sendMenu = async (type, {
    bid,
}) => {
    console.log('sendMenu', type, {
        id: bid,
    })
    switch (type) {
        case 'home':
            await messenger.sendGenericMessage({
                id: bid,
                elements: homeMenu,
            }) 
            break;
        case 'waiting':
            await messenger.sendGenericMessage({
                id: bid,
                elements: waitingMenu,
            }) 
            break;
        case 'room':
            await messenger.sendGenericMessage({
                id: bid,
                elements: roomMenu,
            }) 
            break;
        case 'startRoom':
            await messenger.sendGenericMessage({
                id: bid,
                elements: startRoomMenu,
            }) 
            break;
        default:
            break;
    }
}


export const sendRead = async ({
    bid,
}) => {
    console.log('sendAction', {
        id: bid,
        action: 'mark_seen',
    })
    await messenger.sendAction({
        id: bid,
        action: 'mark_seen',
    }) 
}
