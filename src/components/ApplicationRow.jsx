const statusClass = {
  Pending: 'bg-amber-300/15 text-amber-200',
  Accepted: 'bg-emerald-300/15 text-emerald-200',
  Rejected: 'bg-rose-300/15 text-rose-200',
};

const ApplicationRow = ({ application, onStatusChange }) => (
  <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="font-semibold text-white">{application.job?.title}</p>
        <p className="text-sm text-slate-400">
          {application.applicant?.name} · {application.applicant?.email}
        </p>
        <p className="mt-1 text-sm text-slate-400">{application.job?.companyName}</p>
      </div>
      <span className={`rounded-md px-3 py-1 text-xs font-semibold ${statusClass[application.status]}`}>
        {application.status}
      </span>
    </div>
    <div className="mt-4 flex flex-wrap gap-2">
      {application.resumePath ? (
        <a className="btn-secondary py-2" href={`http://localhost:5000${application.resumePath}`} target="_blank" rel="noreferrer">
          View resume
        </a>
      ) : null}
      {onStatusChange ? (
        <select className="input-field max-w-40 py-2" value={application.status} onChange={(event) => onStatusChange(application._id, event.target.value)}>
          <option>Pending</option>
          <option>Accepted</option>
          <option>Rejected</option>
        </select>
      ) : null}
    </div>
  </div>
);

export default ApplicationRow;
