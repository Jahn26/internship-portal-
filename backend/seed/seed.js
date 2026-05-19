require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { buildSeedUsers, jobs, applications } = require('../data/seedData');
const { seedDemoData, isDemoMode } = require('../services/store');

const seedDatabase = async () => {
  const seededUsers = await buildSeedUsers();

  if (isDemoMode()) {
    await seedDemoData(seededUsers, jobs, applications);
    console.log('Demo data seeded successfully');
    process.exit(0);
  }

  await connectDB();
  await Application.deleteMany();
  await Job.deleteMany();
  await User.deleteMany();

  const createdUsers = await User.insertMany(seededUsers);
  const recruiter = createdUsers.find((user) => user.role === 'recruiter');
  const applicant = createdUsers.find((user) => user.role === 'applicant');

  const createdJobs = await Job.insertMany(jobs.map((job) => ({ ...job, recruiter: recruiter._id })));
  applicant.savedJobs = [createdJobs[0]._id];
  await applicant.save();

  await Application.insertMany(
    applications.map((application, index) => ({
      ...application,
      applicant: applicant._id,
      job: createdJobs[index % createdJobs.length]._id,
    }))
  );

  console.log('Mongo database seeded successfully');
  process.exit(0);
};

seedDatabase().catch((error) => {
  console.error(error);
  process.exit(1);
});
