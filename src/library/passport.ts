import { User, UserAttributes } from "../config/models/user.model";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_AUTH_CLIENT,
      clientSecret: process.env.GOOGLE_AUTH_SCRET,
      callbackURL: process.env.BASE_URL + "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        // Check if the email is linked to an existing account
        const user = await User.findOne({ where: { email } });

        if (user) {
          // Link Google authentication to the existing account
          user.googleId = profile.id;
          await user.save();
          done(null, user);
        } else {
          // Create a new account and link Google authentication
          const newUser = new User({
            email,
            googleId: profile.id,
          });
          await newUser.save();
          done(null, newUser);
        }
      } catch (error) {
        console.error("Google authentication error:", error);
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user: UserAttributes, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findOne({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
