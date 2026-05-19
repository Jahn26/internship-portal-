import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import JobCard from '../components/JobCard';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';

const ManageJobsPage = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadJobs = async () => {
    const { data } = await api.get('/jobs', { params: { recruiter: user._id } });
    setJobs(data);
    setLoading(false);
  };

  useEffect(() => {
    loadJobs().catch(() => setLoading(false));
  }, []);

  const removeJob = async (jobId) => {
    await api.delete(`/jobs/${jobId}`);
    toast.success('Job deleted');
    loadJobs();
  };

  if (loading) return <Spinner label="Loading jobs..." />;

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <h1 className="text-3xl font-semibold text-white">Manage jobs</h1>
      {jobs.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              action={
                <>
                  <Link className="btn-secondary py-2" to={`/recruiter/jobs/${job._id}/edit`}>Edit</Link>
                  <button className="btn-secondary py-2" onClick={() => removeJob(job._id)}>Delete</button>
                </>
              }
            />
          ))}
        </div>
      ) : <EmptyState title="No jobs posted" description="Post your first role to start collecting applicants." />}
    </div>
  );
};

export default ManageJobsPage;
