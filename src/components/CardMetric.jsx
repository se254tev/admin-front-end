const CardMetric = ({ title, value, icon, subtitle, color = 'bg-white' }) => {
  return (
    <article className={`group rounded-xl border border-slate-200 ${color} p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">{value}</p>
        </div>
        <div className="ml-4 flex-shrink-0 rounded-lg bg-slate-100 p-3 text-slate-600 group-hover:bg-slate-200 transition">
          {icon}
        </div>
      </div>
      {subtitle && <p className="mt-4 text-sm text-slate-600">{subtitle}</p>}
    </article>
  );
};

export default CardMetric;
