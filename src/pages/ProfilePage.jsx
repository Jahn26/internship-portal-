import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import FormField from '../components/FormField';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    headline: user?.headline || '',
    skills: user?.skills?.join(', ') || '',
  });
  const [resume, setResume] = useState(null);
  const [saving, setSaving] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('headline', form.headline);
      formData.append('skills', form.skills);
      if (resume) formData.append('resume', resume);
      await api.put('/users/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      await refreshUser();
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Profile update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-3xl font-semibold text-white">Profile</h1>
      <form onSubmit={submit} className="mt-5 space-y-4 rounded-lg border border-white/10 bg-white/[0.04] p-6">
        <FormField label="Name">
          <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </FormField>
        <FormField label="Headline">
          <input className="input-field" value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} />
        </FormField>
        <FormField label="Skills">
          <input className="input-field" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
        </FormField>
        {user?.role === 'applicant' ? (
          <FormField label="Resume PDF">
            <input className="block w-full text-sm text-slate-300 file:mr-4 file:rounded-md file:border-0 file:bg-teal-400 file:px-4 file:py-2 file:font-semibold file:text-neutral-950" type="file" accept="application/pdf" onChange={(e) => setResume(e.target.files?.[0])} />
          </FormField>
        ) : null}
        <button className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save profile'}</button>
      </form>
    </div>
  );
};

export default ProfilePage;
