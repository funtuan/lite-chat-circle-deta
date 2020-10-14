import { userMessage } from '../bull/queue'
import { webhook } from '../config'
const Messenger = require('messenger-node')
 
   
const Webhook = new Messenger.Webhook(webhook);

Webhook.on('messages', (event_type, sender_info, webhook_event) => {
    if (webhook_event.message.text) {
        userMessage.add({
            user: {
                type: 'fb',
                bid: webhook_event.sender.id,
            },
            type: 'text',
            text: webhook_event.message.text,
        })
    }
    if (webhook_event.message.attachments) {
        for (const attachment of webhook_event.message.attachments) {
            userMessage.add({
                user: {
                    type: 'fb',
                    bid: webhook_event.sender.id,
                },
                type: attachment.type,
                payload: attachment.payload,
            })
        }
    }
});

Webhook.on('messaging_postbacks', (event_type, sender_info, webhook_event) => {
    if (webhook_event.postback) {
        userMessage.add({
            user: {
                type: 'fb',
                bid: webhook_event.sender.id,
            },
            type: 'postback',
            postback: webhook_event.postback,
        })
    }
});

Webhook.on('message_reads', (event_type, sender_info, webhook_event) => {
    userMessage.add({
        user: {
            type: 'fb',
            bid: webhook_event.sender.id,
        },
        type: 'read',
        timestamp: webhook_event.timestamp,
    })
});
