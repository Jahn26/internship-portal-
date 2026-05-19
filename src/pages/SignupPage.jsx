import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import FormField from '../components/FormField';
import { useAuth } from '../context/AuthContext';
import { roleHomeRoute } from '../utils/formatters';

const SignupPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'applicant' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const user = await register(form);
      navigate(roleHomeRoute(user.role), { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-6xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
      <section>
        <p className="text-sm uppercase tracking-[0.25em] text-teal-300">Join HireDeck</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">Create an applicant or recruiter account</h1>
        <p className="mt-4 leading-7 text-slate-300">Applicants can save and apply to jobs. Recruiters can post roles and manage applicants.</p>
      </section>
      <form onSubmit={handleSubmit} className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
        <div className="space-y-4">
          <FormField label="Full name">
            <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </FormField>
          <FormField label="Email">
            <input className="input-field" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </FormField>
          <FormField label="Password">
            <input className="input-field" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </FormField>
          <FormField label="Role">
            <select className="input-field" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="applicant">Applicant</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </FormField>
          <button className="btn-primary w-full" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create account'}
          </button>
        </div>
        <p className="mt-5 text-center text-sm text-slate-400">
          Already registered? <Link className="text-teal-300" to="/login">Login</Link>
        </p>
      </form>
    </main>
  );
};

export default SignupPage;
