import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const photoAppSchema = new Schema({
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    upload: {
        type: Buffer,
        required: true
    },
    site: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('postcontents', photoAppSchema);
