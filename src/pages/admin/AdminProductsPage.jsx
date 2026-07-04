import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Upload, X, Check } from 'lucide-react';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../../features/products/productsSlice';
import { fetchCategories } from '../../features/categories/categoriesSlice';
import { productsAPI } from '../../services/api';
import { Modal, Pagination } from '../../components/common/UI';
import { TableRowSkeleton as TRS } from '../../components/common/Skeletons';
import toast from 'react-hot-toast';
import { formatPKR } from '../../utils/currency';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const EMPTY_FORM = { name: '', description: '', price: '', stock_quantity: '', category_id: '' };

export default function AdminProductsPage() {
  const dispatch = useDispatch();
  const { list: products, loading } = useSelector((s) => s.products);
  const { list: categories } = useSelector((s) => s.categories);

  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | 'create' | 'edit'
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploadId, setUploadId] = useState(null);
  const [page, setPage] = useState(1);
  const [formImageFile, setFormImageFile] = useState(null);
  const [formImagePreview, setFormImagePreview] = useState(null);
  const PER_PAGE = 10;

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, []);

  const filtered = products.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const openCreate = () => { setForm(EMPTY_FORM); setEditTarget(null); setFormImageFile(null); setFormImagePreview(null); setModal('create'); };
  const openEdit = (p) => { setForm({ name: p.name, description: p.description || '', price: p.price, stock_quantity: p.stock_quantity, category_id: p.category_id || '' }); setEditTarget(p); setFormImageFile(null); setFormImagePreview(p.image_url ? `${BASE_URL}${p.image_url}` : null); setModal('edit'); };
  const closeModal = () => { setModal(null); setEditTarget(null); setFormImageFile(null); setFormImagePreview(null); };

  const handleFormImageSelect = (file) => {
    if (!file) return;
    setFormImageFile(file);
    setFormImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.stock_quantity) { toast.error('Name, price, and stock are required'); return; }
    setSaving(true);
    try {
      const payload = { ...form, price: parseFloat(form.price), stock_quantity: parseInt(form.stock_quantity), category_id: form.category_id ? parseInt(form.category_id) : null };
      let productId = editTarget?.id;
      if (modal === 'create') {
        const created = await dispatch(createProduct(payload)).unwrap();
        productId = created.id;
        toast.success('Product created!');
      } else {
        await dispatch(updateProduct({ id: editTarget.id, data: payload })).unwrap();
        toast.success('Product updated!');
      }
      if (formImageFile && productId) {
        const imgForm = new FormData();
        imgForm.append('image', formImageFile);
        try {
          await productsAPI.uploadImage(productId, imgForm);
        } catch (err) { toast.error('Product saved, but image upload failed'); }
      }
      dispatch(fetchProducts());
      closeModal();
    } catch (err) { toast.error(err || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await dispatch(deleteProduct(id)).unwrap();
      toast.success('Product deleted');
    } catch (err) { toast.error(err || 'Delete failed'); }
  };

  const handleImageUpload = async (productId, file) => {
    const form = new FormData();
    form.append('image', file);
    setUploadId(productId);
    try {
      await productsAPI.uploadImage(productId, form);
      toast.success('Image uploaded!');
      dispatch(fetchProducts());
    } catch (err) { toast.error('Image upload failed'); }
    finally { setUploadId(null); }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="font-heading font-bold text-xl">Products</h2>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 py-2.5">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search products..." className="input-field pl-9 text-sm py-2.5" />
      </div>

      {/* Table */}
      <div className="bg-white border border-lgray overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-lgray bg-lgray/30">
              {['Image', 'Name', 'Category', 'Price', 'Stock', 'Actions'].map((h) => (
                <th key={h} className="text-left py-3 px-4 text-xs font-button tracking-widest uppercase text-gray-500" style={{fontFamily:'Montserrat,sans-serif'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <TRS key={i} cols={6} />)
            ) : paginated.length === 0 ? (
              <tr><td colSpan={6} className="py-12 text-center text-gray-400">No products found</td></tr>
            ) : (
              paginated.map((product) => {
                const img = product.image_url ? `${BASE_URL}${product.image_url}` : null;
                return (
                  <motion.tr key={product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="border-b border-lgray hover:bg-lgray/20 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="w-12 h-14 bg-lgray overflow-hidden relative group">
                        {img ? <img src={img} alt={product.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl">📦</div>}
                        <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                          {uploadId === product.id
                            ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            : <Upload size={14} className="text-white" />}
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files[0] && handleImageUpload(product.id, e.target.files[0])} />
                        </label>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold max-w-[160px] truncate">{product.name}</p>
                      {product.description && <p className="text-xs text-gray-400 truncate max-w-[160px]">{product.description}</p>}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{product.category?.name || '-'}</td>
                    <td className="py-3 px-4 font-bold text-maroon">{formatPKR(product.price)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${product.stock_quantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.stock_quantity}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(product)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="p-1.5 text-red-brand hover:bg-red-50 rounded transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Pagination current={page} total={totalPages} onChange={setPage} />

      {/* Modal */}
      <Modal isOpen={!!modal} onClose={closeModal} title={modal === 'create' ? 'Add New Product' : 'Edit Product'} size="md">
        <div className="space-y-4">
          <div>
            <label className="label-field-xs">Product Image</label>
            <div className="flex items-center gap-4 mt-1">
              <div className="w-20 h-24 bg-lgray overflow-hidden flex-shrink-0 flex items-center justify-center text-gray-300 text-2xl">
                {formImagePreview ? <img src={formImagePreview} alt="Preview" className="w-full h-full object-cover" /> : '📦'}
              </div>
              <label className="btn-outline py-2 px-4 text-sm flex items-center gap-2 cursor-pointer">
                <Upload size={14} /> Choose Image
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFormImageSelect(e.target.files[0])} />
              </label>
            </div>
          </div>
          <div>
            <label className="label-field-xs">Product Name *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field mt-1" placeholder="e.g. Premium Polo Shirt" />
          </div>
          <div>
            <label className="label-field-xs">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input-field mt-1 resize-none" placeholder="Product description..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field-xs">Price ($) *</label>
              <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field mt-1" placeholder="29.99" />
            </div>
            <div>
              <label className="label-field-xs">Stock Quantity *</label>
              <input type="number" min="0" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} className="input-field mt-1" placeholder="100" />
            </div>
          </div>
          <div>
            <label className="label-field-xs">Category</label>
            <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="input-field mt-1">
              <option value="">No Category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={closeModal} className="btn-outline flex-1 py-2.5">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 py-2.5 flex items-center justify-center gap-2">
              {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check size={15} />}
              {modal === 'create' ? 'Create Product' : 'Save Changes'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
