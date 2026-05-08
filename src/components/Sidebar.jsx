import { NavLink } from 'react-router-dom';
import { FaChartLine, FaUtensils, FaReceipt, FaUsers, FaTags, FaCog, FaChevronDown } from 'react-icons/fa';
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
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-slate-950 text-slate-100 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:block ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo/Branding */}
          <div className="border-b border-slate-800 px-6 py-6">
            <div className="text-lg font-bold tracking-tight text-white">Company's name Meal Admin</div>
            <p className="mt-2 text-xs text-slate-400">Merchant dashboard</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition duration-200 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Quick Actions */}
          <div className="border-t border-slate-800 px-3 py-4">
            <button
              type="button"
              onClick={() => setQuickActionsOpen(!quickActionsOpen)}
              className="flex w-full items-center justify-between rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-left text-sm font-medium text-slate-200 transition hover:bg-slate-800"
            >
              <span>Quick actions</span>
              <FaChevronDown
                className={`h-3 w-3 transition-transform ${
                  quickActionsOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            <AnimatePresence>
              {quickActionsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="mt-2 rounded-lg bg-slate-800 p-3"
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Admin tips</p>
                  <ul className="mt-2 space-y-1.5 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400" />
                      <span>Refresh orders anytime.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400" />
                      <span>Keep menu items up to date.</span>
                    </li>
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
