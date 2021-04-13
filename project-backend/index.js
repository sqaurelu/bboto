import express, { Router } from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import multer from 'multer';

import User from './models/User.js';
import Post from './models/Post.js';
import Board from './models/Board.js';
import BoardComment from './models/Comment.js';
import PostComment from './models/PostComment.js';

import auth from './middleware/auth.js';

// app config
const app = express();
const port = process.env.PORT || 9000;

const TEST_USER = 'admin';
const PASSWORD = 'cHDyRsJLvnE1aQPr';

// DB config
const connection_url = `mongodb+srv://${TEST_USER}:${PASSWORD}@cluster0.wxb14.mongodb.net/test?retryWrites=true&w=majority`;

mongoose.connect(connection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

const upload = multer({});

app.post('/upload', upload.single('upload'), (req, res) => {
    console.log(req.body.email);
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            return res.status(404).json({
                uploadSuccess: false,
                message: err.message
            });
        }
        user.photo = req.file.buffer;
        user.save();
    })
}, (err, req, res, next) => res.status(404).send({ err: err.message }))

app.post('/register', (req, res) => {

    const user = new User(req.body);

    user.save((err, userInfo) => {
        if (err) {
            return res.json({ success: false, err });
        }
        return res.status(200).json({
            success: true
        })
    });
});

app.post('/login', (req, res) => {

    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            return res.status(404).json({
                loginSuccess: false,
                message: "Failed"
            });
        }

        user.comparePass(req.body.password, (err, isMatch) => {
            // 비밀번호 틀림
            if (!isMatch) {
                return res.json({ loginSuccess: false, message: "not correct password" });
            }

            // 비밀번호 맞음
            // token 생성 함수 -> jsonwebtoken 사용
            user.makeToken((err, user) => {
                if (err) {
                    return res.status(400).send(err);
                }

                // save token: 생성한 토큰을 쿠키에 저장 => cookie parser
                res.cookie("x_auth", user.token).status(200).json({ loginSuccess: true, id: user._id });
            });
        });
    });

});

app.get('/auth', auth, (req, res) => {
    // authenticate true
    res.status(200).json({
        _id: req.user._id,
        isAuth: true,
        email: req.user.email,
        name: req.user.name
    });
});

app.get('/logout', auth, (req, res) => {
    // console.log('logout(backend):: ', req.user);
    console.log(req.params);
    User.findOneAndUpdate({ _id: req.user._id }, { token: "" },
        (err, user) => {
            if (err) {
                return res.status(400).json({
                    success: false, err
                });
            }
            return res.status(200).send({
                success: true
            });
        });

});


// ################## post ##################
app.post('/createPost', upload.any(), (req, res) => {
    const photo = req.files[0].buffer;
    console.log(req.body);
    const post_ = new Post({
        title: req.body.title,
        description: req.body.description,
        writer: req.body.userId,
        upload: photo,
        site: req.body.site
    });

    post_.save((err, info) => {
        if (err) {
            return res.json({ success: false, err })
        }
        return res.status(200).json({
            success: true, info
        })
    })
})

app.get('/postList', (req, res) => {
    Post.find().populate('writer')
        .exec((err, posts) => {
            if (err) {
                return res.status(400).send(err);
            }
            res.status(200).json({ success: true, posts })
        });
});

// post 삭제
app.post('/postList/delete', (req, res) => {
    Post.deleteOne({ _id: req.body.postId }, (err, info) => {
        if (err) {
            return res.json({ success: false, err });
        }
        return res.status(200).json({
            success: true
        })
    })
})

app.post('/postList/getPostComment', (req, res) => {
    PostComment.find({ "postContents": req.body.postId })
        .populate('postContents')
        .populate('writer')
        .exec((err, postComments) => {
            if (err) {
                console.log('fsfds');
                console.log(err);
                return res.status(400).send(err);
            }
            res.status(200).json({ success: true, postComments });
        });
})

// Home에 있는 Post들의 댓글 저장
app.post('/postList/postComment', (req, res) => {
    const postComment = new PostComment({
        writer: req.body.userId,
        postContents: req.body.postId,
        comment: req.body.comment
    });

    postComment.save((err, info) => {
        if (err) {
            return res.json({ sucess: false }, err);
        }
        return res.status(200).json({
            success: true, info
        });
    });
})

// Home에 있는 Post들의 댓글 삭제
app.post('/board/postComment/delete', (req, res) => {
    PostComment.deleteOne({ _id: req.body.commentId }, (err, info) => {
        if (err) {
            return res.json({ success: false, err });
        }
        return res.status(200).json({
            success: true
        })
    })
})

// Home에 있는 Post들의 댓글 수정
app.post('/board/postComment/update', (req, res) => {
    const body = {
        board: req.body.boardId,
        writer: req.body.userId
    }

    PostComment.findOneAndUpdate(body, { comment: req.body.comment },
        (err, postComment) => {
            if (err) {
                return res.status(400).json({
                    success: false, err
                });
            }
            return res.status(200).send({
                success: true,
                postComment
            });
        });

});

// Filter
app.post('/filteredPost', (req, res) => {
    console.log(req.body);
    Post.find({ "site": req.body.site })
        .populate('writer')
        .exec((err, filteredPost) => {
            if (err) {
                console.log(err);
                return res.status(400).send(err);
            }
            res.status(200).json({ success: true, filteredPost });
        });
})

// board (함께가요)
app.post('/boardUpload', (req, res) => {
    console.log(req);
    const board = new Board({
        // body: { userId: 'userId', title: '타이틀이라네', description: '디스크립션' }
        writer: req.body.userId,
        title: req.body.title,
        description: req.body.description
    });

    board.save((err, info) => {
        if (err) {
            return res.json({ sucess: false }, err);
        }
        return res.status(200).json({
            success: true, info
        });
    });

});

app.get('/boardList', (req, res) => {
    Board.find().populate('writer')
        .exec((err, boards) => {
            if (err) {
                return res.status(400).send(err);
            }
            res.status(200).json({ success: true, boards });
        });
});

app.post('/board/getDetail', (req, res) => {
    Board.findOne({ "_id": req.body.boardId })
        .populate('writer')
        .exec((err, board) => {
            if (err) {
                return res.status(400).send(err);
            }
            res.status(200).json({ success: true, board });
        });
});

// board 글 삭제
app.post('/board/getDetail/delete', (req, res) => {
    Board.deleteOne({ _id: req.body.boardId }, (err, info) => {
        if (err) {
            return res.json({ success: false, err });
        }
        return res.status(200).json({
            success: true
        })
    })
})

// board 글 수정
app.post('/board/getDetail/update', (req, res) => {
    console.log(req.body);
    const body = {
        board: req.body.boardId,
        title: req.body.title,
        description: req.body.description
    }

    Board.findOneAndUpdate({ _id: req.body.boardId }, { title: req.body.title, description: req.body.description },
        (err, boardPost) => {
            if (err) {
                return res.status(400).json({
                    success: false, err
                });
            }
            return res.status(200).send({
                success: true,
                boardPost
            });
        });

})

app.post('/board/boardComment', (req, res) => {
    const boardComment = new BoardComment({
        writer: req.body.userId,
        board: req.body.boardId,
        comment: req.body.comment
    });

    boardComment.save((err, info) => {
        if (err) {
            return res.json({ sucess: false }, err);
        }
        return res.status(200).json({
            success: true, info
        });
    });
});

app.post('/board/getboardComment', (req, res) => {
    // console.log(req.body);
    BoardComment.find({ "board": req.body.boardId })
        .populate('board')
        .populate('writer')
        .exec((err, boardComments) => {
            console.log(boardComments);
            if (err) {
                return res.status(400).send(err);
            }
            res.status(200).json({ success: true, boardComments });
        });
});

// with 게시판 댓글 삭제
app.post('/board/boardComment/delete', (req, res) => {
    console.log(req.body);
    BoardComment.deleteOne({ _id: req.body.commentId }, (err, info) => {
        if (err) {
            return res.json({ success: false, err });
        }
        return res.status(200).json({
            success: true
        })
    })
})

// with 게시판 댓글 수정
app.post('/board/boardComment/update', (req, res) => {
    const body = {
        board: req.body.boardId,
        writer: req.body.userId
    }

    BoardComment.findOneAndUpdate(body, { comment: req.body.comment },
        (err, boardComment) => {
            if (err) {
                return res.status(400).json({
                    success: false, err
                });
            }
            return res.status(200).send({
                success: true,
                boardComment
            });
        });

})

// listen
app.listen(port, () => console.log(`Listening on localhost:${port}`));
