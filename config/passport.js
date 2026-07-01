const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../config/db'); // reuse your MySQL connection
const jwt = require('jsonwebtoken');

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
  db.query('SELECT * FROM users WHERE id = ?', [id], (err, rows) => {
    if (err) return done(err);
    done(null, rows[0]);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = (profile.emails && profile.emails[0]) ? profile.emails[0].value : null;
        const name = profile.displayName || `user_${googleId.slice(-6)}`;

        // Find or create user based on Google ID or email
        db.query(
          'SELECT * FROM users WHERE google_id = ? OR (? IS NOT NULL AND email = ?)',
          [googleId, email, email],
          async (err, rows) => {
            if (err) return done(err);
            try {
              if (rows && rows.length > 0) {
                // Existing user – ensure google_id stored
                if (!rows[0].google_id) {
                  await db
                    .promise()
                    .query('UPDATE users SET google_id = ? WHERE id = ?', [googleId, rows[0].id]);
                }
                return done(null, rows[0]);
              }
              
              // Check if username is taken by a different user
              let finalUsername = name;
              const [existingUser] = await db.promise().query('SELECT id FROM users WHERE username = ?', [finalUsername]);
              if (existingUser && existingUser.length > 0) {
                finalUsername = `${finalUsername}_${Math.floor(Math.random() * 10000)}`;
              }

              // New user – insert record (no password required)
              const result = await db
                .promise()
                .query(
                  'INSERT INTO users (username, email, google_id) VALUES (?, ?, ?)',
                  [finalUsername, email, googleId]
                );
              const newUser = {
                id: result[0].insertId,
                username: finalUsername,
                email,
              };
              done(null, newUser);
            } catch (innerErr) {
              done(innerErr);
            }
          }
        );
      } catch (e) {
        done(e);
      }
    }
  )
);

module.exports = passport;
