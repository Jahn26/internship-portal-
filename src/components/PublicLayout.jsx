import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { roleHomeRoute } from '../utils/formatters';

const PublicLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 bg-neutral-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="text-xl font-semibold text-white">
            HireDeck
          </Link>
          <nav className="flex items-center gap-2 text-sm">
            <NavLink to="/jobs" className="rounded-lg px-3 py-2 text-slate-300 hover:bg-white/5 hover:text-white">
              Jobs
            </NavLink>
            {user ? (
              <>
                <Link to={roleHomeRoute(user.role)} className="btn-secondary py-2">
                  Dashboard
                </Link>
                <button onClick={logout} className="btn-primary py-2">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary py-2">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary py-2">
                  Signup
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <Outlet />
    </div>
  );
};

export default PublicLayout;
