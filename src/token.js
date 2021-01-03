const JWT = require('jsonwebtoken')

const generateAccessToken = (userID) => {
    const expireIn = "7d"; //5 min expirary
    const audience = 'nocaplyrics.com';
    const secret = process.env.TOKEN_SECRET;
    //const issuer = 'auth-service';

    const token = JWT.sign({}, secret, {
        expiresIn: expireIn,
        audience: audience,
        //issuer: issuer,
        subject: userID.toString()
    })

    return token;
}

//Check if token is within expirary time
// const isTokenRefresh = (token) => {
//     let decodedToken = JWT.verify(token, 'mySecret')
//     let expiryTime = decodedToken.exp * 1000 - Date.now();
//     if (expiryTime > 30000) {
//         return decodedToken.sub;
//     } else {
//         return null;
//     }
// }

module.exports = { generateAccessToken };