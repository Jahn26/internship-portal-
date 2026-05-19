const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

let demoUsers = [];
let demoJobs = [];
let demoApplications = [];

const isDemoMode = () => !process.env.MONGO_URI || process.env.DEMO_MODE === 'true';
const toPlain = (value) => JSON.parse(JSON.stringify(value));
const createId = () => new mongoose.Types.ObjectId().toString();

const stripPassword = (user) => {
  if (!user) return null;
  const plain = toPlain(user);
  delete plain.password;
  return plain;
};

const findDemoUser = (id) => demoUsers.find((user) => String(user._id) === String(id));
const findDemoJob = (id) => demoJobs.find((job) => String(job._id) === String(id));

const resolveJob = (job) => {
  if (!job) return null;
  const plain = toPlain(job);
  plain.recruiter = stripPassword(findDemoUser(plain.recruiter));
  return plain;
};

const resolveApplication = (application) => {
  if (!application) return null;
  const plain = toPlain(application);
  plain.applicant = stripPassword(findDemoUser(plain.applicant));
  plain.job = resolveJob(findDemoJob(plain.job));
  return plain;
};

const matches = (record, filter = {}) =>
  Object.entries(filter).every(([key, value]) => String(record[key]) === String(value));

const hashPassword = async (password) => bcrypt.hash(password, 10);

const seedDemoData = async (seedUsers, seedJobs, seedApplications = []) => {
  if (!isDemoMode()) return;

  demoUsers = seedUsers.map((user) => ({
    ...user,
    email: user.email.toLowerCase(),
    _id: createId(),
    savedJobs: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  const recruiter = demoUsers.find((user) => user.role === 'recruiter');
  const applicant = demoUsers.find((user) => user.role === 'applicant');

  demoJobs = seedJobs.map((job, index) => ({
    ...job,
    _id: createId(),
    recruiter: recruiter._id,
    createdAt: new Date(Date.now() - index * 86400000),
    updatedAt: new Date(Date.now() - index * 86400000),
  }));

  if (applicant && demoJobs[0]) {
    applicant.savedJobs = [demoJobs[0]._id];
  }

  demoApplications = seedApplications.map((application, index) => ({
    ...application,
    _id: createId(),
    applicant: applicant._id,
    job: demoJobs[index % demoJobs.length]._id,
    createdAt: new Date(Date.now() - index * 43200000),
    updatedAt: new Date(Date.now() - index * 43200000),
  }));
};

const findUserByEmail = async (email, includePassword = false) => {
  if (!isDemoMode()) {
    const query = User.findOne({ email: email.toLowerCase() });
    return includePassword ? query.select('+password') : query.select('-password');
  }

  const user = demoUsers.find((entry) => entry.email === email.toLowerCase());
  return includePassword ? toPlain(user || null) : stripPassword(user);
};

const findUserById = async (id, includePassword = false) => {
  if (!isDemoMode()) {
    const query = User.findById(id);
    return includePassword ? query.select('+password') : query.select('-password');
  }

  const user = findDemoUser(id);
  return includePassword ? toPlain(user || null) : stripPassword(user);
};

const createUser = async (payload) => {
  if (!isDemoMode()) {
    return User.create({ ...payload, email: payload.email.toLowerCase() });
  }

  const user = {
    ...payload,
    email: payload.email.toLowerCase(),
    _id: createId(),
    savedJobs: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  demoUsers.push(user);
  return stripPassword(user);
};

const updateUser = async (id, payload) => {
  if (!isDemoMode()) {
    return User.findByIdAndUpdate(id, payload, { new: true }).select('-password');
  }

  const index = demoUsers.findIndex((user) => String(user._id) === String(id));
  if (index === -1) return null;
  demoUsers[index] = { ...demoUsers[index], ...payload, updatedAt: new Date() };
  return stripPassword(demoUsers[index]);
};

const listUsers = async (filter = {}) => {
  if (!isDemoMode()) {
    return User.find(filter).sort({ createdAt: -1 }).select('-password');
  }

  return demoUsers.filter((user) => matches(user, filter)).map(stripPassword);
};

const listJobs = async ({ search = '', jobType = '', recruiter = '' } = {}) => {
  if (!isDemoMode()) {
    const query = {};
    if (jobType) query.jobType = jobType;
    if (recruiter) query.recruiter = recruiter;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }
    return Job.find(query).sort({ createdAt: -1 }).populate('recruiter', 'name email role');
  }

  return demoJobs
    .filter((job) => (jobType ? job.jobType === jobType : true))
    .filter((job) => (recruiter ? String(job.recruiter) === String(recruiter) : true))
    .filter((job) => {
      if (!search) return true;
      const haystack = `${job.title} ${job.companyName} ${job.location}`.toLowerCase();
      return haystack.includes(search.toLowerCase());
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(resolveJob);
};

const findJobById = async (id) => {
  if (!isDemoMode()) {
    return Job.findById(id).populate('recruiter', 'name email role');
  }

  return resolveJob(findDemoJob(id));
};

const createJob = async (payload) => {
  if (!isDemoMode()) {
    const job = await Job.create(payload);
    return Job.findById(job._id).populate('recruiter', 'name email role');
  }

  const job = { ...payload, _id: createId(), createdAt: new Date(), updatedAt: new Date() };
  demoJobs.push(job);
  return resolveJob(job);
};

const updateJob = async (id, payload) => {
  if (!isDemoMode()) {
    return Job.findByIdAndUpdate(id, payload, { new: true }).populate('recruiter', 'name email role');
  }

  const index = demoJobs.findIndex((job) => String(job._id) === String(id));
  if (index === -1) return null;
  demoJobs[index] = { ...demoJobs[index], ...payload, updatedAt: new Date() };
  return resolveJob(demoJobs[index]);
};

const deleteJob = async (id) => {
  if (!isDemoMode()) {
    const job = await Job.findById(id);
    if (!job) return false;
    await Application.deleteMany({ job: id });
    await job.deleteOne();
    return true;
  }

  const before = demoJobs.length;
  demoJobs = demoJobs.filter((job) => String(job._id) !== String(id));
  demoApplications = demoApplications.filter((application) => String(application.job) !== String(id));
  return before !== demoJobs.length;
};

const toggleSavedJob = async (userId, jobId) => {
  if (!isDemoMode()) {
    const user = await User.findById(userId);
    if (!user) return null;
    const exists = user.savedJobs.some((id) => String(id) === String(jobId));
    user.savedJobs = exists ? user.savedJobs.filter((id) => String(id) !== String(jobId)) : [...user.savedJobs, jobId];
    await user.save();
    return User.findById(userId).select('-password').populate('savedJobs');
  }

  const user = findDemoUser(userId);
  if (!user) return null;
  const exists = user.savedJobs.some((id) => String(id) === String(jobId));
  user.savedJobs = exists ? user.savedJobs.filter((id) => String(id) !== String(jobId)) : [...user.savedJobs, jobId];
  return { ...stripPassword(user), savedJobs: user.savedJobs.map((id) => resolveJob(findDemoJob(id))) };
};

const getSavedJobs = async (userId) => {
  if (!isDemoMode()) {
    const user = await User.findById(userId).populate({ path: 'savedJobs', populate: { path: 'recruiter', select: 'name email role' } });
    return user?.savedJobs || [];
  }

  const user = findDemoUser(userId);
  return user ? user.savedJobs.map((id) => resolveJob(findDemoJob(id))).filter(Boolean) : [];
};

const createApplication = async (payload) => {
  if (!isDemoMode()) {
    const existing = await Application.findOne({ applicant: payload.applicant, job: payload.job });
    if (existing) return { duplicate: true, application: existing };
    const application = await Application.create(payload);
    return { application: await findApplicationById(application._id) };
  }

  const existing = demoApplications.find(
    (entry) => String(entry.applicant) === String(payload.applicant) && String(entry.job) === String(payload.job)
  );
  if (existing) return { duplicate: true, application: resolveApplication(existing) };

  const application = { ...payload, _id: createId(), status: 'Pending', createdAt: new Date(), updatedAt: new Date() };
  demoApplications.push(application);
  return { application: resolveApplication(application) };
};

const findApplicationById = async (id) => {
  if (!isDemoMode()) {
    return Application.findById(id)
      .populate('applicant', 'name email role headline skills resume')
      .populate({ path: 'job', populate: { path: 'recruiter', select: 'name email role' } });
  }

  return resolveApplication(demoApplications.find((entry) => String(entry._id) === String(id)));
};

const listApplications = async (filter = {}) => {
  if (!isDemoMode()) {
    return Application.find(filter)
      .sort({ createdAt: -1 })
      .populate('applicant', 'name email role headline skills resume')
      .populate({ path: 'job', populate: { path: 'recruiter', select: 'name email role' } });
  }

  return demoApplications
    .filter((application) => matches(application, filter))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(resolveApplication);
};

const updateApplication = async (id, payload) => {
  if (!isDemoMode()) {
    return Application.findByIdAndUpdate(id, payload, { new: true })
      .populate('applicant', 'name email role headline skills resume')
      .populate({ path: 'job', populate: { path: 'recruiter', select: 'name email role' } });
  }

  const index = demoApplications.findIndex((application) => String(application._id) === String(id));
  if (index === -1) return null;
  demoApplications[index] = { ...demoApplications[index], ...payload, updatedAt: new Date() };
  return resolveApplication(demoApplications[index]);
};

const countJobs = async (filter = {}) => (isDemoMode() ? demoJobs.filter((job) => matches(job, filter)).length : Job.countDocuments(filter));
const countApplications = async (filter = {}) =>
  isDemoMode() ? demoApplications.filter((application) => matches(application, filter)).length : Application.countDocuments(filter);

module.exports = {
  isDemoMode,
  seedDemoData,
  hashPassword,
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  listUsers,
  listJobs,
  findJobById,
  createJob,
  updateJob,
  deleteJob,
  toggleSavedJob,
  getSavedJobs,
  createApplication,
  findApplicationById,
  listApplications,
  updateApplication,
  countJobs,
  countApplications,
};
