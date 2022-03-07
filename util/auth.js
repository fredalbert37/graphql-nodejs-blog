const jwt = require('jsonwebtoken');

const createJWTToken = user => {
    return jwt.sign({user}, 's3cR3tK3y', {
        expiresIn: '1d'
    })
}

module.exports = {createJWTToken}