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
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails[0].value;
        const name = profile.displayName;

        // Find or create user based on Google ID or email
        db.query(
          'SELECT * FROM users WHERE google_id = ? OR email = ?',
          [googleId, email],
          async (err, rows) => {
            if (err) return done(err);
            if (rows.length) {
              // Existing user – ensure google_id stored
              if (!rows[0].google_id) {
                await db
                  .promise()
                  .query('UPDATE users SET google_id = ? WHERE id = ?', [googleId, rows[0].id]);
              }
              return done(null, rows[0]);
            }
            // New user – insert record (no password required)
            const result = await db
              .promise()
              .query(
                'INSERT INTO users (username, email, google_id) VALUES (?, ?, ?)',
                [name, email, googleId]
              );
            const newUser = {
              id: result[0].insertId,
              username: name,
              email,
            };
            done(null, newUser);
          }
        );
      } catch (e) {
        done(e);
      }
    }
  )
);

module.exports = passport;
