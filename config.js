require('dotenv').config()

export const redis = {
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
  url: process.env.REDIS_URL,
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
  dailyPairLimit: process.env.DAILY_PAIR_LIMIT ? parseInt(process.env.DAILY_PAIR_LIMIT) : 7,
  repeatLimit: 3,
}

export const deta = {
  projectKey: process.env.DETA_PROJECT_KEY,
}
