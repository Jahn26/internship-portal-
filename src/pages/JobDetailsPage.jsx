import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatters';

const JobDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    api.get(`/jobs/${id}`).then(({ data }) => setJob(data)).finally(() => setLoading(false));
  }, [id]);

  const apply = async (event) => {
    event.preventDefault();
    setApplying(true);
    try {
      const formData = new FormData();
      if (resume) formData.append('resume', resume);
      await api.post(`/applications/jobs/${id}/apply`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Application submitted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Application failed');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <Spinner label="Loading job..." />;
  if (!job) return null;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-teal-300">{job.companyName}</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">{job.title}</h1>
            <p className="mt-2 text-slate-400">{job.location} · {job.salary} · {job.jobType} · Posted {formatDate(job.createdAt)}</p>
          </div>
        </div>
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-white">Description</h2>
          <p className="mt-3 leading-7 text-slate-300">{job.description}</p>
        </section>
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-white">Requirements</h2>
          <ul className="mt-3 space-y-2 text-slate-300">
            {job.requirements?.map((item) => <li key={item}>- {item}</li>)}
          </ul>
        </section>
        {user?.role === 'applicant' ? (
          <form onSubmit={apply} className="mt-8 rounded-lg border border-white/10 bg-neutral-950/60 p-4">
            <label className="block text-sm font-medium text-slate-300">Resume PDF</label>
            <input className="mt-2 block w-full text-sm text-slate-300 file:mr-4 file:rounded-md file:border-0 file:bg-teal-400 file:px-4 file:py-2 file:font-semibold file:text-neutral-950" type="file" accept="application/pdf" onChange={(e) => setResume(e.target.files?.[0])} />
            <button className="btn-primary mt-4" disabled={applying}>{applying ? 'Applying...' : 'Apply now'}</button>
          </form>
        ) : null}
      </div>
    </main>
  );
};

export default JobDetailsPage;
