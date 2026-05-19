import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './components/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Spinner from './components/Spinner';
import { useAuth } from './context/AuthContext';
import { roleHomeRoute } from './utils/formatters';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import JobsPage from './pages/JobsPage';
import JobDetailsPage from './pages/JobDetailsPage';
import ApplicantDashboardPage from './pages/ApplicantDashboardPage';
import SavedJobsPage from './pages/SavedJobsPage';
import AppliedJobsPage from './pages/AppliedJobsPage';
import RecruiterDashboardPage from './pages/RecruiterDashboardPage';
import PostJobPage from './pages/PostJobPage';
import ManageJobsPage from './pages/ManageJobsPage';
import ApplicantsPage from './pages/ApplicantsPage';
import EditJobPage from './pages/EditJobPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

const RootRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner label="Restoring session..." />;
  return user ? <Navigate to={roleHomeRoute(user.role)} replace /> : <HomePage />;
};

const App = () => (
  <Routes>
    <Route element={<PublicLayout />}>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/jobs" element={<JobsPage />} />
      <Route path="/jobs/:id" element={<JobDetailsPage />} />
    </Route>

    <Route element={<ProtectedRoute />}>
      <Route element={<DashboardLayout />}>
        <Route path="/applicant" element={<ProtectedRoute allowedRoles={['applicant']} />}>
          <Route index element={<ApplicantDashboardPage />} />
          <Route path="saved" element={<SavedJobsPage />} />
          <Route path="applied" element={<AppliedJobsPage />} />
        </Route>
        <Route path="/recruiter" element={<ProtectedRoute allowedRoles={['recruiter']} />}>
          <Route index element={<RecruiterDashboardPage />} />
          <Route path="post-job" element={<PostJobPage />} />
          <Route path="jobs" element={<ManageJobsPage />} />
          <Route path="jobs/:id/edit" element={<EditJobPage />} />
          <Route path="applicants" element={<ApplicantsPage />} />
        </Route>
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Route>

    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default App;
