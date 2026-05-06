import { FaBell, FaBars, FaSearch } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onMenuToggle }) => {
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:px-8">
        {/* Left section */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onMenuToggle}
            className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-600 transition hover:bg-slate-100 md:hidden"
            title="Toggle menu"
          >
            <FaBars className="h-4 w-4" />
          </button>
          <div className="hidden sm:block">
            <button className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
              Admin Panel
            </button>
          </div>
          <div className="relative hidden md:block">
            <FaSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search orders, menus…"
              className="rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-300 lg:w-80"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            className="rounded-lg bg-slate-950 p-2 text-white transition hover:bg-slate-800"
            title="Notifications"
          >
            <FaBell className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={logout}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <span className="hidden sm:inline">Logout</span>
            <span className="sm:hidden">Exit</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
