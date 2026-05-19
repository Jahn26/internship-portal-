const { listUsers, updateUser, getSavedJobs, toggleSavedJob } = require('../services/store');

const getUsers = async (req, res, next) => {
  try {
    const users = await listUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res) => {
  res.json({ user: req.user });
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, headline, skills } = req.body;
    const payload = {};
    if (name !== undefined) payload.name = name;
    if (headline !== undefined) payload.headline = headline;
    if (skills !== undefined) {
      payload.skills = Array.isArray(skills) ? skills : String(skills).split(',').map((skill) => skill.trim()).filter(Boolean);
    }
    if (req.file) {
      payload.resume = `/uploads/resumes/${req.file.filename}`;
    }

    const user = await updateUser(req.user._id, payload);
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

const getSaved = async (req, res, next) => {
  try {
    const jobs = await getSavedJobs(req.user._id);
    res.json(jobs);
  } catch (error) {
    next(error);
  }
};

const saveJob = async (req, res, next) => {
  try {
    const user = await toggleSavedJob(req.user._id, req.params.jobId);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getProfile,
  updateProfile,
  getSaved,
  saveJob,
};
