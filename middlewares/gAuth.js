const passport = require("passport");

const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "866791657515-u91vtv0p1aprkc18thi123bg1345gagk.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:7800/",
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(accessToken);
      console.log(refreshToken);

      return cb(err, profile);
    }
  )
);

passport.serializeUser(function(user,done){
    done(null,user);
})

passport.deserializeUser(function(user,done){
    done(null,user);
})
