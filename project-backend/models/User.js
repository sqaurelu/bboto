import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jsonWebToken from 'jsonwebtoken';

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    token: {
        type: String
    },
});

// save가 일어나기 전에 비밀번호 암호화
userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

userSchema.methods.comparePass = function (password, callback) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err) {
            return callback(err);
        }
        return callback(null, isMatch);
    })
}

userSchema.methods.makeToken = function (callback) {
    const user = this;

    const token = jsonWebToken.sign(user._id.toHexString(), 'token');

    user.token = token;
    user.save((err, user) => {
        if (err) {
            return callback(err);
        };
        callback(null, user);
    })
}

userSchema.statics.findByToken = function (token, cb) {
    const user = this;

    jsonWebToken.verify(token, 'token', (err, userId) => {
        user.findOne({ "_id": userId, "token": token }, (err, user) => {
            if (err) {
                return cb(err);
            }
            cb(null, user);
        });
    })
}

export default mongoose.model('users', userSchema);