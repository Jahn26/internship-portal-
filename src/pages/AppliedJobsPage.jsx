import { useEffect, useState } from 'react';
import api from '../api/axios';
import Spinner from '../components/Spinner';
import ApplicationRow from '../components/ApplicationRow';
import EmptyState from '../components/EmptyState';

const AppliedJobsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/applications/my').then(({ data }) => setApplications(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner label="Loading applications..." />;

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <h1 className="text-3xl font-semibold text-white">Applied jobs</h1>
      {applications.length ? applications.map((application) => (
        <ApplicationRow key={application._id} application={application} />
      )) : <EmptyState title="No applications yet" description="Apply to a job and track its status here." />}
    </div>
  );
};

export default AppliedJobsPage;
