import { useEffect, useMemo, useState } from 'react';
import { FaDollarSign, FaHamburger, FaShoppingCart, FaUsers } from 'react-icons/fa';
import { BarChart3 } from 'lucide-react';
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
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Dashboard</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">Welcome back, manager</h1>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
            <BarChart3 className="h-4 w-4" strokeWidth={1.5} />
            <span>Live analytics</span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <CardMetric title="Total orders" value={metrics?.totalOrders ?? 0} icon={<FaShoppingCart />} />
        <CardMetric title="Revenue" value={`KES ${metrics?.totalRevenue ?? 0}`} icon={<FaDollarSign />} />
        <CardMetric title="Total users" value={metrics?.totalUsers ?? 0} icon={<FaUsers />} />
        <CardMetric title="Total meals" value={metrics?.totalMeals ?? 0} icon={<FaHamburger />} />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Trend */}
        <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex-1">
            <h2 className="text-lg font-semibold text-slate-900">Revenue trend</h2>
            <p className="mt-1 text-sm text-slate-500">Recent performance over the last weeks.</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries} margin={{ top: 5, right: 15, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} width={40} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
                  }}
                />
                <Area type="monotone" dataKey="value" stroke="#0f172a" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Flow */}
        <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex-1">
            <h2 className="text-lg font-semibold text-slate-900">Order flow</h2>
            <p className="mt-1 text-sm text-slate-500">Unfolding order volume by day.</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ordersSeries} margin={{ top: 5, right: 15, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} width={40} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
                  }}
                />
                <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorOrders)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
