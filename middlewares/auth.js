const jwt = require('jsonwebtoken')

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    try {
        const verified = jwt.verify(token, 's3cR3tK3y');
        req.verifiedUser = verified.user;
        next();
    } catch (error) {
        console.log(error);
        next();
    }

}

module.exports = {authenticate}