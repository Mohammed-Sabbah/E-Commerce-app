const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User'); // تأكد من صحة المسار

// ✅ Google Strategy
const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}/api/v1/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
            user = await User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                googleId: profile.id,
            });
        }
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// ✅ Facebook Strategy
const facebookStrategy = new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.BASE_URL}/api/v1/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'emails']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ facebookId: profile.id });
        if (!user) {
            user = await User.create({
                name: profile.displayName,
                email: profile.emails[0].value || '',
                facebookId: profile.id,
            });
        }
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

module.exports = {
    googleStrategy,
    facebookStrategy
}
