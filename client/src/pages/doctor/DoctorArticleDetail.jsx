import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DoctorLayout from '../../components/layout/DoctorLayout';
import { libraryApi } from '../../api/services';
import { ChevronLeft, Clock, Edit3, Trash2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORY_THEMES = {
  Nutrition:        { bg: 'bg-[#FFEBEE]', text: 'text-[#E91E63]', label: 'Nutrition',         fallback: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800' },
  Safety:           { bg: 'bg-[#FFF3E0]', text: 'text-[#EF6C00]', label: 'Safety',            fallback: 'https://images.unsplash.com/photo-1544126592-807daa2b569b?auto=format&fit=crop&q=80&w=800' },
  MentalHealth:     { bg: 'bg-[#F3E5F5]', text: 'text-[#7B1FA2]', label: 'Wellness',          fallback: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800' },
  Fitness:          { bg: 'bg-[#E0F7FA]', text: 'text-[#00796B]', label: 'Fitness',           fallback: 'https://images.unsplash.com/photo-1518611012118-2969c63b07b7?auto=format&fit=crop&q=80&w=800' },
  FetalDevelopment: { bg: 'bg-[#E0F2F1]', text: 'text-[#00796B]', label: 'Fetal Development', fallback: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80&w=800' },
  Postpartum:       { bg: 'bg-[#FCE4EC]', text: 'text-[#C2185B]', label: 'Postpartum',        fallback: 'https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=800' },
  Default:          { bg: 'bg-gray-100',  text: 'text-gray-600',  label: 'General',           fallback: 'https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=800' },
};

const getArticleImage = (a) => {
  if (a.title?.includes('Safe Exercises for Pregnancy')) return '/sportsprWoman.jpg';
  if (a.title?.includes('Safe Sleep Positions')) return '/SleepingPrWoman.jpg';
  if (a.title?.includes('Gentle Movement Guide')) return '/gentle-woman.jpg';
  if (a.title?.includes('First Trimester Essentials')) return '/first-trimester.jpg';
  return a.imageUrl || (CATEGORY_THEMES[a.category] || CATEGORY_THEMES.Default).fallback;
};

const DoctorArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    libraryApi.getById(id)
      .then(r => setArticle(r.data))
      .catch(() => toast.error('Failed to load article'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <DoctorLayout>
      <div className="pt-40 flex justify-center">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-mamacare-teal rounded-full animate-spin" />
      </div>
    </DoctorLayout>
  );

  if (!article) return (
    <DoctorLayout>
      <div className="pt-40 text-center space-y-4">
        <p className="text-2xl font-bold text-gray-400">Article not found.</p>
        <Link to="/doctor/library" className="text-mamacare-teal font-bold hover:underline">← Back to Library</Link>
      </div>
    </DoctorLayout>
  );

  const theme = CATEGORY_THEMES[article.category] || CATEGORY_THEMES.Default;

  return (
    <DoctorLayout>
      <div className="max-w-4xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
        
        {/* Header Actions */}
        <div className="flex justify-between items-center border-b border-gray-100 pb-8">
          <Link to="/doctor/library" className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-600 hover:text-mamacare-teal transition-colors">
            <ChevronLeft size={16} /> Back to Catalog
          </Link>
          <div className="flex gap-3">
             <button 
              onClick={() => navigate(`/doctor/library?edit=${article.id}`)}
              className="flex items-center gap-2 px-6 py-2.5 bg-gray-50 text-gray-700 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-mamacare-teal hover:text-white transition-all shadow-sm"
            >
              <Edit3 size={16} /> Edit Article
            </button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="w-full h-[400px] rounded-[3rem] overflow-hidden shadow-2xl relative">
          <img src={getArticleImage(article)} alt={article.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-10 left-10 right-10">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-4 py-1.5 ${theme.bg} ${theme.text} text-[10px] font-black rounded-lg uppercase tracking-[0.2em] shadow-lg`}>
                {theme.label}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-white/90 font-bold drop-shadow-md">
                <Clock size={13} />
                {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-lg">
              {article.title}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="p-10 bg-teal-50/30 rounded-[2.5rem] border border-teal-100/50">
              <p className="text-xl text-gray-700 font-medium leading-relaxed italic">
                "{article.summary}"
              </p>
            </div>

            <div className="prose prose-teal max-w-none text-gray-700 leading-relaxed space-y-6 [&_h2]:text-[#003e3d] [&_h2]:font-black [&_h2]:text-2xl [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-[#003e3d] [&_h3]:font-black [&_h3]:text-xl [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:text-gray-600 [&_p]:leading-[1.8] [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li]:text-gray-600"
              dangerouslySetInnerHTML={{ __html: article.content || article.Content || '<p class="text-gray-400 italic">Full content is being prepared by the clinical team.</p>' }} />
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8 sticky top-10">
            <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm space-y-6">
              <h4 className="text-[10px] font-black text-mamacare-teal uppercase tracking-[0.2em]">Article Stats</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Status</span>
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${article.status === 'Published' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                    {article.status}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Last Updated</span>
                  <span className="text-xs font-bold text-gray-700">
                    {new Date(article.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#005C5C] rounded-[2rem] p-8 text-white space-y-4 shadow-xl shadow-teal-100">
              <h4 className="font-bold text-lg leading-tight">Patient View Preview</h4>
              <p className="text-white/70 text-xs leading-relaxed">
                This is how the article appears to mothers in the public library. Ensure clinical accuracy.
              </p>
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all">
                View Public Version
              </button>
            </div>
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
};

export default DoctorArticleDetail;
