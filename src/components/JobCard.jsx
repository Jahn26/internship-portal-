import { Link } from 'react-router-dom';
import { formatDate } from '../utils/formatters';

const JobCard = ({ job, action }) => (
  <article className="rounded-lg border border-white/10 bg-white/[0.04] p-5 transition hover:border-teal-300/40">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="text-sm text-teal-300">{job.companyName}</p>
        <h3 className="mt-1 text-lg font-semibold text-white">{job.title}</h3>
      </div>
      <span className="rounded-md bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200">{job.jobType}</span>
    </div>
    <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-300">{job.description}</p>
    <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-400">
      <span>{job.location}</span>
      <span>{job.salary}</span>
      <span>Posted {formatDate(job.createdAt)}</span>
    </div>
    <div className="mt-5 flex flex-wrap gap-2">
      <Link to={`/jobs/${job._id}`} className="btn-primary py-2">
        View details
      </Link>
      {action}
    </div>
  </article>
);

export default JobCard;
