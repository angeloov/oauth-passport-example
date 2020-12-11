"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var passport_google_oauth_1 = require("passport-google-oauth");
function default_1(passport) {
    console.log(process.env.GOOGLE_CLIENT_ID);
    passport.serializeUser(function (user, done) {
        // done(null, user.id);
        done(null, user);
    });
    passport.deserializeUser(function (obj, done) {
        // Users.findById(obj, done);
        done(null, obj);
    });
    passport.use(new passport_google_oauth_1.OAuth2Strategy({
        google: {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:4000/auth/callback',
        },
    }, function (accessToken, refreshToken, profile, done) {
        // Typically you would query the database to find the user record
        // associated with this Google profile, then pass that object to the `done`
        // callback.
        return done(null, profile);
    }));
}
exports.default = default_1;
