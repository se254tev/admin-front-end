import { useEffect, useMemo, useState } from 'react';
import { FaSearch, FaTrash, FaUserSlash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { deleteUser, fetchUsers, updateUserStatus } from '../services/api';
import ConfirmModal from '../components/ConfirmModal';
import LoadingSpinner from '../components/LoadingSpinner';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetUser, setTargetUser] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data.users || data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    setFiltered(
      users.filter((user) =>
        [user.name, user.email, user.phone, user.role]
          .join(' ')
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    );
  }, [search, users]);

  const handleToggleStatus = async (user) => {
    try {
      await updateUserStatus(user._id, { active: !user.active });
      toast.success('User status updated');
      loadUsers();
    } catch (error) {
      toast.error('Unable to update user');
    }
  };

  const confirmDelete = (user) => {
    setTargetUser(user);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!targetUser) return;
    try {
      await deleteUser(targetUser._id);
      toast.success('User removed');
      loadUsers();
    } catch (error) {
      toast.error('Unable to delete user');
    } finally {
      setConfirmOpen(false);
      setTargetUser(null);
    }
  };

  const activeUsers = useMemo(() => users.filter((user) => user.active), [users]);

  if (loading) return <LoadingSpinner />;

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">User management</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950">Customers and accounts</h1>
          </div>
          <div className="text-sm text-slate-600">
            Active users: <span className="font-semibold text-slate-900">{activeUsers.length}</span>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">All users</h2>
            <p className="mt-1 text-sm text-slate-500">Search, review and manage your user base.</p>
          </div>
          <div className="relative w-full max-w-sm">
            <FaSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or phone"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400"
            />
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full table-auto border-collapse text-left text-sm text-slate-700">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user._id} className="border-b border-slate-200 bg-slate-50">
                  <td className="px-4 py-4 font-semibold text-slate-900">{user.name}</td>
                  <td className="px-4 py-4">{user.email}</td>
                  <td className="px-4 py-4">{user.phone}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs ${user.active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {user.active ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(user)}
                        className="rounded-2xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                      >
                        {user.active ? 'Suspend' : 'Restore'}
                      </button>
                      <button
                        type="button"
                        onClick={() => confirmDelete(user)}
                        className="rounded-2xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                      >
                        <FaTrash className="mr-2 inline" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Delete user"
        description="This will remove the user permanently from the platform. Continue?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </section>
  );
};

export default Users;
