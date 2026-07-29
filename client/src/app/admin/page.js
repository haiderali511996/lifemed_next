'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import api from '@/lib/api';

const orderStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const emptyProductForm = {
  name: '', slug: '', description: '', shortDescription: '', price: '', salePrice: '',
  category: '', subCategory: '', images: '', stock: '', sku: '', manufacturer: '',
  isFeatured: false, isActive: true, tags: '',
};

const emptyCategoryForm = {
  name: '', slug: '', icon: '', description: '', color: '#1a4fa8', isActive: true,
};

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

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(false);
  const [productForm, setProductForm] = useState(null);

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(false);
  const [categoryForm, setCategoryForm] = useState(null);

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

  const loadProducts = useCallback(() => {
    setProductsLoading(true);
    setProductsError(false);
    api
      .get('/products', { params: { limit: 200 } })
      .then((res) => setProducts(res.data?.products || []))
      .catch(() => setProductsError(true))
      .finally(() => setProductsLoading(false));
  }, []);

  const loadCategories = useCallback(() => {
    setCategoriesLoading(true);
    setCategoriesError(false);
    api
      .get('/categories')
      .then((res) => setCategories(res.data || []))
      .catch(() => setCategoriesError(true))
      .finally(() => setCategoriesLoading(false));
  }, []);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadOrders();
      loadUsers();
      loadProducts();
      loadCategories();
    }
  }, [user, loadOrders, loadUsers, loadProducts, loadCategories]);

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

  const openNewProduct = () => setProductForm({ ...emptyProductForm });

  const openEditProduct = (p) => setProductForm({
    _id: p._id,
    name: p.name || '',
    slug: p.slug || '',
    description: p.description || '',
    shortDescription: p.shortDescription || '',
    price: p.price ?? '',
    salePrice: p.salePrice ?? '',
    category: p.category || '',
    subCategory: p.subCategory || '',
    images: (p.images || []).join(', '),
    stock: p.stock ?? '',
    sku: p.sku || '',
    manufacturer: p.manufacturer || '',
    isFeatured: !!p.isFeatured,
    isActive: p.isActive !== false,
    tags: (p.tags || []).join(', '),
  });

  const saveProduct = async (e) => {
    e.preventDefault();
    const { _id, ...rest } = productForm;
    const payload = {
      ...rest,
      price: Number(rest.price) || 0,
      salePrice: rest.salePrice === '' ? undefined : Number(rest.salePrice),
      stock: rest.stock === '' ? undefined : Number(rest.stock),
      images: rest.images.split(',').map((s) => s.trim()).filter(Boolean),
      tags: rest.tags.split(',').map((s) => s.trim()).filter(Boolean),
    };
    try {
      if (_id) {
        const res = await api.put(`/products/${_id}`, payload);
        setProducts((prev) => prev.map((p) => (p._id === _id ? res.data : p)));
        toast.success('Product updated.');
      } else {
        const res = await api.post('/products', payload);
        setProducts((prev) => [res.data, ...prev]);
        toast.success('Product created.');
      }
      setProductForm(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product.');
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm('Remove this product? It will be hidden from the shop.')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product removed.');
      setProducts((prev) => prev.map((p) => (p._id === id ? { ...p, isActive: false } : p)));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove product.');
    }
  };

  const openNewCategory = () => setCategoryForm({ ...emptyCategoryForm });

  const openEditCategory = (c) => setCategoryForm({
    _id: c._id,
    name: c.name || '',
    slug: c.slug || '',
    icon: c.icon || '',
    description: c.description || '',
    color: c.color || '#1a4fa8',
    isActive: c.isActive !== false,
  });

  const saveCategory = async (e) => {
    e.preventDefault();
    const { _id, ...payload } = categoryForm;
    try {
      if (_id) {
        const res = await api.put(`/categories/${_id}`, payload);
        setCategories((prev) => prev.map((c) => (c._id === _id ? res.data : c)));
        toast.success('Category updated.');
      } else {
        const res = await api.post('/categories', payload);
        setCategories((prev) => [...prev, res.data]);
        toast.success('Category created.');
      }
      setCategoryForm(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save category.');
    }
  };

  const deleteCategory = async (id) => {
    if (!confirm('Delete this category permanently?')) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Category deleted.');
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete category.');
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

      {tab === 'products' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ margin: 0 }}>Products</h2>
            <button className="btn btn-primary btn-sm" onClick={openNewProduct}>+ New Product</button>
          </div>

          {productForm && (
            <form className="form-card" style={{ margin: '0 0 24px', maxWidth: 640 }} onSubmit={saveProduct}>
              <h3>{productForm._id ? 'Edit Product' : 'New Product'}</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input required value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Slug</label>
                  <input required value={productForm.slug} onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Short Description</label>
                <input value={productForm.shortDescription} onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea required rows={3} value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price (PKR)</label>
                  <input required type="number" min="0" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Sale Price (optional)</label>
                  <input type="number" min="0" value={productForm.salePrice} onChange={(e) => setProductForm({ ...productForm, salePrice: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select required value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}>
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Sub-category</label>
                  <input value={productForm.subCategory} onChange={(e) => setProductForm({ ...productForm, subCategory: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Stock</label>
                  <input type="number" min="0" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>SKU</label>
                  <input value={productForm.sku} onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Manufacturer</label>
                <input value={productForm.manufacturer} onChange={(e) => setProductForm({ ...productForm, manufacturer: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Image URLs (comma-separated)</label>
                <input value={productForm.images} onChange={(e) => setProductForm({ ...productForm, images: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Tags (comma-separated)</label>
                <input value={productForm.tags} onChange={(e) => setProductForm({ ...productForm, tags: e.target.value })} />
              </div>
              <div className="form-row">
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" checked={productForm.isFeatured} onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })} />
                  Featured
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" checked={productForm.isActive} onChange={(e) => setProductForm({ ...productForm, isActive: e.target.checked })} />
                  Active
                </label>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button type="submit" className="btn btn-primary">Save</button>
                <button type="button" className="btn btn-outline" onClick={() => setProductForm(null)}>Cancel</button>
              </div>
            </form>
          )}

          {productsLoading ? (
            <div className="state-box"><div className="spinner" /></div>
          ) : productsError ? (
            <div className="state-box"><h3>Couldn&apos;t load products</h3></div>
          ) : products.length === 0 ? (
            <div className="state-box"><h3>No products yet</h3></div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id}>
                      <td>{p.name}</td>
                      <td>{p.category}</td>
                      <td>PKR {p.price?.toLocaleString()}{p.salePrice ? ` (sale ${p.salePrice.toLocaleString()})` : ''}</td>
                      <td>{p.stock}</td>
                      <td><span className={`badge ${p.isActive ? 'delivered' : 'cancelled'}`}>{p.isActive ? 'active' : 'inactive'}</span></td>
                      <td style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-outline btn-sm" onClick={() => openEditProduct(p)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => deleteProduct(p._id)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'categories' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ margin: 0 }}>Categories</h2>
            <button className="btn btn-primary btn-sm" onClick={openNewCategory}>+ New Category</button>
          </div>

          {categoryForm && (
            <form className="form-card" style={{ margin: '0 0 24px', maxWidth: 480 }} onSubmit={saveCategory}>
              <h3>{categoryForm._id ? 'Edit Category' : 'New Category'}</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input required value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Slug</label>
                  <input required value={categoryForm.slug} onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Icon (emoji)</label>
                  <input value={categoryForm.icon} onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Color</label>
                  <input type="color" value={categoryForm.color} onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <input value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" checked={categoryForm.isActive} onChange={(e) => setCategoryForm({ ...categoryForm, isActive: e.target.checked })} />
                Active
              </label>
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button type="submit" className="btn btn-primary">Save</button>
                <button type="button" className="btn btn-outline" onClick={() => setCategoryForm(null)}>Cancel</button>
              </div>
            </form>
          )}

          {categoriesLoading ? (
            <div className="state-box"><div className="spinner" /></div>
          ) : categoriesError ? (
            <div className="state-box"><h3>Couldn&apos;t load categories</h3></div>
          ) : categories.length === 0 ? (
            <div className="state-box"><h3>No categories yet</h3></div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Icon</th>
                    <th>Name</th>
                    <th>Slug</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => (
                    <tr key={c._id}>
                      <td>{c.icon}</td>
                      <td>{c.name}</td>
                      <td>{c.slug}</td>
                      <td><span className={`badge ${c.isActive ? 'delivered' : 'cancelled'}`}>{c.isActive ? 'active' : 'inactive'}</span></td>
                      <td style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-outline btn-sm" onClick={() => openEditCategory(c)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => deleteCategory(c._id)}>Delete</button>
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
