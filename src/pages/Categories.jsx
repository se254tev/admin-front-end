import { useEffect, useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { createCategory, deleteCategory, fetchCategories } from '../services/api';
import { SkeletonCard } from '../components/SkeletonLoader';
import { EmptyState } from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await fetchCategories();
      setCategories(data.categories || data);
    } catch (error) {
      toast.error('Unable to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAdd = async (event) => {
    event.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error('Category name is required');
      return;
    }
    if (trimmedName.length < 2 || trimmedName.length > 50) {
      toast.error('Category name must be between 2 and 50 characters');
      return;
    }

    // Check for duplicate (case-insensitive)
    const exists = categories.some(cat => cat.name.toLowerCase() === trimmedName.toLowerCase());
    if (exists) {
      toast.error('Category already exists');
      return;
    }

    try {
      setSubmitting(true);
      await createCategory({ name: trimmedName });
      toast.success('Category added');
      setName('');
      loadCategories();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to add category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      toast.success('Category removed');
      loadCategories();
    } catch (error) {
      toast.error('Unable to delete category');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Categories</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950">Menu category manager</h1>
          </div>
          <form onSubmit={handleAdd} className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="New category name"
              className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              required
            />
            <button type="submit" disabled={submitting} className="inline-flex items-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-70">
              <FaPlus className="mr-2 h-4 w-4" /> {submitting ? 'Adding...' : 'Add category'}
            </button>
          </form>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Category list</h2>
        <div className="mt-5 space-y-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          ) : categories.length === 0 ? (
            <EmptyState
              title="No categories yet"
              description="Create your first category to organize your menu items."
            />
          ) : (
            <>
              {categories.map((category) => (
                <div key={category._id} className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{category.name}</p>
                    <p className="text-sm text-slate-600">Created at {new Date(category.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(category._id)}
                    className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 shadow-sm transition-all hover:bg-red-100 hover:shadow-md active:scale-95"
                  >
                    <FaTrash className="mr-2 h-4 w-4" /> Delete
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Categories;
