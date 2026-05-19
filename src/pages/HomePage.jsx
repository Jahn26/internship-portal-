import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useEffect, useState } from 'react';
import JobCard from '../components/JobCard';

const HomePage = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    api.get('/jobs').then(({ data }) => setJobs(data.slice(0, 3))).catch(() => setJobs([]));
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid gap-8 py-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-teal-300">Internships and jobs</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold text-white sm:text-5xl">HireDeck</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            A focused demo portal where applicants discover roles, upload resumes, and recruiters manage hiring pipelines.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/jobs" className="btn-primary">
              Browse jobs
            </Link>
            <Link to="/signup" className="btn-secondary">
              Create account
            </Link>
          </div>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
          <div className="grid gap-3">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
