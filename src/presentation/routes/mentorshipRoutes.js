const express = require('express');
const router = express.Router();
const { mentorshipController } = require('../controllers/MentorshipController');

router.all('*', mentorshipController.forward);

module.exports = router;
