import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DoctorLayout from '../../components/layout/DoctorLayout';
import { 
  Search, 
  Plus, 
  BookOpen, 
  MessageSquare, 
  FileText, 
  ArrowRight, 
  Filter,
  CheckCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  LayoutGrid,
  List,
  Edit3
} from 'lucide-react';
import { libraryApi, articleRequestsApi } from '../../api/services';
import toast from 'react-hot-toast';

const CATEGORIES = ['Nutrition', 'Safety', 'MentalHealth', 'FetalDevelopment', 'Fitness', 'Postpartum'];

const DoctorLibrary = () => {
  const [articles, setArticles] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('catalog'); // 'catalog' | 'requests'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Create Article Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    summary: '',
    content: '',
    category: 'Nutrition',
    imageUrl: '',
    status: 'Published'
  });
  const [submitting, setSubmitting] = useState(false);
  // Edit Article State
  const [editingArticle, setEditingArticle] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchData();
    // Check if we came here with an edit request
    const params = new URLSearchParams(location.search);
    const editId = params.get('edit');
    if (editId) {
      const art = articles.find(a => a.id === Number(editId));
      if (art) {
        setEditingArticle(art);
        setCreateForm({
          title: art.title,
          summary: art.summary || '',
          content: art.content || '',
          category: art.category,
          imageUrl: art.imageUrl || '',
          status: art.status
        });
        setShowCreateModal(true);
      }
    }
  }, [location.search, articles.length]);

  const fetchData = async () => {
    setLoading(true);
    // Fetch articles
    try {
      const artRes = await libraryApi.getAll();
      setArticles(artRes.data);
    } catch (error) {
      console.error('Articles fetch failed:', error);
      toast.error('Failed to load clinical articles');
    }

    // Fetch requests
    try {
      const reqRes = await articleRequestsApi.getAll();
      setRequests(reqRes.data.filter(r => r.status === 'Pending'));
    } catch (error) {
      console.error('Requests fetch failed:', error);
    }
    
    setLoading(false);
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingArticle) {
        await libraryApi.update(editingArticle.id, createForm);
        toast.success('Article updated successfully!');
      } else {
        await libraryApi.create(createForm);
        toast.success('Article published successfully!');
      }
      setShowCreateModal(false);
      setEditingArticle(null);
      setCreateForm({ title: '', summary: '', content: '', category: 'Nutrition', imageUrl: '', status: 'Published' });
      fetchData();
    } catch (error) {
      toast.error(editingArticle ? 'Failed to update article' : 'Failed to publish article');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredArticles = articles.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         a.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || a.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <DoctorLayout>
      <div className="max-w-7xl mx-auto space-y-12 font-poppins animate-in fade-in duration-1000 pb-20">
        
        {/* Premium Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-100 pb-10">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-mamacare-teal uppercase tracking-[0.25em]">CLINICAL RESOURCES</span>
            <h1 className="text-6xl font-bold text-gray-900 tracking-tighter">Medical Library</h1>
          </div>
          <div className="flex items-center gap-4">
             <button 
              onClick={() => {
                setEditingArticle(null);
                setCreateForm({ title: '', summary: '', content: '', category: 'Nutrition', imageUrl: '', status: 'Published' });
                setShowCreateModal(true);
              }}
              className="flex items-center gap-3 bg-mamacare-teal text-white px-8 py-4 rounded-[2rem] font-bold text-sm shadow-xl shadow-teal-100 hover:bg-[#004848] transition-all hover:scale-105 active:scale-95"
            >
              <Plus size={18} />
              Publish New Article
            </button>
          </div>
        </div>

        {/* View Switcher & Filters */}
        <div className="flex flex-col lg:flex-row gap-8 justify-between items-center">
          <div className="flex bg-gray-50/50 p-1.5 rounded-[2rem] border border-gray-100 w-full lg:w-auto">
            <button 
              onClick={() => setActiveView('catalog')}
              className={`flex-1 lg:flex-none px-8 py-3 rounded-[1.8rem] text-xs font-black uppercase tracking-widest transition-all ${activeView === 'catalog' ? 'bg-white text-mamacare-teal shadow-sm border border-gray-100' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Article Catalog
            </button>
            <button 
              onClick={() => setActiveView('requests')}
              className={`flex-1 lg:flex-none px-8 py-3 rounded-[1.8rem] text-xs font-black uppercase tracking-widest transition-all relative ${activeView === 'requests' ? 'bg-white text-mamacare-teal shadow-sm border border-gray-100' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Patient Requests
              {requests.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                  {requests.length}
                </span>
              )}
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto flex-1 max-w-2xl">
            <div className="relative flex-1 group">
              <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-mamacare-teal transition-colors" />
              <input 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search resources..."
                className="w-full pl-16 pr-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-mamacare-teal/5 transition-all outline-none"
              />
            </div>
            <select 
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-8 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-600 focus:ring-4 focus:ring-mamacare-teal/5 outline-none"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {activeView === 'catalog' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-[400px] bg-white rounded-[2.5rem] border border-gray-50 animate-pulse" />
              ))
            ) : filteredArticles.length === 0 ? (
              <div className="col-span-full py-32 text-center space-y-4">
                <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto text-gray-200">
                  <BookOpen size={40} />
                </div>
                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">No matching articles found</p>
              </div>
            ) : (
              filteredArticles.map(article => (
                <div key={article.id} className="group bg-white rounded-[2.5rem] border border-white shadow-card overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col relative">
                  <div className="h-56 bg-gray-50 overflow-hidden relative">
                    <img 
                      src={article.imageUrl || 'https://images.unsplash.com/photo-1576091160550-2173bdb999ef?auto=format&fit=crop&q=80&w=800'} 
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute top-6 left-6 flex gap-2">
                      <span className="px-4 py-1.5 bg-white/90 backdrop-blur-sm text-mamacare-teal text-[9px] font-black rounded-lg uppercase tracking-widest shadow-sm">
                        {article.category}
                      </span>
                    </div>
                    {/* Hover Edit Overlay */}
                    <div className="absolute inset-0 bg-mamacare-teal/60 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm">
                       <button 
                        onClick={() => {
                          setEditingArticle(article);
                          setCreateForm({
                            title: article.title,
                            summary: article.summary || '',
                            content: article.content || '',
                            category: article.category,
                            imageUrl: article.imageUrl || '',
                            status: article.status
                          });
                          setShowCreateModal(true);
                        }}
                        className="w-12 h-12 bg-white text-mamacare-teal rounded-2xl flex items-center justify-center hover:scale-110 transition-all shadow-xl"
                      >
                        <Edit3 size={20} />
                      </button>
                      <button 
                        onClick={() => navigate(`/doctor/library/${article.id}`)}
                        className="w-12 h-12 bg-white text-mamacare-teal rounded-2xl flex items-center justify-center hover:scale-110 transition-all shadow-xl"
                      >
                        <ArrowRight size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="p-10 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-mamacare-teal transition-colors line-clamp-2 cursor-pointer" onClick={() => navigate(`/doctor/library/${article.id}`)}>
                      {article.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-3 font-medium">
                      {article.summary}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-gray-400" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${article.status === 'Published' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                        {article.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {requests.length === 0 ? (
              <div className="py-32 text-center bg-white rounded-[2.5rem] border border-gray-50 space-y-4 shadow-card">
                <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto text-gray-200">
                  <MessageSquare size={40} />
                </div>
                <div className="space-y-1">
                  <p className="text-gray-900 font-bold">No active requests</p>
                  <p className="text-gray-400 text-sm">Patients haven't requested any specific topics recently.</p>
                </div>
              </div>
            ) : (
              requests.map(req => (
                <div key={req.id} className="bg-white rounded-[2rem] p-10 border border-white shadow-card flex flex-col md:flex-row justify-between items-center gap-8 group hover:shadow-xl transition-all">
                  <div className="flex gap-8 items-start flex-1">
                    <div className="w-16 h-16 bg-teal-50 text-mamacare-teal rounded-2xl flex items-center justify-center shrink-0">
                      <TrendingUp size={28} />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[9px] font-black rounded-lg uppercase tracking-widest">
                          {req.category || 'General'}
                        </span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 tracking-tight">{req.topic}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 font-medium">{req.description}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setCreateForm(prev => ({ ...prev, title: req.topic, summary: req.description, category: req.category || 'Nutrition' }));
                      setShowCreateModal(true);
                    }}
                    className="w-full md:w-auto px-8 py-4 bg-gray-50 text-gray-900 font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-mamacare-teal hover:text-white transition-all shadow-sm active:scale-95"
                  >
                    Fulfill Request
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Create Article Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-md px-6">
            <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
              <div className="p-10 border-b border-gray-50 bg-white flex justify-between items-center">
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-mamacare-teal uppercase tracking-[0.2em]">KNOWLEDGE SHARING</span>
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Create Clinical Resource</h2>
                </div>
                <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-gray-50/10">
                <form onSubmit={handleCreateOrUpdate} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Title</label>
                      <input required value={createForm.title} onChange={e => setCreateForm({...createForm, title: e.target.value})}
                        className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-mamacare-teal/5 outline-none shadow-sm"
                        placeholder="Clinical topic title..." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                      <select value={createForm.category} onChange={e => setCreateForm({...createForm, category: e.target.value})}
                        className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-mamacare-teal/5 outline-none shadow-sm">
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Summary</label>
                    <textarea required value={createForm.summary} onChange={e => setCreateForm({...createForm, summary: e.target.value})}
                      className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-medium text-gray-900 focus:ring-4 focus:ring-mamacare-teal/5 outline-none shadow-sm h-24 resize-none"
                      placeholder="Brief overview for the card preview..." />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Image URL (Optional)</label>
                    <input value={createForm.imageUrl} onChange={e => setCreateForm({...createForm, imageUrl: e.target.value})}
                      className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-mamacare-teal/5 outline-none shadow-sm"
                      placeholder="https://images.unsplash.com/..." />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Content (Markdown)</label>
                    <textarea required value={createForm.content} onChange={e => setCreateForm({...createForm, content: e.target.value})}
                      className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-medium text-gray-900 focus:ring-4 focus:ring-mamacare-teal/5 outline-none shadow-sm h-64 resize-none"
                      placeholder="Write your clinical article content here..." />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setShowCreateModal(false)}
                      className="flex-1 px-8 py-5 border border-gray-100 text-gray-500 font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-gray-50 transition-all">
                      Discard
                    </button>
                    <button type="submit" disabled={submitting}
                      className="flex-[2] px-8 py-5 bg-mamacare-teal text-white font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-[#004848] transition-all shadow-xl shadow-teal-100 disabled:opacity-50">
                      {submitting ? 'Publishing...' : 'Confirm & Publish'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

      </div>
    </DoctorLayout>
  );
};

export default DoctorLibrary;
