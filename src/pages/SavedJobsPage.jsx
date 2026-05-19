import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import JobCard from '../components/JobCard';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';

const SavedJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadJobs = async () => {
    const { data } = await api.get('/users/saved-jobs');
    setJobs(data);
    setLoading(false);
  };

  useEffect(() => {
    loadJobs().catch(() => setLoading(false));
  }, []);

  const unsave = async (jobId) => {
    await api.patch(`/users/saved-jobs/${jobId}`);
    toast.success('Removed from saved jobs');
    loadJobs();
  };

  if (loading) return <Spinner label="Loading saved jobs..." />;

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <h1 className="text-3xl font-semibold text-white">Saved jobs</h1>
      {jobs.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job) => <JobCard key={job._id} job={job} action={<button className="btn-secondary py-2" onClick={() => unsave(job._id)}>Unsave</button>} />)}
        </div>
      ) : <EmptyState title="No saved jobs" description="Save jobs from the listing page to revisit them here." />}
    </div>
  );
};

export default SavedJobsPage;
