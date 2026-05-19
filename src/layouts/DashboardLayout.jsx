import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
  const { user, logout } = useAuth();

  const navItems =
    user?.role === 'recruiter'
      ? [
          { to: '/recruiter', label: 'Dashboard' },
          { to: '/recruiter/post-job', label: 'Post Job' },
          { to: '/recruiter/jobs', label: 'Manage Jobs' },
          { to: '/recruiter/applicants', label: 'Applicants' },
          { to: '/profile', label: 'Profile' },
        ]
      : [
          { to: '/applicant', label: 'Dashboard' },
          { to: '/jobs', label: 'Browse Jobs' },
          { to: '/applicant/saved', label: 'Saved Jobs' },
          { to: '/applicant/applied', label: 'Applied Jobs' },
          { to: '/profile', label: 'Profile' },
        ];

  return (
    <div className="min-h-screen lg:flex">
      <aside className="border-b border-white/10 bg-neutral-950/85 px-4 py-5 backdrop-blur-xl lg:w-72 lg:border-b-0 lg:border-r">
        <div className="rounded-lg border border-teal-300/20 bg-white/[0.04] p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-teal-300">HireDeck</p>
          <h1 className="mt-3 text-2xl font-semibold text-white">Job Portal</h1>
          <p className="mt-2 text-sm text-slate-400">{user?.role === 'recruiter' ? 'Recruiter workspace' : 'Applicant workspace'}</p>
        </div>

        <nav className="mt-5 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive ? 'bg-teal-300/15 text-teal-200' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.04] p-4">
          <p className="text-sm text-slate-400">Signed in as</p>
          <p className="mt-1 font-medium text-white">{user?.name}</p>
          <p className="truncate text-sm text-slate-400">{user?.email}</p>
          <button onClick={logout} className="btn-secondary mt-4 w-full">
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
