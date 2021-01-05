const passport = require('passport');
const passportJWT = require('passport-jwt');
const users = require('../persistUsers');

const jwtOptions = {
    jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.TOKEN_SECRET,
    audience: 'nocaplyrics.com',
    //issuer: 'auth-service',
}

// var opts = {}
// opts.jwtFromRequest = passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = 'mySecret';
// //opts.issuer = 'accounts.examplesoft.com';
// opts.audience = 'nocaplyrics.com';

passport.use(new passportJWT.Strategy(jwtOptions,
    async (payload, done) => {
        let user = await users.getUserFromDb(payload.sub);
        //error check??
        if (!user) {
            return done(null, false);
        }
        if (user) {
            return done(null, user);
        }
    })
)
