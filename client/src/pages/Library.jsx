import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Search, ArrowRight, MessageSquare, HeartPulse, Sparkles, ChevronRight, Globe } from 'lucide-react';
import { libraryApi } from '../api/services';

const UI_CATEGORIES = [
  { id: 'All', label: 'All Topics' },
  { id: 'Nutrition', label: 'Nutrition' },
  { id: 'Safety', label: 'Safety' },
  { id: 'MentalHealth', label: 'Wellness' },
];

const CATEGORY_THEMES = {
  Nutrition: { 
    bg: 'bg-[#FFEBEE]', 
    text: 'text-[#E91E63]', 
    fallback: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800' 
  },
  Safety: { 
    bg: 'bg-[#FFF3E0]', 
    text: 'text-[#EF6C00]', 
    fallback: 'https://images.unsplash.com/photo-1544126592-807daa2b569b?auto=format&fit=crop&q=80&w=800' 
  },
  FetalDevelopment: { 
    bg: 'bg-[#E0F2F1]', 
    text: 'text-[#00796B]', 
    fallback: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80&w=800' 
  },
  MentalHealth: { 
    bg: 'bg-[#F3E5F5]', 
    text: 'text-[#7B1FA2]', 
    fallback: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800' 
  },
  Default: { 
    bg: 'bg-gray-100', 
    text: 'text-gray-600', 
    fallback: 'https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=800' 
  }
};

const Library = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [language, setLanguage] = useState('English');

  useEffect(() => {
    libraryApi.getAll({ status: 'Published' })
      .then(r => setArticles(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getTheme = (cat) => CATEGORY_THEMES[cat] || CATEGORY_THEMES.Default;

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || article.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white font-poppins">
      <Navbar />

      <main className="pt-32 pb-20 max-w-[1200px] mx-auto px-6">
        {/* Hero & Controls Section */}
        <header className="flex flex-col gap-12 mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-black tracking-tight text-[#003e3d] mb-4">Health Library</h1>
              <p className="text-gray-500 text-lg leading-relaxed italic font-medium">
                Your sanctuary for clinical guidance, nurturing wisdom, and maternal support.
              </p>
            </div>
            
            {/* Bilingual Toggle */}
            <div className="inline-flex p-1.5 bg-gray-50 rounded-full border border-gray-100">
              <button 
                onClick={() => setLanguage('English')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${language === 'English' ? 'bg-[#003e3d] text-white' : 'text-gray-400 hover:text-gray-600'}`}
              >
                English
              </button>
              <button 
                onClick={() => setLanguage('Kinyarwanda')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${language === 'Kinyarwanda' ? 'bg-[#003e3d] text-white' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Kinyarwanda
              </button>
            </div>
          </div>

          {/* Search & Filter Area */}
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            <div className="relative w-full lg:flex-1 group">
              <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-mamacare-teal" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for nutrition, safety, or newborn care..." 
                className="w-full pl-16 pr-6 py-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-mamacare-teal/20 text-gray-700 placeholder:text-gray-400 transition-all shadow-inner"
              />
            </div>
            
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 w-full lg:w-auto px-1">
              {UI_CATEGORIES.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`whitespace-nowrap px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all active:scale-95 ${activeCategory === cat.id ? 'bg-[#003e3d] text-white' : 'bg-white text-gray-400 border border-gray-100 hover:text-mamacare-teal'}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Article Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-[2rem] overflow-hidden h-[450px] animate-pulse">
                <div className="h-56 bg-gray-100" />
                <div className="p-8 space-y-4">
                  <div className="h-6 bg-gray-100 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-full" />
                </div>
              </div>
            ))
          ) : filteredArticles.length > 0 ? (
            filteredArticles.map(article => {
              let category = article.category;
              // Category overrides
              if (article.title.includes('Safe Exercises for Pregnancy')) category = 'MentalHealth';

              const theme = getTheme(category);
              let displayImage = article.imageUrl && article.imageUrl.startsWith('http') ? article.imageUrl : theme.fallback;
              
              // Local image overrides
              if (article.title.includes('Safe Exercises for Pregnancy')) displayImage = '/sportsprWoman.jpg';
              if (article.title.includes('Safe Sleep Positions')) displayImage = '/SleepingPrWoman.jpg';
              if (article.title.includes('Gentle Movement Guide')) displayImage = '/gentle-woman.jpg';
              if (article.title.includes('First Trimester Essentials')) displayImage = '/first-trimester.jpg';

              return (
                <article key={article.id} className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all duration-700 flex flex-col border border-gray-100/30">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={displayImage} 
                      alt={article.title} 
                      className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" 
                      onError={(e) => { e.target.src = theme.fallback; }}
                    />
                    <div className="absolute top-5 left-5">
                      <span className={`px-4 py-1 ${theme.bg} ${theme.text} text-[10px] font-black rounded-lg uppercase tracking-[0.2em] shadow-sm`}>
                        {UI_CATEGORIES.find(c => c.id === category)?.label || category}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 pt-10 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-mamacare-teal transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-1 font-medium line-clamp-3">
                      {article.summary}
                    </p>
                    <button className="flex items-center gap-2 text-[#006a68] font-bold text-sm tracking-tight group/btn border-b-2 border-transparent hover:border-[#006a68] w-fit pb-1 transition-all">
                      Read More 
                      <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                <Search size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-400">No Articles Found</h3>
            </div>
          )}
        </section>

        {/* Signature "Peace of Mind" Featurette */}
        <section className="mt-32 p-16 bg-[#003e3d] rounded-[3rem] relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#4cafad]/10 rounded-full blur-[100px] -mr-64 -mt-64 pointer-events-none" />
          
          <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-black text-white leading-[1.1] tracking-tight">Can't find what you need?</h2>
              <p className="text-white/60 text-lg leading-relaxed font-medium">
                Our clinical library is updated weekly by pediatric and obstetric specialists. Request a topic or speak with a midwife directly.
              </p>
              <div className="flex flex-wrap gap-6 pt-4">
                <button className="px-10 py-5 bg-[#4cafad] text-[#003e3d] font-black text-xs uppercase tracking-widest rounded-2xl transition-all hover:bg-white hover:scale-105 active:scale-95">
                  Speak to Specialist
                </button>
                <button className="px-10 py-5 bg-transparent border-2 border-white/20 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all">
                  Submit Request
                </button>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="w-64 h-64 rounded-full bg-white/5 border border-white/10 flex items-center justify-center animate-pulse">
                <HeartPulse size={100} className="text-[#4cafad]" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Library;
