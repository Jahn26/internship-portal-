const express = require('express');
const { getApplicantStats, getRecruiterStats } = require('../controllers/applicationController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/applicant', protect, authorizeRoles('applicant'), getApplicantStats);
router.get('/recruiter', protect, authorizeRoles('recruiter'), getRecruiterStats);

module.exports = router;
