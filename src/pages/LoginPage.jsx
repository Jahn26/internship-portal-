import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import FormField from '../components/FormField';
import { useAuth } from '../context/AuthContext';
import { roleHomeRoute } from '../utils/formatters';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: 'applicant@hiredeck.dev', password: 'Applicant123!' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const user = await login(form);
      navigate(roleHomeRoute(user.role), { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-6xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
      <section>
        <p className="text-sm uppercase tracking-[0.25em] text-teal-300">Welcome back</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">Sign in to HireDeck</h1>
        <p className="mt-4 text-slate-300">Applicant: applicant@hiredeck.dev / Applicant123!</p>
        <p className="mt-1 text-slate-300">Recruiter: recruiter@hiredeck.dev / Recruiter123!</p>
      </section>
      <form onSubmit={handleSubmit} className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
        <div className="space-y-4">
          <FormField label="Email">
            <input className="input-field" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </FormField>
          <FormField label="Password">
            <input className="input-field" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </FormField>
          <button className="btn-primary w-full" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Login'}
          </button>
        </div>
        <p className="mt-5 text-center text-sm text-slate-400">
          New here? <Link className="text-teal-300" to="/signup">Create an account</Link>
        </p>
      </form>
    </main>
  );
};

export default LoginPage;
