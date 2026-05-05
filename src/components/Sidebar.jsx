import { NavLink } from 'react-router-dom';
import { FaChartLine, FaUtensils, FaReceipt, FaUsers, FaTags, FaCog } from 'react-icons/fa';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: FaChartLine },
  { label: 'Menu', to: '/admin/menu', icon: FaUtensils },
  { label: 'Orders', to: '/admin/orders', icon: FaReceipt },
  { label: 'Users', to: '/admin/users', icon: FaUsers },
  { label: 'Categories', to: '/admin/categories', icon: FaTags },
  { label: 'Settings', to: '/admin/settings', icon: FaCog },
];

const Sidebar = ({ open, onClose }) => {
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 transform bg-slate-950 text-slate-100 shadow-soft transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:block
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex h-full flex-col">
          <div className="px-6 py-8">
            <div className="text-xl font-semibold tracking-tight">Bingo Meal Admin</div>
            <p className="mt-2 text-sm text-slate-400">Merchant dashboard for menu, orders and users.</p>
          </div>
          <nav className="flex-1 space-y-1 px-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => onClose && onClose()} // Close mobile menu on navigation
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      isActive ? 'bg-slate-800 text-white shadow' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
          <div className="px-6 pb-6">
            <button
              type="button"
              onClick={() => setQuickActionsOpen(!quickActionsOpen)}
              className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-left text-sm text-slate-300 transition hover:bg-slate-800"
            >
              {quickActionsOpen ? 'Hide shortcuts' : 'Quick actions'}
            </button>
            <AnimatePresence>
              {quickActionsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-3 rounded-2xl bg-slate-900 p-4 text-slate-300"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Admin tips</p>
                  <ul className="mt-3 space-y-2 text-sm">
                    <li>Refresh orders anytime.</li>
                    <li>Keep menu items up to date.</li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
