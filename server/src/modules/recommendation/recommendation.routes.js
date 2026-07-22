const express = require('express');
const router = express.Router();

// Placeholder endpoint for recommendations
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Recommendation service placeholder' });
});

module.exports = router;
