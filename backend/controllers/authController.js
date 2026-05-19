const bcrypt = require('bcryptjs');
const {
  findUserByEmail,
  findUserById,
  createUser,
  hashPassword,
} = require('../services/store');
const generateToken = require('../utils/generateToken');

const sendAuthResponse = (res, user) => {
  res.json({
    token: generateToken(user._id),
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      headline: user.headline,
      skills: user.skills || [],
      resume: user.resume || '',
      createdAt: user.createdAt,
    },
  });
};

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role = 'applicant' } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please provide name, email, and password');
    }

    if (!['applicant', 'recruiter'].includes(role)) {
      res.status(400);
      throw new Error('Invalid role selected');
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await createUser({
      name,
      email,
      password: await hashPassword(password),
      role,
      headline: '',
      skills: [],
      resume: '',
    });

    sendAuthResponse(res, user);
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    const user = await findUserByEmail(email, true);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401);
      throw new Error('Invalid credentials');
    }

    user.password = undefined;
    sendAuthResponse(res, user);
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await findUserById(req.user._id);
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
