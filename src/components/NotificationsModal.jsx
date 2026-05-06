import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { updateNotificationSettings } from '../services/api';

const NotificationsModal = ({ open, onClose, initialData }) => {
  const [form, setForm] = useState({
    newOrders: true,
    deliveryUpdates: true,
    systemAnnouncements: true,
    emailAlerts: true
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData?.notifications) {
      setForm(initialData.notifications);
    }
  }, [initialData, open]);

  const handleToggle = (field) => {
    setForm((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateNotificationSettings(form);
      toast.success('Notification settings updated successfully');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update notification settings');
    } finally {
      setLoading(false);
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
        <h3 className="text-xl font-semibold text-slate-900">Notification Settings</h3>
        <p className="mt-2 text-sm text-slate-600">Control what notifications you receive</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* New Orders */}
          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
            <div>
              <p className="font-medium text-slate-900">New Orders</p>
              <p className="text-sm text-slate-600">Get notified when new orders arrive</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('newOrders')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                form.newOrders ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  form.newOrders ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Delivery Updates */}
          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
            <div>
              <p className="font-medium text-slate-900">Delivery Updates</p>
              <p className="text-sm text-slate-600">Updates on order delivery status</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('deliveryUpdates')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                form.deliveryUpdates ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  form.deliveryUpdates ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* System Announcements */}
          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
            <div>
              <p className="font-medium text-slate-900">System Announcements</p>
              <p className="text-sm text-slate-600">Important platform updates</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('systemAnnouncements')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                form.systemAnnouncements ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  form.systemAnnouncements ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Email Alerts */}
          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
            <div>
              <p className="font-medium text-slate-900">Email Alerts</p>
              <p className="text-sm text-slate-600">Receive notifications via email</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('emailAlerts')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                form.emailAlerts ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  form.emailAlerts ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default NotificationsModal;
