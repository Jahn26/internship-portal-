const styleMap = {
  Pending: 'bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/30',
  'In Progress': 'bg-sky-400/15 text-sky-300 ring-1 ring-sky-400/30',
  Completed: 'bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/30',
};

const StatusBadge = ({ status }) => (
  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styleMap[status] || styleMap.Pending}`}>
    {status}
  </span>
);

export default StatusBadge;
