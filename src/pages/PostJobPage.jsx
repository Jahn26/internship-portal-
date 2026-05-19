import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import FormField from '../components/FormField';

const defaultForm = {
  title: '',
  companyName: '',
  location: '',
  salary: '',
  jobType: 'Internship',
  description: '',
  requirements: '',
};

const PostJobPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await api.post('/jobs', form);
      toast.success('Job posted');
      navigate('/recruiter/jobs');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to post job');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-3xl font-semibold text-white">Post job</h1>
      <form onSubmit={submit} className="mt-5 grid gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-6 md:grid-cols-2">
        <FormField label="Title"><input className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></FormField>
        <FormField label="Company"><input className="input-field" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} /></FormField>
        <FormField label="Location"><input className="input-field" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></FormField>
        <FormField label="Salary/Stipend"><input className="input-field" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} /></FormField>
        <FormField label="Job type"><select className="input-field" value={form.jobType} onChange={(e) => setForm({ ...form, jobType: e.target.value })}><option>Internship</option><option>Full-Time</option><option>Part-Time</option><option>Remote</option></select></FormField>
        <FormField label="Description"><textarea className="input-field min-h-28" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></FormField>
        <div className="md:col-span-2">
          <FormField label="Requirements">
            <textarea className="input-field min-h-28" value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} placeholder="One requirement per line" />
          </FormField>
        </div>
        <button className="btn-primary md:col-span-2" disabled={saving}>{saving ? 'Posting...' : 'Post job'}</button>
      </form>
    </div>
  );
};

export default PostJobPage;
