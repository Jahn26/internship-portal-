const express = require('express');
const { getJobs, getJobById, createJob, updateJob, deleteJob } = require('../controllers/jobController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(getJobs).post(protect, authorizeRoles('recruiter'), createJob);
router
  .route('/:id')
  .get(getJobById)
  .put(protect, authorizeRoles('recruiter'), updateJob)
  .delete(protect, authorizeRoles('recruiter'), deleteJob);

module.exports = router;
