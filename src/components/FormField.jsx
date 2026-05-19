const FormField = ({ label, children, hint }) => (
  <label className="block">
    <span className="mb-2 block text-sm font-medium text-slate-300">{label}</span>
    {children}
    {hint ? <span className="mt-2 block text-xs text-slate-500">{hint}</span> : null}
  </label>
);

export default FormField;
