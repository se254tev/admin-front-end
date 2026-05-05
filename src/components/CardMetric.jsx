const CardMetric = ({ title, value, icon, subtitle, color = 'bg-slate-50' }) => {
  return (
    <article className={`rounded-3xl border border-slate-200 ${color} p-5 shadow-sm`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
        </div>
        <div className="rounded-2xl bg-white p-3 text-slate-900 shadow-sm">{icon}</div>
      </div>
      {subtitle && <p className="mt-4 text-sm text-slate-500">{subtitle}</p>}
    </article>
  );
};

export default CardMetric;
