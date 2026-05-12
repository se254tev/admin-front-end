import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const Login = () => {
  const { login, loading } = useAuth();
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(credentials);
      toast.success('Welcome back, Admin');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Check credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-10 sm:px-8">
        <div className="space-y-6 rounded-3xl bg-slate-900/95 p-8 shadow-soft ring-1 ring-white/10 sm:p-10">
          <div className="space-y-3 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Bingo Meal Admin</p>
            <h1 className="text-3xl font-semibold text-white">Sign in to your dashboard</h1>
            <p className="mx-auto max-w-xl text-sm text-slate-400">
              Manage menu, orders, users and performance metrics for the Bingo Meal platform.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm text-slate-300">Email</span>
                <input
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-slate-500"
                  placeholder="Enter your email"
                />
              </label>
              <label className="block">
                <span className="text-sm text-slate-300">Password</span>
                <input
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-slate-500"
                  placeholder="••••••••"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-3xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
