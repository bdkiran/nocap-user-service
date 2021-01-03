const express = require('express');
const passport = require('passport');
var cors = require('cors')
const dotenv = require('dotenv');
const token = require("./src/token")

//Load in environment variables
dotenv.config()
require("./src/authProviders/google");
require('./src/authProviders/jwt');

//Initialize express and passport
var app = express();
app.use(passport.initialize());
//set to our nocap domain....
// var corsOptions = {
//     origin: 'http://example.com',
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
//   }
app.use(cors());
const port = 8001;

const generateUserToken = (req, res) => {
    const accessToken = token.generateAccessToken(req.user.user_id);
    //How do we want to send this back to the user?
    //Is the cookie the best way of doing this?
    res.cookie('id_token', accessToken, {maxAge: 10000})
    res.redirect('http://localhost:3000')
}

//Authentication path
app.get('/auth/google',
    passport.authenticate('google',
        { session: false, scope: ["profile"] })
);
//Redirect path
app.get('/auth/google/redir',
    passport.authenticate('google', {
        session: false,
        failureRedirect: 'http://localhost:3000/login',
     }),
    generateUserToken
);

//Check if token is within an expirary period
// const refreshAccessToken = (authHeader) => {
//     console.log("Attempting to refresh token")
//     //Extracts token from auth header
//     let tokenToCheck = authHeader.split(" ")[1];
//     //Checks if the token is within the refresh period
//     let toRefresh = token.isTokenRefresh(tokenToCheck);
//     if (!toRefresh) {
//         //in refresh period, send client new token
//         let accessToken = token.generateAccessToken(toRefresh);
//         return accessToken;
//     } else {
//         return null;
//     };
// };

app.get('/bootstrap',
    passport.authenticate(['jwt'], {session: false}),
    (req, res) => {
        console.log('bootstrap called');
        let accessToken = token.generateAccessToken(req.user.user_id);
        let response = {
            data: req.user,
            token: accessToken
        }
        res.send(response)
    }
);

/* TEST ROUTES */
//Service status
app.get('/', (req, res) => {
    //Do a database check...
    let response = {
        status: "online"
    }
    res.send(response)
})

//protected route
app.get('/api/secure',
    passport.authenticate(['jwt'], {session: false}),
    (req, res) => {
        res.send("Secure response from " + JSON.stringify(req.user));
    }
);

app.listen(port, () => {
    console.log(`Authentication Server is runinng on at http://localhost:${port}`);
});