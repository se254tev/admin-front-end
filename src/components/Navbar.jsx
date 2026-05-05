import { FaBell, FaSearch } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 px-4 py-4 md:px-6">
        <div className="flex items-center gap-3 text-slate-900">
          <button className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold transition hover:bg-slate-100">
            Admin Panel
          </button>
          <div className="relative hidden md:block">
            <FaSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search orders, menus…"
              className="w-72 rounded-2xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-2xl bg-slate-950 px-3 py-2 text-white transition hover:bg-slate-800">
            <FaBell className="inline h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={logout}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
