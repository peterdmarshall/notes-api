const jwt = require('jsonwebtoken');


async function getToken(ctx, userData, secret) {
    return new Promise(function(resolve, reject) {
        const token = jwt.sign(userData, secret);
        if(token) {
            resolve(ctx.response.body = token);
        } else {
            reject(Error("Token not created"));
        }
    });
}

async function verifyToken(jwtToken, secret) {
    return new Promise(function(resolve, reject) {
        jwt.verify(jwtToken, secret, function(err, decoded) {
            if(decoded) {
                resolve(decoded);
            } else {
                reject(Error("Token could not be verified"));
            }
        });
    })
}

module.exports = {getToken, verifyToken};
