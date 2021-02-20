import Queue from 'bull'
import { redis } from '../config';

export const userMessage = new Queue('userMessage', redis.url);