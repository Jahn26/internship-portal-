const mongoose = require('mongoose');
const { APPLICATION_STATUSES } = require('../constants/portalConstants');

const applicationSchema = new mongoose.Schema(
  {
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    resumePath: {
      type: String,
      required: [true, 'Resume is required'],
    },
    status: {
      type: String,
      enum: APPLICATION_STATUSES,
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ applicant: 1, job: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
