const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const authRepository = require('../modules/auth/auth.repository');
const { STATUS, ROLES } = require('../modules/user/user.constants');
const User = require('../modules/user/user.model');
const { generateVolunteerId } = require('../utils/volunteerId');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'mock_client_id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'mock_client_secret',
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/v1/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails && profile.emails[0]?.value;
        const name = profile.displayName;
        const picture = profile.photos && profile.photos[0]?.value;

        if (!email) {
          return done(
            new Error('Google account must have an email address associated with it.'),
            null
          );
        }

        // 1. Check if user already exists by Google ID
        let user = await User.findOne({ googleId }).select('+refreshToken');
        if (user) {
          return done(null, user);
        }

        // 2. Check if user exists by email (to link account)
        user = await User.findOne({ email }).select('+refreshToken');
        if (user) {
          user.googleId = googleId;
          if (!user.profilePhoto) {
            user.profilePhoto = picture;
          }
          // Set status to active if linking account
          if (user.status === STATUS.PENDING) {
            user.status = STATUS.ACTIVE;
          }
          await user.save();
          return done(null, user);
        }

        // 3. Create a brand new Google user
        // Generate a unique username from email
        const baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
        let username = baseUsername;
        let isUsernameTaken = await authRepository.findByUsername(username);
        let counter = 1;

        while (isUsernameTaken) {
          username = `${baseUsername}${counter}`;
          isUsernameTaken = await authRepository.findByUsername(username);
          counter++;
        }

        const volunteerId = await generateVolunteerId();

        const newUser = await User.create({
          volunteerId,
          name,
          username,
          email,
          googleId,
          profilePhoto: picture,
          role: ROLES.VOLUNTEER,
          status: STATUS.ACTIVE, // Google verified email is active by default
        });

        // Fetch again to select necessary fields
        const createdUser = await User.findById(newUser._id).select('+refreshToken');
        return done(null, createdUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize user ID into session/token flows if needed by Passport
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
