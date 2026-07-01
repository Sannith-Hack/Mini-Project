const express = require('express');
const router = express.Router();
const stressController = require('../controllers/stressController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/submit', authenticateToken, stressController.submitAssessment);
router.get('/history', authenticateToken, stressController.getHistory);
router.get('/admin-stats', stressController.getAdminStats);

module.exports = router;
