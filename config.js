require('dotenv').config()

export const redis = {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
}

export const mongo = {
    url: process.env.MONGO_URL,
}

export const webhook = {
    'verify_token': process.env.FB_WEBHOOK_VERITY_TOKEN,
}

export const fbMessenger = {
    token: process.env.FB_MESSENGER_TOKEN,
}

export const rules = {
    dailyPairLimit: 7,
    repeatLimit: 3,
}