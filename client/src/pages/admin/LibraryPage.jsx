import React, { useEffect, useState, useRef } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { libraryApi } from '../../api/services';
import { uploadToCloudinary } from '../../api/cloudinary';
import { Plus, Edit2, Trash2, BookOpen, X, Eye, EyeOff, ImagePlus } from 'lucide-react';

const CATEGORIES = ['Nutrition', 'Safety', 'MentalHealth', 'FetalDevelopment', 'Fitness', 'Postpartum'];
const CATEGORY_LABELS = { Nutrition: 'Nutrition', Safety: 'Safety', MentalHealth: 'Wellness', FetalDevelopment: 'Fetal Development', Fitness: 'Fitness', Postpartum: 'Postpartum' };

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
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#005C5C]/10 rounded-xl flex items-center justify-center">
              <BookOpen size={20} className="text-[#005C5C]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">Health Library</h1>
              <p className="text-gray-400 text-sm">Create and manage articles for mothers</p>
            </div>
          </div>
          <button onClick={openCreate}
            className="flex items-center gap-2 bg-[#005C5C] text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-[#004848] transition-all active:scale-95">
            <Plus size={18} /> New Article
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="space-y-3">
            {Array(5).fill(0).map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <BookOpen size={48} className="mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No articles yet. Create your first one.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Article</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Updated</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map(article => (
                  <tr key={article.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {article.imageUrl && (
                          <img src={article.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" onError={e => e.target.style.display='none'} />
                        )}
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{article.title}</p>
                          {article.summary && <p className="text-xs text-gray-400 line-clamp-1 max-w-xs">{article.summary}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-[#005C5C]/10 text-[#005C5C] text-xs font-semibold rounded-md">
                        {CATEGORY_LABELS[article.category] || article.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => toggleStatus(article)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${article.status === 'Published' ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                        {article.status === 'Published' ? <Eye size={12} /> : <EyeOff size={12} />}
                        {article.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(article.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(article)}
                          className="p-2 text-gray-400 hover:text-[#005C5C] hover:bg-[#005C5C]/10 rounded-lg transition-all">
                          <Edit2 size={15} />
                        </button>
                        <button onClick={() => setDeleteId(article.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
