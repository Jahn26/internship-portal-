const StatCard = ({ label, value, hint }) => (
  <div className="glass-card rounded-lg p-5">
    <p className="text-sm text-slate-400">{label}</p>
    <div className="mt-2 text-3xl font-semibold text-white">{value}</div>
    {hint ? <p className="mt-2 text-xs text-slate-500">{hint}</p> : null}
  </div>
);

export default StatCard;
