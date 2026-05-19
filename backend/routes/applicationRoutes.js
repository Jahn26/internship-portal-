const express = require('express');
const {
  applyToJob,
  getMyApplications,
  getRecruiterApplications,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { uploadResume } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/jobs/:jobId/apply', protect, authorizeRoles('applicant'), uploadResume.single('resume'), applyToJob);
router.get('/my', protect, authorizeRoles('applicant'), getMyApplications);
router.get('/recruiter', protect, authorizeRoles('recruiter'), getRecruiterApplications);
router.patch('/:id/status', protect, authorizeRoles('recruiter'), updateApplicationStatus);

module.exports = router;
