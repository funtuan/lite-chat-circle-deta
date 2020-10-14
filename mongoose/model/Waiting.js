import mongoose, { Schema } from 'mongoose'
const schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    banUsers: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
}, { timestamps: true });

const model = mongoose.model('Waiting', schema);

export default model