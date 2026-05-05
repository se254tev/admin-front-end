import { useEffect, useMemo, useState } from 'react';
import { FaCheckCircle, FaClock, FaTrash, FaTruck } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { deleteOrder, fetchOrders, updateOrderStatus } from '../services/api';
import ConfirmModal from '../components/ConfirmModal';
import LoadingSpinner from '../components/LoadingSpinner';

const statusOptions = ['Pending', 'Preparing', 'Delivered', 'Cancelled'];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetOrder, setTargetOrder] = useState(null);

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
    try {
      await updateOrderStatus(order._id, status);
      toast.success('Order status updated');
      loadOrders();
    } catch (error) {
      toast.error('Unable to update status');
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
          <h2 className="text-lg font-semibold text-slate-950">Orders</h2>
          <div className="mt-6 space-y-4">
            {orders.map((order) => (
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
                        className="rounded-2xl bg-white px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-100"
                      >
                        {status}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="rounded-2xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                    >
                      View details
                    </button>
                    <button
                      type="button"
                      onClick={() => scheduleDelete(order)}
                      className="rounded-2xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
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

      {selectedOrder && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Order details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
          </div>
          <div className="mt-5 rounded-3xl bg-slate-50 p-4">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Items</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {selectedOrder.items.map((item, index) => (
                <li key={index} className="flex justify-between">
                  <span>{item.name} x{item.quantity || 1}</span>
                  <span>KES {item.price}</span>
                </li>
              ))}
            </ul>
          </div>
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
