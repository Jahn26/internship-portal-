import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <main className="flex min-h-screen items-center justify-center px-4">
    <div className="max-w-lg rounded-lg border border-white/10 bg-white/[0.04] p-8 text-center">
      <p className="text-sm uppercase tracking-[0.25em] text-teal-300">404</p>
      <h1 className="mt-4 text-3xl font-semibold text-white">Page not found</h1>
      <p className="mt-3 text-slate-400">That route is not part of this demo portal.</p>
      <Link className="btn-primary mt-6" to="/jobs">Browse jobs</Link>
    </div>
  </main>
);

export default NotFoundPage;
