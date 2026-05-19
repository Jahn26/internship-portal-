require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const { buildSeedUsers, jobs, applications } = require('./data/seedData');
const { seedDemoData, isDemoMode } = require('./services/store');

const PORT = process.env.PORT || 5000;

const loadDemoData = async () => {
  const seededUsers = await buildSeedUsers();
  await seedDemoData(seededUsers, jobs, applications);
};

const startServer = async () => {
  try {
    if (process.env.MONGO_URI) {
      await connectDB();
    } else {
      process.env.DEMO_MODE = 'true';
      console.log('Running in demo mode with in-memory data.');
    }

    if (isDemoMode()) {
      await loadDemoData();
    }

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    process.env.DEMO_MODE = 'true';
    console.log('Mongo connection failed, falling back to demo mode.');
    await loadDemoData();
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  }
};

startServer();
