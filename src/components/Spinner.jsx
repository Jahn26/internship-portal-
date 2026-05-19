const Spinner = ({ label = 'Loading...' }) => (
  <div className="flex items-center justify-center py-12 text-slate-300">
    <div className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
    <span className="ml-3 text-sm">{label}</span>
  </div>
);

export default Spinner;
