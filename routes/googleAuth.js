const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

// Initiate Google OAuth flow
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback – issue JWT for API usage
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id, username: req.user.username }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ success: true, token });
  }
);

module.exports = router;
