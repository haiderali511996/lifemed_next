'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import api from '@/lib/api';

const orderStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState('orders');

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(false);

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [authLoading, user, router]);

  const loadOrders = useCallback(() => {
    setOrdersLoading(true);
    setOrdersError(false);
    api
      .get('/orders')
      .then((res) => setOrders(res.data?.orders || []))
      .catch(() => setOrdersError(true))
      .finally(() => setOrdersLoading(false));
  }, []);

  const loadUsers = useCallback(() => {
    setUsersLoading(true);
    setUsersError(false);
    api
      .get('/admin/users')
      .then((res) => setUsers(res.data || []))
      .catch(() => setUsersError(true))
      .finally(() => setUsersLoading(false));
  }, []);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadOrders();
      loadUsers();
    }
  }, [user, loadOrders, loadUsers]);

  const updateOrderStatus = async (id, orderStatus) => {
    try {
      await api.put(`/orders/${id}`, { orderStatus });
      toast.success('Order status updated.');
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, orderStatus } : o)));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order.');
    }
  };

  const deleteOrder = async (id) => {
    if (!confirm('Delete this order permanently?')) return;
    try {
      await api.delete(`/orders/${id}`);
      toast.success('Order deleted.');
      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete order.');
    }
  };

  const updateUserRole = async (id, role) => {
    try {
      await api.put(`/admin/users/${id}/role`, { role });
      toast.success('User role updated.');
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user.');
    }
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user permanently?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted.');
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  if (authLoading || !user || user.role !== 'admin') {
    return (
      <div className="container state-box">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <AdminLayout tab={tab} onTabChange={setTab}>
      {tab === 'orders' && (
        <div>
          <h2>Orders</h2>
          {ordersLoading ? (
            <div className="state-box"><div className="spinner" /></div>
          ) : ordersError ? (
            <div className="state-box"><h3>Couldn&apos;t load orders</h3></div>
          ) : orders.length === 0 ? (
            <div className="state-box"><h3>No orders yet</h3></div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o._id}>
                      <td>{o.orderNumber}</td>
                      <td>{o.customer?.name}<br /><small>{o.customer?.email}</small></td>
                      <td>PKR {o.total?.toLocaleString()}</td>
                      <td><span className={`badge ${o.paymentStatus}`}>{o.paymentStatus}</span></td>
                      <td>
                        <select
                          value={o.orderStatus}
                          onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                        >
                          {orderStatuses.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => deleteOrder(o._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'users' && (
        <div>
          <h2>Users</h2>
          {usersLoading ? (
            <div className="state-box"><div className="spinner" /></div>
          ) : usersError ? (
            <div className="state-box"><h3>Couldn&apos;t load users</h3></div>
          ) : users.length === 0 ? (
            <div className="state-box"><h3>No users found</h3></div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Verified</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.isVerified ? 'Yes' : 'No'}</td>
                      <td>
                        <select value={u.role} onChange={(e) => updateUserRole(u._id, e.target.value)}>
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => deleteUser(u._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
