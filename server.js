const express = require('express');
const passport = require('passport');
var cors = require('cors')
const dotenv = require('dotenv');
const token = require("./src/token")

const userPersist = require('./src/persistUsers')

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
const port = 8080;

const 

const generateUserToken = (req, res) => {
    const accessToken = token.generateAccessToken(req.user.user_id);
    //How do we want to send this back to the user?
    //Is the cookie the best way of doing this?
    res.cookie('nocap_idToken', accessToken, {maxAge: 5000})
    res.redirect(process.env.REDIRECT_URL)
}

//Authentication path
app.get('/google',
    passport.authenticate('google',
        { session: false, scope: ['email', 'profile'] })
);
//Redirect path
app.get('/google/redir',
    passport.authenticate('google', {
        session: false,
        failureRedirect: `${process.env.REDIRECT_URL}/login`,
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
        let accessToken = token.generateAccessToken(req.user.user_id);
        let response = {
            data: req.user,
            token: accessToken
        }
        res.send(response)
    }
);

//CHeck if token matches the id query parameter
app.delete('/user/:id',
    passport.authenticate(['jwt'], {session: false}),
    async (req, res) => {
        if(req.params.id === req.user.user_id) {
            const dbres = await userPersist.deleteUserFromDB(req.user.user_id)
            if (dbres) {
                let response = {
                    data: {
                        message: "Successfully Deleted user"
                    }
                }
                res.send(response)
                return
            }
        }
        let response = {
            error: {
                message: "Unable to delete user"
            }
        }
        res.status(400)
        res.send(response)
    }
)

/* TEST ROUTES */
//Service status
app.get('/', (req, res) => {
    //Do a database check...
    let response = {
        status: "online"
    }
    res.send(response)
})

app.listen(port, async () => {
    console.log(`Authentication Server is runinng on at http://localhost:${port}`);
});