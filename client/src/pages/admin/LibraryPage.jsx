import React, { useEffect, useState, useRef } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { libraryApi } from '../../api/services';
import { uploadToCloudinary } from '../../api/cloudinary';
import { Plus, Edit2, Trash2, BookOpen, X, Eye, EyeOff, ImagePlus } from 'lucide-react';

const CATEGORIES = ['Nutrition', 'Safety', 'MentalHealth', 'FetalDevelopment', 'Fitness', 'Postpartum'];
const CATEGORY_LABELS = { Nutrition: 'Nutrition', Safety: 'Safety', MentalHealth: 'Wellness', FetalDevelopment: 'Fetal Development', Fitness: 'Fitness', Postpartum: 'Postpartum' };
const CATEGORY_COLORS = {
  Nutrition: 'bg-[#FFEBEE] text-[#E91E63]',
  Safety: 'bg-[#FFF3E0] text-[#EF6C00]',
  MentalHealth: 'bg-[#F3E5F5] text-[#7B1FA2]',
  FetalDevelopment: 'bg-[#E0F2F1] text-[#00796B]',
  Fitness: 'bg-[#E3F2FD] text-[#1565C0]',
  Postpartum: 'bg-[#FFF8E1] text-[#F57F17]',
  Default: 'bg-gray-100 text-gray-600'
};

const EMPTY_FORM = { title: '', summary: '', content: '', category: 'Nutrition', imageUrl: '', status: 'Draft' };

const LibraryPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | { mode: 'create' | 'edit', data: {} }
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageInputRef = useRef(null);

  const load = () => {
    libraryApi.getAll()
      .then(r => setArticles(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview('');
    setError('');
    setModal({ mode: 'create' });
  };

  const openEdit = (article) => {
    setForm({
      title: article.title || '',
      summary: article.summary || '',
      content: article.content || '',
      category: article.category || 'Nutrition',
      imageUrl: article.imageUrl || '',
      status: article.status || 'Draft',
    });
    setImageFile(null);
    setImagePreview(article.imageUrl || '');
    setError('');
    setModal({ mode: 'edit', id: article.id });
  };

  const closeModal = () => { setModal(null); setError(''); setImageFile(null); setImagePreview(''); };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required.'); return; }
    setSaving(true);
    setError('');
    try {
      let imageUrl = form.imageUrl || null;
      if (imageFile) {
        setUploadingImage(true);
        imageUrl = await uploadToCloudinary(imageFile);
        setUploadingImage(false);
      }
      if (modal.mode === 'create') {
        await libraryApi.create({
          title: form.title, summary: form.summary, content: form.content,
          category: form.category, imageUrl,
        });
      } else {
        await libraryApi.update(modal.id, {
          title: form.title, summary: form.summary, content: form.content,
          category: form.category, imageUrl,
          status: form.status,
        });
      }
      closeModal();
      load();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    await libraryApi.delete(deleteId);
    setDeleteId(null);
    setArticles(prev => prev.filter(a => a.id !== deleteId));
  };

  const toggleStatus = async (article) => {
    const newStatus = article.status === 'Published' ? 'Draft' : 'Published';
    await libraryApi.update(article.id, { status: newStatus });
    setArticles(prev => prev.map(a => a.id === article.id ? { ...a, status: newStatus } : a));
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-8 space-y-12 animate-in slide-in-from-bottom-4 duration-700">
        {/* High-Fidelity Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-100 pb-10 font-poppins">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-mamacare-teal uppercase tracking-[0.25em]">CONTENT MANAGEMENT</span>
            <h1 className="text-6xl font-bold text-gray-900 tracking-tighter">Health Library</h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={openCreate}
              className="bg-mamacare-teal text-white px-8 py-3 rounded-xl font-bold text-xs shadow-lg shadow-mamacare-teal/10 transition-all hover:bg-mamacare-teal-dark active:scale-[0.98] flex items-center gap-2 font-poppins">
              <Plus size={18} /> New Article
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="space-y-3">
            {Array(5).fill(0).map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <BookOpen size={48} className="mx-auto mb-3 opacity-30" />
            <p className="font-semibold text-sm font-poppins">No articles yet. Create your first one.</p>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.03)] font-poppins">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-8 py-6 text-[14px] font-semibold text-gray-700">ARTICLE</th>
                    <th className="px-8 py-6 text-[14px] font-semibold text-gray-700">CATEGORY</th>
                    <th className="px-8 py-6 text-[14px] font-semibold text-gray-700">STATUS</th>
                    <th className="px-8 py-6 text-[14px] font-semibold text-gray-700">UPDATED</th>
                    <th className="px-8 py-6 text-[14px] font-semibold text-gray-700">ACTIONS</th>
                  </tr>
                </thead>
              <tbody>
                {articles.map(article => (
                  <tr key={article.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        {article.imageUrl ? (
                          <img src={article.imageUrl} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" onError={e => e.target.style.display='none'} />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-mamacare-teal/10 flex items-center justify-center shrink-0">
                            <BookOpen size={20} className="text-mamacare-teal" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{article.title}</p>
                          {article.summary && <p className="text-[11px] font-medium text-gray-400 line-clamp-1 max-w-xs mt-0.5">{article.summary}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full ${CATEGORY_COLORS[article.category] || CATEGORY_COLORS.Default}`}>
                        {CATEGORY_LABELS[article.category] || article.category}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <button onClick={() => toggleStatus(article)}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${article.status === 'Published' ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                        {article.status === 'Published' ? <Eye size={12} /> : <EyeOff size={12} />}
                        {article.status}
                      </button>
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-gray-500">
                      {new Date(article.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(article)}
                          className="p-2.5 text-mamacare-teal hover:bg-teal-50 bg-gray-50 rounded-xl transition-all">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => setDeleteId(article.id)}
                          className="p-2.5 text-red-500 hover:bg-red-50 bg-gray-50 rounded-xl transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-black text-gray-900">
                {modal.mode === 'create' ? 'New Article' : 'Edit Article'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSave} className="overflow-y-auto p-6 space-y-4 flex-1">
              {/* Title */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Title *</label>
                <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Safe Sleep Positions during Third Trimester"
                  className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#005C5C]/20 text-sm" />
              </div>

              {/* Category + Status row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Category</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                    className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#005C5C]/20 text-sm bg-white">
                    {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Status</label>
                  <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                    className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#005C5C]/20 text-sm bg-white">
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Article Image</label>
                <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                {imagePreview ? (
                  <div className="mt-1 relative">
                    <img src={imagePreview} alt="preview" className="h-36 w-full object-cover rounded-xl" />
                    <button type="button" onClick={() => { setImageFile(null); setImagePreview(''); setForm(p => ({ ...p, imageUrl: '' })); }}
                      className="absolute top-2 right-2 w-7 h-7 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70">
                      <X size={14} />
                    </button>
                    <button type="button" onClick={() => imageInputRef.current?.click()}
                      className="absolute bottom-2 right-2 px-3 py-1.5 bg-black/50 text-white text-xs font-bold rounded-lg hover:bg-black/70">
                      Change
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => imageInputRef.current?.click()}
                    className="mt-1 w-full h-28 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-[#005C5C] hover:text-[#005C5C] transition-colors">
                    <ImagePlus size={24} />
                    <span className="text-xs font-semibold">Click to upload image</span>
                  </button>
                )}
              </div>

              {/* Summary */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Summary</label>
                <textarea value={form.summary} onChange={e => setForm(p => ({ ...p, summary: e.target.value }))}
                  placeholder="A short description shown on the library card..."
                  rows={2} className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#005C5C]/20 text-sm resize-none" />
              </div>

              {/* Content */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Content</label>
                <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                  placeholder="Full article content. You can use HTML tags like <p>, <h2>, <ul>, <li>, <strong>..."
                  rows={8} className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#005C5C]/20 text-sm resize-none font-mono" />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving || uploadingImage}
                  className="flex-1 py-3 rounded-xl bg-[#005C5C] text-white font-bold text-sm hover:bg-[#004848] disabled:opacity-60">
                  {uploadingImage ? 'Uploading image...' : saving ? 'Saving...' : modal.mode === 'create' ? 'Create Article' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h3 className="text-xl font-black text-gray-900">Delete Article?</h3>
            <p className="text-gray-400 text-sm">This action cannot be undone.</p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleDelete}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default LibraryPage;
