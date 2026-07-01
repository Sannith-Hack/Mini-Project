const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

// Initiate Google OAuth flow
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback – redirect to app with token and username
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login.html', session: false }),
  (req, res) => {
    const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_change_in_production';
    const token = jwt.sign({ id: req.user.id, username: req.user.username }, JWT_SECRET, { expiresIn: '2h' });
    res.redirect(`/index.html?token=${encodeURIComponent(token)}&username=${encodeURIComponent(req.user.username)}`);
  }
);

module.exports = router;
