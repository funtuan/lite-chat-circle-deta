import { userMessage } from './queue'
import message from '../controller/message';

userMessage.process(10, async (job, done) => {
    const { data } = job
    await message(data)
    done()
})