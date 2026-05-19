import { useEffect, useState } from 'react';
import api from '../api/axios';
import Spinner from '../components/Spinner';
import StatCard from '../components/StatCard';
import ApplicationRow from '../components/ApplicationRow';
import EmptyState from '../components/EmptyState';

const RecruiterDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/recruiter').then(({ data }) => setStats(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner label="Loading recruiter dashboard..." />;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-teal-300">Recruiter</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Jobs" value={stats.jobs} />
        <StatCard label="Applications" value={stats.applications} />
        <StatCard label="Pending" value={stats.pending} />
        <StatCard label="Accepted" value={stats.accepted} />
      </div>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">Recent applicants</h2>
        {stats.recentApplications.length ? stats.recentApplications.map((application) => (
          <ApplicationRow key={application._id} application={application} />
        )) : <EmptyState title="No applicants yet" description="Applications for your jobs will appear here." />}
      </section>
    </div>
  );
};

export default RecruiterDashboardPage;
