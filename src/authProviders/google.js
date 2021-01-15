const passport = require('passport');
const googleStrategy = require('passport-google-oauth20').Strategy;

const users = require('../persistUsers');

passport.use(new googleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: `${process.env.REDIRECT_URL}/auth/google/redir`
},
    async (accessToken, refreshToken, profile, done) => {
        let user = await users.getSocialUserFromDb(profile.id, "google");
        if (!user) {
            user = await users.createGoogleUser(profile)
        }
        return done(null, user)
    })
);