import User from "../models/User.js";

// 인증 처리
const auth = (req, res, next) => {
    // client cookie에서 token을 가져옴. by using cookie parser
    const token = req.cookies.x_auth;

    // console.log('token:: ', req.cookies);

    User.findByToken(token, (err, user) => {
        if (err) {
            throw err;
        }
        if (!user) {
            return res.json({ isAuth: false, error: true })
        }

        req.token = token;
        req.user = user;
        next();
    })

}

export default auth;