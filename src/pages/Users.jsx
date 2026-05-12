import { useEffect, useMemo, useState } from 'react';
import { FaSearch, FaTrash, FaUserSlash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { deleteUser, fetchUsers, updateUserStatus } from '../services/api';
import ConfirmModal from '../components/ConfirmModal';
import { SkeletonTable } from '../components/SkeletonLoader';
import { EmptyState } from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetUser, setTargetUser] = useState(null);
  const [updatingUsers, setUpdatingUsers] = useState(new Set());

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
    setUpdatingUsers(prev => new Set(prev).add(user._id));
    try {
      await updateUserStatus(user._id, { active: !user.active });
      toast.success('User status updated');
      loadUsers();
    } catch (error) {
      toast.error('Unable to update user');
    } finally {
      setUpdatingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(user._id);
        return newSet;
      });
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
          {loading ? (
            <SkeletonTable rows={5} />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No users found"
              description={search ? "No users match your search criteria." : "No users have been registered yet."}
            />
          ) : (
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
                          disabled={updatingUsers.has(user._id)}
                          className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {updatingUsers.has(user._id) ? '...' : user.active ? 'Suspend' : 'Restore'}
                        </button>
                        <button
                          type="button"
                          onClick={() => confirmDelete(user)}
                          className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 shadow-sm transition-all hover:bg-red-100 hover:shadow-md active:scale-95"
                        >
                          <FaTrash className="mr-2 h-3 w-3" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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
