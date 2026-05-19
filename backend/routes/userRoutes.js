const express = require('express');
const { getUsers, getProfile, updateProfile, getSaved, saveJob } = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { uploadResume } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/', protect, authorizeRoles('recruiter'), getUsers);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, uploadResume.single('resume'), updateProfile);
router.get('/saved-jobs', protect, authorizeRoles('applicant'), getSaved);
router.patch('/saved-jobs/:jobId', protect, authorizeRoles('applicant'), saveJob);

module.exports = router;
