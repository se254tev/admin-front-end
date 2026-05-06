import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { fetchSettings } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import AccountModal from '../components/AccountModal';
import SecurityModal from '../components/SecurityModal';
import NotificationsModal from '../components/NotificationsModal';
import ThemeModal from '../components/ThemeModal';
import LoadingSpinner from '../components/LoadingSpinner';

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  // Modal states
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await fetchSettings();
      setSettings(data.user);
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Configuration</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">Platform settings</h1>
          </div>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {/* Account Card */}
        <button
          onClick={() => setShowAccountModal(true)}
          className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-slate-300 text-left"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-slate-900">Account</h2>
              <p className="mt-2 text-sm text-slate-600">Manage admin profile and notification preferences.</p>
              {settings?.name && <p className="mt-2 text-xs text-slate-500">{settings.name}</p>}
            </div>
            <div className="ml-4 inline-flex rounded-lg bg-blue-50 p-3 text-blue-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </button>

        {/* Security Card */}
        <button
          onClick={() => setShowSecurityModal(true)}
          className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-slate-300 text-left"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-slate-900">Security</h2>
              <p className="mt-2 text-sm text-slate-600">Update passwords, tokens, and session settings.</p>
              <p className="mt-2 text-xs text-slate-500">Last updated: {settings?.updatedAt ? new Date(settings.updatedAt).toLocaleDateString() : 'Never'}</p>
            </div>
            <div className="ml-4 inline-flex rounded-lg bg-amber-50 p-3 text-amber-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
        </button>

        {/* Notifications Card */}
        <button
          onClick={() => setShowNotificationsModal(true)}
          className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-slate-300 text-left"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
              <p className="mt-2 text-sm text-slate-600">Configure email alerts and order updates.</p>
              <p className="mt-2 text-xs text-slate-500">
                {settings?.notifications?.newOrders ? '✓ Orders enabled' : '✗ Orders disabled'}
              </p>
            </div>
            <div className="ml-4 inline-flex rounded-lg bg-emerald-50 p-3 text-emerald-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
          </div>
        </button>

        {/* Theme Card */}
        <button
          onClick={() => setShowThemeModal(true)}
          className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-slate-300 text-left"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-slate-900">Theme</h2>
              <p className="mt-2 text-sm text-slate-600">Switch between light and dark sidebar experience.</p>
              <p className="mt-2 text-xs text-slate-500 capitalize">Current: {theme} mode</p>
            </div>
            <div className="ml-4 inline-flex rounded-lg bg-indigo-50 p-3 text-indigo-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
          </div>
        </button>
      </div>

      {/* Modals */}
      <AccountModal
        open={showAccountModal}
        onClose={() => {
          setShowAccountModal(false);
          loadSettings();
        }}
        initialData={settings}
      />
      <SecurityModal open={showSecurityModal} onClose={() => setShowSecurityModal(false)} />
      <NotificationsModal
        open={showNotificationsModal}
        onClose={() => {
          setShowNotificationsModal(false);
          loadSettings();
        }}
        initialData={settings}
      />
      <ThemeModal
        open={showThemeModal}
        onClose={() => setShowThemeModal(false)}
        initialTheme={theme}
      />
    </div>
  );
};

export default Settings;