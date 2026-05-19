import { useEffect, useState } from 'react';
import api from '../api/axios';
import JobCard from '../components/JobCard';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const JobsPage = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', jobType: '' });

  const loadJobs = async () => {
    setLoading(true);
    const { data } = await api.get('/jobs', { params: filters });
    setJobs(data);
    setLoading(false);
  };

  useEffect(() => {
    loadJobs().catch(() => setLoading(false));
  }, []);

  const saveJob = async (jobId) => {
    try {
      await api.patch(`/users/saved-jobs/${jobId}`);
      toast.success('Saved jobs updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to save job');
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-teal-300">Open roles</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Browse jobs</h1>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); loadJobs(); }} className="flex flex-wrap gap-3">
          <input className="input-field min-w-64" placeholder="Search title, company, location" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
          <select className="input-field w-44" value={filters.jobType} onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}>
            <option value="">All types</option>
            <option>Internship</option>
            <option>Full-Time</option>
            <option>Part-Time</option>
            <option>Remote</option>
          </select>
          <button className="btn-primary">Search</button>
        </form>
      </div>
      {loading ? <Spinner label="Loading jobs..." /> : jobs.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              action={user?.role === 'applicant' ? <button className="btn-secondary py-2" onClick={() => saveJob(job._id)}>Save</button> : null}
            />
          ))}
        </div>
      ) : <EmptyState title="No jobs found" description="Try changing the search or job type filter." />}
    </main>
  );
};

export default JobsPage;
