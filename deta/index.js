
import { Deta } from 'deta'
import { deta as detaConfig } from '../config'

const deta = Deta(detaConfig.projectKey)

export const roomDB = deta.Base('room')
export const userDB = deta.Base('user')
export const waitingDB = deta.Base('waiting')
