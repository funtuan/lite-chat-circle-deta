import mongoose, { Schema } from 'mongoose'
const schema = new Schema({
    status: {
        type: String,
        enum: ['open', 'close'],
        default: 'open',
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }],
    chats: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: ['text', 'image'],
            required: true,
        },
        text: String,
    }],
}, { timestamps: true });

const model = mongoose.model('Room', schema);

export default model