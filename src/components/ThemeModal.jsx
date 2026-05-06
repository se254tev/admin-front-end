import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';
import { updateThemeSettings } from '../services/api';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeModal = ({ open, onClose, initialTheme }) => {
  const { toggleTheme } = useTheme();

  const handleThemeChange = async (newTheme) => {
    try {
      await updateThemeSettings({ themePreference: newTheme });
      toggleTheme(newTheme);
      toast.success(`Theme changed to ${newTheme} mode`);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update theme');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
      >
        <h3 className="text-xl font-semibold text-slate-900">Theme Settings</h3>
        <p className="mt-2 text-sm text-slate-600">Choose your preferred theme</p>

        <div className="mt-6 space-y-3">
          {/* Light Mode */}
          <button
            onClick={() => handleThemeChange('light')}
            className={`w-full rounded-lg border-2 p-4 text-left transition ${
              initialTheme === 'light'
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-3 text-slate-600">
                <FaSun className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Light Mode</p>
                <p className="text-sm text-slate-600">Bright and clean interface</p>
              </div>
            </div>
          </button>

          {/* Dark Mode */}
          <button
            onClick={() => handleThemeChange('dark')}
            className={`w-full rounded-lg border-2 p-4 text-left transition ${
              initialTheme === 'dark'
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-900 p-3 text-slate-400">
                <FaMoon className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Dark Mode</p>
                <p className="text-sm text-slate-600">Easy on the eyes</p>
              </div>
            </div>
          </button>
        </div>

        {/* Actions */}
        <div className="mt-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-200"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ThemeModal;
