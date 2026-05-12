import { useEffect, useMemo, useState } from 'react';
import { FaCheckCircle, FaClock, FaTrash, FaTruck, FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { deleteOrder, fetchOrders, updateOrderStatus } from '../services/api';
import ConfirmModal from '../components/ConfirmModal';
import { SkeletonCard } from '../components/SkeletonLoader';
import { EmptyState } from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';

const statusOptions = ['Pending', 'Preparing', 'Delivered', 'Cancelled'];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetOrder, setTargetOrder] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [updatingOrders, setUpdatingOrders] = useState(new Set());

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (error) {
      toast.error('Unable to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (order, status) => {
    setUpdatingOrders(prev => new Set(prev).add(order._id));
    try {
      await updateOrderStatus(order._id, status);
      toast.success('Order status updated');
      loadOrders();
    } catch (error) {
      toast.error('Unable to update status');
    } finally {
      setUpdatingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(order._id);
        return newSet;
      });
    }
  };

  const scheduleDelete = (order) => {
    setTargetOrder(order);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!targetOrder) return;
    try {
      await deleteOrder(targetOrder._id);
      toast.success('Order deleted successfully');
      loadOrders();
    } catch (error) {
      toast.error('Unable to delete order');
    } finally {
      setConfirmOpen(false);
      setTargetOrder(null);
    }
  };

  const recentOrders = useMemo(() => orders.slice(0, 5), [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = !search ||
        order.customerName.toLowerCase().includes(search.toLowerCase()) ||
        order.phone.includes(search) ||
        order.location.toLowerCase().includes(search.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  if (loading) return <LoadingSpinner />;

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Order management</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950">Live order queue</h1>
          </div>
          <button
            type="button"
            onClick={loadOrders}
            className="rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Refresh orders
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-lg font-semibold text-slate-950">Orders</h2>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <FaSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search orders..."
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 md:w-80"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400"
              >
                <option value="all">All statuses</option>
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))
            ) : filteredOrders.length === 0 ? (
              <EmptyState
                title="No orders found"
                description={orders.length === 0 ? "Orders will appear here once customers start placing them." : "Try adjusting your search or filter criteria."}
              />
            ) : (
              <>
                {filteredOrders.map((order) => (
                  <div key={order._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-base font-semibold text-slate-950">{order.customerName}</p>
                        <p className="text-sm text-slate-600">{order.phone} • {order.location}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">KES {order.totalAmount}</span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{order.items.length} items</span>
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-700">{order.paymentStatus}</span>
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700">{order.status}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-2 text-sm text-slate-600">
                        <p>{order.items.map((item) => item.name).join(', ')}</p>
                        <p>Order created: {new Date(order.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {statusOptions.map((status) => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => handleStatusChange(order, status)}
                            disabled={updatingOrders.has(order._id)}
                            className={`inline-flex items-center rounded-full px-3 py-2 text-xs font-semibold shadow-sm transition-all hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 ${
                              order.status === status
                                ? 'bg-slate-900 text-white'
                                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {updatingOrders.has(order._id) ? '...' : status}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOrder(order);
                            setDetailsModalOpen(true);
                          }}
                          className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow-md active:scale-95"
                        >
                          View details
                        </button>
                        <button
                          type="button"
                          onClick={() => scheduleDelete(order)}
                          className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 shadow-sm transition-all hover:bg-red-100 hover:shadow-md active:scale-95"
                        >
                          <FaTrash className="mr-2 h-3 w-3" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Recent orders</h2>
          <div className="mt-5 space-y-3">
            {recentOrders.map((order) => (
              <div key={order._id} className="rounded-3xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">{order.customerName}</p>
                <p className="text-sm text-slate-600">{order.items.length} items — KES {order.totalAmount}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedOrder && detailsModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-900">Order Details</h3>
              <button
                type="button"
                onClick={() => setDetailsModalOpen(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500">Customer</p>
                <p className="mt-1 text-base font-medium text-slate-900">{selectedOrder.customerName}</p>
                <p className="text-sm text-slate-600">{selectedOrder.phone}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Delivery</p>
                <p className="mt-1 text-base font-medium text-slate-900">{selectedOrder.location}</p>
                <p className="text-sm text-slate-600">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Status</p>
                <p className="mt-1 text-base font-medium text-slate-900">{selectedOrder.status}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Payment</p>
                <p className="mt-1 text-base font-medium text-slate-900">{selectedOrder.paymentStatus}</p>
              </div>
            </div>
            <div className="mt-6 rounded-3xl bg-slate-50 p-4">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Items</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {selectedOrder.items.map((item, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{item.name} x{item.quantity || 1}</span>
                    <span>KES {item.price * (item.quantity || 1)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 border-t border-slate-200 pt-4">
                <div className="flex justify-between text-base font-semibold text-slate-900">
                  <span>Total</span>
                  <span>KES {selectedOrder.totalAmount}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <ConfirmModal
        open={confirmOpen}
        title="Delete order"
        description="Deleting an order is permanent. Continue?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </section>
  );
};

export default Orders;
