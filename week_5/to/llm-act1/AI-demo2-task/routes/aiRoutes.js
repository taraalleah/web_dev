const express = require('express');
const router = express.Router();

const { generateText, generateTourSuggestion } = require('../controllers/tourController');

router.post('/generate-text-v2', generateText);
router.post('/tour-suggestions', generateTourSuggestion);

module.exports = router;