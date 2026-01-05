const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// Device recommendation endpoint (RAG-based)
router.post('/recommendation', aiController.getRecommendation);

// Troubleshooting endpoint
router.post('/troubleshoot', aiController.getTroubleshooting);

module.exports = router;
