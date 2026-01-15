const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { authenticate } = require('../middleware/auth');

// Device recommendation endpoint (RAG-based)
router.post('/recommendation', authenticate, aiController.getRecommendation);

// Troubleshooting endpoint
router.post('/troubleshoot', authenticate, aiController.getTroubleshooting);

module.exports = router;
