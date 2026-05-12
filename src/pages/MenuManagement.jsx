import { useEffect, useState } from 'react';
import { FaPlus, FaSearch, FaTrash, FaEdit } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import {
  createMenuItem,
  deleteMenuItem,
  fetchCategories,
  fetchMenuItems,
  updateMenuItem,
} from '../services/api';
import ConfirmModal from '../components/ConfirmModal';
import { SkeletonCard } from '../components/SkeletonLoader';
import { EmptyState } from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';

const emptyItem = {
  name: '',
  description: '',
  category: '',
  price: '',
  image: '',
  inStock: true,
  featured: false,
  available: true,
  isAddon: false,
  stockCount: 0,
  availableTimes: ['All Day'],
  relatedMeals: [],
};

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeItem, setActiveItem] = useState(null);
  const [form, setForm] = useState(emptyItem);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const items = await fetchMenuItems();
      setMenuItems(items);
    } catch (error) {
      toast.error('Unable to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryOptions = async () => {
    try {
      const data = await fetchCategories();
      setCategories(Array.isArray(data) ? data : data.categories || []);
    } catch (error) {
      toast.error('Unable to load categories');
    }
  };

  useEffect(() => {
    fetchItems();
    fetchCategoryOptions();
  }, []);

  useEffect(() => {
    const filteredItems = menuItems.filter((item) => {
      const categoryName = item.category?.name || item.category || '';
      return [item.name, categoryName, item.description]
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase());
    });
    setFiltered(filteredItems);
  }, [menuItems, search]);

  const handleChange = (event) => {
    const { name, value, type, checked, selectedOptions } = event.target;
    if (type === 'select-multiple') {
      setForm((prev) => ({
        ...prev,
        [name]: Array.from(selectedOptions, (option) => option.value),
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAvailableTimeChange = (timeValue) => {
    setForm((prev) => {
      const times = prev.availableTimes || [];
      return {
        ...prev,
        availableTimes: times.includes(timeValue)
          ? times.filter((time) => time !== timeValue)
          : [...times, timeValue],
      };
    });
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Frontend validation
    const trimmedName = form.name.trim();
    if (!trimmedName) {
      toast.error('Name is required');
      return;
    }
    if (trimmedName.length < 2 || trimmedName.length > 100) {
      toast.error('Name must be between 2 and 100 characters');
      return;
    }

    if (!form.price || isNaN(form.price) || form.price <= 0) {
      toast.error('Valid price is required');
      return;
    }
    if (form.price > 10000) {
      toast.error('Price cannot exceed KES 10,000');
      return;
    }

    if (!form.category) {
      toast.error('Category is required');
      return;
    }

    if (form.description && form.description.length > 500) {
      toast.error('Description cannot exceed 500 characters');
      return;
    }

    if (form.stockCount < 0 || isNaN(form.stockCount)) {
      toast.error('Stock count must be a non-negative number');
      return;
    }

    try {
      setSubmitting(true);
      if (activeItem) {
        await updateMenuItem(activeItem._id, form);
        toast.success('Menu item updated');
      } else {
        await createMenuItem(form);
        toast.success('Menu item created');
      }
      setForm(emptyItem);
      setActiveItem(null);
      fetchItems();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to save menu item');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (item) => {
    setDeleteTarget(item);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMenuItem(deleteTarget._id);
      toast.success('Menu item deleted');
      fetchItems();
    } catch (error) {
      toast.error('Failed to delete item');
    } finally {
      setConfirmOpen(false);
      setDeleteTarget(null);
    }
  };

  const startEdit = (item) => {
    setActiveItem(item);
    setForm({
      name: item.name,
      description: item.description || '',
      category: item.category?._id || item.category || '',
      price: item.price,
      image: item.image || '',
      inStock: item.inStock,
      featured: item.featured || false,
      available: item.available !== undefined ? item.available : true,
      isAddon: item.isAddon || false,
      stockCount: item.stockCount ?? 0,
      availableTimes: item.availableTimes || ['All Day'],
      relatedMeals: item.relatedMeals?.map((related) => related._id || related) || [],
    });
  };

  const title = activeItem ? 'Edit Menu Item' : 'Add Menu Item';

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Menu management</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950">Meals & product catalog</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <FaSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search meals"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 md:w-80"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveItem(null);
                setForm(emptyItem);
              }}
              className="inline-flex items-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow-md active:scale-95"
            >
              <FaPlus className="mr-2 h-4 w-4" /> New item
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Menu items</h2>
          {loading ? (
            <div className="mt-6 grid gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No menu items found"
              description={search ? "No items match your search criteria." : "Get started by adding your first menu item."}
              action={
                <button
                  type="button"
                  onClick={() => {
                    setActiveItem(null);
                    setForm(emptyItem);
                  }}
                  className="rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  <FaPlus className="mr-2 inline" /> Add first item
                </button>
              }
            />
          ) : (
            <div className="mt-6 grid gap-4">
              {filtered.map((item) => (
                <div key={item._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-slate-950">{item.name}</p>
                      <p className="mt-1 text-sm text-slate-600">{item.category?.name || item.category}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs ${item.inStock ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {item.inStock ? 'Available' : 'Unavailable'}
                      </span>
                      {item.isAddon && (
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-700">
                          Add-on
                        </span>
                      )}
                      {item.stockCount !== undefined && (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                          {item.stockCount} in stock
                        </span>
                      )}
                      {item.featured && (
                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs text-yellow-700">
                          Featured
                        </span>
                      )}
                      {!item.available && (
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                          Hidden
                        </span>
                      )}
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">KES {item.price}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-slate-600">{item.description}</p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md active:scale-95"
                      >
                        <FaEdit className="mr-2 h-4 w-4" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => confirmDelete(item)}
                        className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 shadow-sm transition-all hover:bg-red-100 hover:shadow-md active:scale-95"
                      >
                        <FaTrash className="mr-2 h-4 w-4" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
          </div>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm text-slate-600">Name</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
              />
            </label>
            <label className="block">
              <span className="text-sm text-slate-600">Description</span>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="3"
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm text-slate-600">Category</span>
                {categories.length > 0 ? (
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="mt-2 text-sm text-rose-600">Add categories first in the Categories page.</div>
                )}
              </label>
              <label className="block">
                <span className="text-sm text-slate-600">Price</span>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
                />
              </label>
            </div>
            <label className="block">
              <span className="text-sm text-slate-600">Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-2 block w-full text-sm text-slate-500"
              />
            </label>
            {form.image && (
              <img src={form.image} alt="Preview" className="mt-3 h-40 w-full rounded-3xl object-cover" />
            )}
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Available for ordering</span>
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, inStock: !prev.inStock }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    form.inStock ? 'bg-slate-900' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      form.inStock ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Featured meal</span>
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, featured: !prev.featured }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    form.featured ? 'bg-orange-500' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      form.featured ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Available (show in menu)</span>
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, available: !prev.available }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    form.available ? 'bg-green-500' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      form.available ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Add-on item</span>
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, isAddon: !prev.isAddon }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    form.isAddon ? 'bg-blue-500' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      form.isAddon ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
            </div>
            <label className="block">
              <span className="text-sm text-slate-600">Stock count</span>
              <input
                type="number"
                name="stockCount"
                value={form.stockCount}
                onChange={handleChange}
                min="0"
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
              />
            </label>
            <div className="block">
              <span className="text-sm text-slate-600">Available times</span>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {['Breakfast', 'Lunch', 'Dinner', 'All Day'].map((option) => (
                  <label key={option} className="flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={(form.availableTimes || []).includes(option)}
                      onChange={() => handleAvailableTimeChange(option)}
                      className="h-4 w-4 rounded border-slate-300 text-slate-900"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
            <label className="block">
              <span className="text-sm text-slate-600">Related meals</span>
              <select
                name="relatedMeals"
                multiple
                value={form.relatedMeals}
                onChange={handleChange}
                className="mt-2 w-full min-h-[120px] rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
              >
                {menuItems
                  .filter((item) => !activeItem || item._id !== activeItem._id)
                  .map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </label>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? 'Saving...' : activeItem ? 'Update item' : 'Save item'}
            </button>
          </form>
        </div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Delete menu item"
        description="This action cannot be undone. Are you sure you want to remove this menu item?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </section>
  );
};

export default MenuManagement;
