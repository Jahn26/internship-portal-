const bcrypt = require('bcryptjs');

const users = [
  {
    name: 'Riya Applicant',
    email: 'applicant@hiredeck.dev',
    password: 'Applicant123!',
    role: 'applicant',
    headline: 'Frontend developer looking for product internships',
    skills: ['React', 'Tailwind CSS', 'Node.js'],
    resume: '',
  },
  {
    name: 'Arjun Recruiter',
    email: 'recruiter@hiredeck.dev',
    password: 'Recruiter123!',
    role: 'recruiter',
    headline: 'Campus hiring lead at NovaWorks',
    skills: [],
    resume: '',
  },
];

const jobs = [
  {
    title: 'Frontend Engineering Intern',
    companyName: 'NovaWorks',
    location: 'Bengaluru',
    salary: '₹25,000/month',
    jobType: 'Internship',
    description: 'Build modern product surfaces with React, Tailwind CSS, and REST APIs.',
    requirements: ['React fundamentals', 'Comfort with Git', 'Strong UI attention to detail'],
  },
  {
    title: 'Junior Full Stack Developer',
    companyName: 'CloudNest',
    location: 'Remote',
    salary: '₹7-10 LPA',
    jobType: 'Remote',
    description: 'Work across Node.js APIs and React dashboards for a fast-moving SaaS product.',
    requirements: ['Node.js and Express', 'MongoDB basics', 'React routing and state management'],
  },
  {
    title: 'Part-Time QA Analyst',
    companyName: 'BrightLoop',
    location: 'Hyderabad',
    salary: '₹18,000/month',
    jobType: 'Part-Time',
    description: 'Test web workflows, report issues clearly, and support release checks.',
    requirements: ['Manual testing basics', 'Clear bug reports', 'Basic API testing knowledge'],
  },
];

const applications = [
  {
    resumePath: '/uploads/resumes/demo-resume.pdf',
    status: 'Pending',
  },
];

const buildSeedUsers = async () =>
  Promise.all(
    users.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, 10),
    }))
  );

module.exports = {
  users,
  jobs,
  applications,
  buildSeedUsers,
};
