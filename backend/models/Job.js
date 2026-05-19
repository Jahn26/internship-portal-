const mongoose = require('mongoose');
const { JOB_TYPES } = require('../constants/portalConstants');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    salary: {
      type: String,
      required: [true, 'Salary or stipend is required'],
      trim: true,
    },
    jobType: {
      type: String,
      enum: JOB_TYPES,
      required: [true, 'Job type is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    requirements: {
      type: [String],
      default: [],
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Job', jobSchema);
