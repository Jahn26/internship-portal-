const {
  createApplication,
  listApplications,
  findApplicationById,
  updateApplication,
  findJobById,
  countJobs,
  countApplications,
} = require('../services/store');

const applyToJob = async (req, res, next) => {
  try {
    const job = await findJobById(req.params.jobId);
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }

    const resumePath = req.file ? `/uploads/resumes/${req.file.filename}` : req.user.resume;
    if (!resumePath) {
      res.status(400);
      throw new Error('Please upload a PDF resume');
    }

    const result = await createApplication({
      applicant: req.user._id,
      job: req.params.jobId,
      resumePath,
      status: 'Pending',
    });

    if (result.duplicate) {
      res.status(400);
      throw new Error('You have already applied to this job');
    }

    res.status(201).json(result.application);
  } catch (error) {
    next(error);
  }
};

const getMyApplications = async (req, res, next) => {
  try {
    const applications = await listApplications({ applicant: req.user._id });
    res.json(applications);
  } catch (error) {
    next(error);
  }
};

const getRecruiterApplications = async (req, res, next) => {
  try {
    const applications = await listApplications();
    const ownApplications = applications.filter((application) => String(application.job?.recruiter?._id) === String(req.user._id));
    res.json(ownApplications);
  } catch (error) {
    next(error);
  }
};

const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Accepted', 'Rejected'].includes(status)) {
      res.status(400);
      throw new Error('Invalid application status');
    }

    const application = await findApplicationById(req.params.id);
    if (!application) {
      res.status(404);
      throw new Error('Application not found');
    }

    if (String(application.job?.recruiter?._id) !== String(req.user._id)) {
      res.status(403);
      throw new Error('You can only manage applicants for your jobs');
    }

    const updatedApplication = await updateApplication(req.params.id, { status });
    res.json(updatedApplication);
  } catch (error) {
    next(error);
  }
};

const getApplicantStats = async (req, res, next) => {
  try {
    const applications = await listApplications({ applicant: req.user._id });
    res.json({
      applications: applications.length,
      accepted: applications.filter((item) => item.status === 'Accepted').length,
      pending: applications.filter((item) => item.status === 'Pending').length,
      recentApplications: applications.slice(0, 5),
    });
  } catch (error) {
    next(error);
  }
};

const getRecruiterStats = async (req, res, next) => {
  try {
    const applications = await listApplications();
    const ownApplications = applications.filter((application) => String(application.job?.recruiter?._id) === String(req.user._id));
    res.json({
      jobs: await countJobs({ recruiter: req.user._id }),
      applications: ownApplications.length,
      pending: ownApplications.filter((item) => item.status === 'Pending').length,
      accepted: ownApplications.filter((item) => item.status === 'Accepted').length,
      recentApplications: ownApplications.slice(0, 5),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyToJob,
  getMyApplications,
  getRecruiterApplications,
  updateApplicationStatus,
  getApplicantStats,
  getRecruiterStats,
};
