import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const postCommentSchema = new Schema({
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    postContents: {
        type: Schema.Types.ObjectId,
        ref: 'postcontents'
    },
    comment: {
        type: String,
        // required: true
    },
}, {
    timestamps: true
});

export default mongoose.model('postcomments', postCommentSchema);
