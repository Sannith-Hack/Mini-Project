const express = require('express');
const router = express.Router();
const stressController = require('../controllers/stressController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/submit', authenticateToken, stressController.submitAssessment);
router.get('/history', authenticateToken, stressController.getHistory);
router.get('/admin-stats', authenticateToken, stressController.getAdminStats);
router.get('/export-csv', authenticateToken, stressController.exportCSV);

module.exports = router;
