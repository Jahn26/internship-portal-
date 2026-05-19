import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Spinner from '../components/Spinner';
import ApplicationRow from '../components/ApplicationRow';
import EmptyState from '../components/EmptyState';

const ApplicantsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadApplications = async () => {
    const { data } = await api.get('/applications/recruiter');
    setApplications(data);
    setLoading(false);
  };

  useEffect(() => {
    loadApplications().catch(() => setLoading(false));
  }, []);

  const changeStatus = async (applicationId, status) => {
    await api.patch(`/applications/${applicationId}/status`, { status });
    toast.success('Application updated');
    loadApplications();
  };

  if (loading) return <Spinner label="Loading applicants..." />;

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <h1 className="text-3xl font-semibold text-white">Applicants</h1>
      {applications.length ? applications.map((application) => (
        <ApplicationRow key={application._id} application={application} onStatusChange={changeStatus} />
      )) : <EmptyState title="No applicants yet" description="Applicants for your posted jobs will appear here." />}
    </div>
  );
};

export default ApplicantsPage;
