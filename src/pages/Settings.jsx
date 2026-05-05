const Settings = () => {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Settings</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">Platform settings</h1>
          </div>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="font-semibold text-slate-900">Account</h2>
            <p className="mt-3 text-sm text-slate-600">Manage admin profile and notification preferences.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="font-semibold text-slate-900">Security</h2>
            <p className="mt-3 text-sm text-slate-600">Update passwords, tokens, and session settings.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="font-semibold text-slate-900">Notifications</h2>
            <p className="mt-3 text-sm text-slate-600">Configure email alerts and order updates.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="font-semibold text-slate-900">Theme</h2>
            <p className="mt-3 text-sm text-slate-600">Switch between light and dark sidebar experience.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Settings;
