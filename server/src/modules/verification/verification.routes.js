const express = require('express');
const verificationController = require('./verification.controller');

const router = express.Router();

router.get('/confirm/:token', verificationController.confirmBeneficiary);

module.exports = router;
