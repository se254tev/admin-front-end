import { useEffect, useMemo, useState } from 'react';
import { FaDollarSign, FaHamburger, FaShoppingCart, FaUsers } from 'react-icons/fa';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { fetchDashboardMetrics } from '../services/api';
import CardMetric from '../components/CardMetric';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const data = await fetchDashboardMetrics();
        setMetrics(data);
      } catch (error) {
        toast.error('Unable to load dashboard metrics');
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, []);

  const revenueSeries = useMemo(
    () => metrics?.revenueChart || [],
    [metrics]
  );

  const ordersSeries = useMemo(
    () => metrics?.ordersChart || [],
    [metrics]
  );

  if (loading) return <LoadingSpinner />;

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Admin dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950">Welcome back, manager</h1>
          </div>
          <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Live analytics updated from backend data
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CardMetric title="Total orders" value={metrics?.totalOrders ?? 0} icon={<FaShoppingCart />} />
        <CardMetric title="Revenue" value={`KES ${metrics?.totalRevenue ?? 0}`} icon={<FaDollarSign />} />
        <CardMetric title="Total users" value={metrics?.totalUsers ?? 0} icon={<FaUsers />} />
        <CardMetric title="Total meals" value={metrics?.totalMeals ?? 0} icon={<FaHamburger />} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Revenue trend</h2>
              <p className="mt-1 text-sm text-slate-500">Recent performance over the last weeks.</p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#0f172a" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Order flow</h2>
              <p className="mt-1 text-sm text-slate-500">Unfolding order volume by day.</p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ordersSeries} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#2563eb" fillOpacity={1} fill="url(#colorOrders)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
