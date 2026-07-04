import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Tag, Check } from 'lucide-react';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../../features/categories/categoriesSlice';
import { Modal } from '../../components/common/UI';
import toast from 'react-hot-toast';

const EMPTY = { name: '', description: '' };

export default function AdminCategoriesPage() {
  const dispatch = useDispatch();
  const { list: categories, loading } = useSelector((s) => s.categories);
  const [modal, setModal] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => { dispatch(fetchCategories()); }, []);

  const openCreate = () => { setForm(EMPTY); setEditTarget(null); setModal('create'); };
  const openEdit = (c) => { setForm({ name: c.name, description: c.description || '' }); setEditTarget(c); setModal('edit'); };
  const closeModal = () => { setModal(null); setEditTarget(null); };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Category name is required'); return; }
    setSaving(true);
    try {
      if (modal === 'create') {
        await dispatch(createCategory(form)).unwrap();
        toast.success('Category created!');
      } else {
        await dispatch(updateCategory({ id: editTarget.id, data: form })).unwrap();
        toast.success('Category updated!');
      }
      closeModal();
    } catch (err) { toast.error(err || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category? Products in this category may be affected.')) return;
    try {
      await dispatch(deleteCategory(id)).unwrap();
      toast.success('Category deleted');
    } catch (err) { toast.error(err || 'Delete failed'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-bold text-xl">Categories</h2>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 py-2.5">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-24" />)}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Tag size={40} className="mx-auto mb-3 opacity-30" />
          <p>No categories yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, i) => (
            <motion.div key={cat.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white border border-lgray p-5 hover:border-maroon/30 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-maroon/10 rounded-sm flex items-center justify-center">
                    <Tag size={18} className="text-maroon" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base">{cat.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">ID: {cat.id}</p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(cat)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-red-brand hover:bg-red-50 rounded transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              {cat.description && <p className="text-sm text-gray-500 mt-3 line-clamp-2">{cat.description}</p>}
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={!!modal} onClose={closeModal} title={modal === 'create' ? 'Add Category' : 'Edit Category'} size="sm">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-button font-semibold tracking-widest uppercase text-gray-600 block mb-1.5" style={{fontFamily:'Montserrat,sans-serif'}}>Category Name *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="e.g. Shirts" />
          </div>
          <div>
            <label className="text-xs font-button font-semibold tracking-widest uppercase text-gray-600 block mb-1.5" style={{fontFamily:'Montserrat,sans-serif'}}>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input-field resize-none" placeholder="Optional description..." />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={closeModal} className="btn-outline flex-1 py-2.5">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 py-2.5 flex items-center justify-center gap-2">
              {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check size={15} />}
              {modal === 'create' ? 'Create' : 'Update'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
