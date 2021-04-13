import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const boardAppSchema = new Schema({
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    title: {
        type: String,
        // required: true
    },
    description: {
        type: String,
        // required: true
    },
    comments: [
        {
            writer: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            },
            comment: {
                type: String,
                // required: true
            },
        }
    ]
}, {
    timestamps: true
});

export default mongoose.model('boards', boardAppSchema);