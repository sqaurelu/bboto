import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    board: {
        type: Schema.Types.ObjectId,
        ref: 'boards'
    },
    comment: {
        type: String,
        // required: true
    },
}, {
    timestamps: true
});

export default mongoose.model('comments', commentSchema);