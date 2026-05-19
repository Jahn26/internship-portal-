const { listJobs, findJobById, createJob, updateJob, deleteJob } = require('../services/store');

const normalizeRequirements = (requirements) => {
  if (Array.isArray(requirements)) return requirements;
  return String(requirements || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
};

const getJobs = async (req, res, next) => {
  try {
    const jobs = await listJobs({
      search: req.query.search,
      jobType: req.query.jobType,
      recruiter: req.query.recruiter,
    });
    res.json(jobs);
  } catch (error) {
    next(error);
  }
};

const getJobById = async (req, res, next) => {
  try {
    const job = await findJobById(req.params.id);
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }
    res.json(job);
  } catch (error) {
    next(error);
  }
};

const createJobHandler = async (req, res, next) => {
  try {
    const { title, companyName, location, salary, jobType, description, requirements } = req.body;

    if (!title || !companyName || !location || !salary || !jobType || !description) {
      res.status(400);
      throw new Error('Please provide all required job fields');
    }

    const job = await createJob({
      title,
      companyName,
      location,
      salary,
      jobType,
      description,
      requirements: normalizeRequirements(requirements),
      recruiter: req.user._id,
    });

    res.status(201).json(job);
  } catch (error) {
    next(error);
  }
};

const updateJobHandler = async (req, res, next) => {
  try {
    const job = await findJobById(req.params.id);
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }

    if (String(job.recruiter?._id || job.recruiter) !== String(req.user._id)) {
      res.status(403);
      throw new Error('You can only edit your own jobs');
    }

    const payload = { ...req.body };
    if (payload.requirements !== undefined) payload.requirements = normalizeRequirements(payload.requirements);

    const updatedJob = await updateJob(req.params.id, payload);
    res.json(updatedJob);
  } catch (error) {
    next(error);
  }
};

const deleteJobHandler = async (req, res, next) => {
  try {
    const job = await findJobById(req.params.id);
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }

    if (String(job.recruiter?._id || job.recruiter) !== String(req.user._id)) {
      res.status(403);
      throw new Error('You can only delete your own jobs');
    }

    await deleteJob(req.params.id);
    res.json({ message: 'Job deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob: createJobHandler,
  updateJob: updateJobHandler,
  deleteJob: deleteJobHandler,
};
