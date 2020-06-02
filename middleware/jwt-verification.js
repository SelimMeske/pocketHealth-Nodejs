const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    try {
        let token = req.headers.authorization.split(' ')[1];
        let decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userInfo = { userId: decode.id, username: decode.username };
        next();
    }catch (error){
        return res.status(401).json('Unauthorized user');
    }

}