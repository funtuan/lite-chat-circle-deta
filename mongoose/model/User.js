import mongoose, { Schema } from 'mongoose'
const schema = new Schema({
    type: {
        type: String,
        enum: ['fb'],
        required: true,
    },
    bid: {
        type: String,
        required: true,
    },
    name: String,
    status: {
        type: String,
        enum: ['home', 'waiting', 'room'],
        default: 'home',
        required: true,
    },
    onlineRoom: {
        type: Schema.Types.ObjectId,
        ref: 'Room',
    },
}, { timestamps: true });

const model = mongoose.model('User', schema);

export default model