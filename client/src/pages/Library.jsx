import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import { Search, MessageSquare, BookOpen, ChevronRight, Utensils, Shield, Brain, Baby, ArrowUpRight } from 'lucide-react';
import { libraryApi } from '../api/services';

const CATEGORY_META = {
  Nutrition:        { title: 'Nutrition',          desc: 'Essential vitamins, diet plans, and safe foods for you and your baby.', icon: Utensils, color: 'text-mamacare-teal', bg: 'bg-teal-50' },
  Safety:           { title: 'Pregnancy Safety',   desc: 'Navigating everyday activities, travel, and medications safely.',       icon: Shield,   color: 'text-red-400',         bg: 'bg-red-50' },
  MentalHealth:     { title: 'Mental Health',      desc: 'Mindfulness, postpartum wellness, and managing emotional shifts.',      icon: Brain,    color: 'text-orange-400',      bg: 'bg-orange-50' },
  FetalDevelopment: { title: 'Fetal Development',  desc: 'Understanding how your baby grows month by month.',                    icon: Baby,     color: 'text-blue-400',        bg: 'bg-blue-50' },
};

const Library = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    libraryApi.getAll({ status: 'Published' })
      .then(r => setArticles(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const featured = articles[0];

  const categories = Object.entries(CATEGORY_META).map(([key, meta]) => ({
    id: key,
    ...meta,
    articles: articles.filter(a => a.category === key).length,
  }));

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-poppins pb-20">
      <Navbar />

      <main className="pt-32 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-7xl font-bold text-[#005C5C] tracking-tight">Health Library</h1>
          <p className="text-gray-400 font-medium max-w-2xl mx-auto text-lg leading-relaxed">
            Empowering your journey with evidence-based guidance. Explore curated articles on maternal health and newborn care.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto relative group">
          <div className="absolute inset-y-0 left-6 flex items-center text-gray-400 pointer-events-none transition-colors group-focus-within:text-mamacare-teal">
            <Search size={22} />
          </div>
          <input
            type="text"
            placeholder='Search topics like "Nutrition" or "Exercise"...'
            className="w-full bg-[#E5EAEB] border-none rounded-full py-6 pl-16 pr-32 text-gray-700 font-medium focus:ring-4 focus:ring-mamacare-teal/5 focus:bg-white transition-all shadow-sm outline-none"
          />
          <button className="absolute right-2 top-2 bottom-2 bg-[#005C5C] text-white px-10 rounded-full font-bold text-sm hover:bg-mamacare-teal-dark transition-all shadow-lg active:scale-95 shadow-mamacare-teal/20">
            Explore
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Featured Article */}
          <div className="lg:col-span-8 relative group cursor-pointer overflow-hidden rounded-[3rem] shadow-2xl h-[600px]">
            {loading ? (
              <div className="w-full h-full bg-gray-100 animate-pulse rounded-[3rem]" />
            ) : featured ? (
              <>
                <img
                  src={featured.imageUrl && !featured.imageUrl.includes('unsplash') ? featured.imageUrl : '/SleepingPrWoman.jpg'}
                  alt={featured.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-12 md:p-16 space-y-6 max-w-2xl">
                  <span className="px-5 py-2 bg-[#FFEBEE] text-[#F44336] text-[10px] font-extrabold uppercase tracking-widest rounded-full">New Release</span>
                  <h2 className="text-5xl font-bold text-white leading-[1.1] tracking-tight">{featured.title}</h2>
                  <p className="text-white/70 text-lg leading-relaxed font-medium">{featured.summary}</p>
                  <button className="bg-white text-gray-900 px-12 py-5 rounded-full font-bold shadow-xl hover:bg-mamacare-teal hover:text-white transition-all transform active:scale-95">
                    Read Full Article
                  </button>
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-gray-50 flex items-center justify-center rounded-[3rem]">
                <p className="text-gray-400 font-medium">No articles available.</p>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-[#007F80] rounded-[2.5rem] p-10 text-white space-y-8 relative overflow-hidden group shadow-xl">
              <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 transition-transform duration-1000 group-hover:scale-110">
                <MessageSquare size={120} />
              </div>
              <h3 className="text-3xl font-bold leading-tight relative z-10">Can't find what you need?</h3>
              <p className="text-white/80 font-medium relative z-10 text-sm leading-relaxed">
                Our medical team is constantly updating the library. Let us know what you want to learn about next.
              </p>
              <button className="w-full bg-white/20 backdrop-blur-md border border-white/20 py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white hover:text-mamacare-teal transition-all relative z-10 group/btn shadow-lg shadow-black/5">
                <BookOpen size={20} className="transition-transform group-hover/btn:scale-110" />
                Suggest a Topic
              </button>
            </div>

            <div className="bg-[#FDE2D2] rounded-[2.5rem] p-10 space-y-6 border border-[#FBE9E7] shadow-lg relative overflow-hidden group">
              <div className="w-12 h-12 bg-white/50 rounded-2xl flex items-center justify-center text-[#CB8F00] backdrop-blur-md">
                <Shield size={22} fill="currentColor" opacity="0.2" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#CB8F00]">QUICK GUIDE</span>
              <div className="space-y-4">
                <h4 className="text-2xl font-bold text-gray-900 leading-tight tracking-tight">Weekly Milestones</h4>
                <p className="text-[#8D6E63] text-sm font-medium leading-relaxed">
                  Track your baby's growth and your body's changes every week.
                </p>
                <button className="flex items-center gap-2 text-gray-900 font-bold group/link text-sm uppercase tracking-widest pt-2">
                  Open Tracker
                  <ChevronRight size={18} className="transition-transform group-hover/link:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <section className="space-y-10 pt-10">
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Explore by Category</h2>
              <p className="text-gray-400 font-medium">Specialized knowledge for every stage of motherhood.</p>
            </div>
            <button className="text-mamacare-teal font-bold flex items-center gap-2 group text-sm uppercase tracking-widest">
              View All Categories
              <ChevronRight size={20} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-white rounded-[2.5rem] p-10 border border-gray-50 shadow-card hover:shadow-2xl transition-all duration-500 cursor-pointer group flex flex-col h-full active:scale-[0.98]">
                <div className={`w-16 h-16 ${cat.bg} rounded-3xl flex items-center justify-center ${cat.color} mb-8 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                  <cat.icon size={32} />
                </div>
                <div className="space-y-4 flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{cat.title}</h3>
                  <p className="text-gray-400 font-medium text-sm leading-relaxed">{cat.desc}</p>
                </div>
                <div className="pt-8 flex justify-between items-center text-[10px] font-bold text-[#AAB4B7] uppercase tracking-widest">
                  <span>{loading ? '—' : cat.articles} ARTICLES</span>
                  <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-mamacare-teal group-hover:text-white transition-all duration-500">
                    <ArrowUpRight size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="pt-32 pb-12 px-8 border-t border-gray-100 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <span className="text-xl font-bold text-mamacare-teal tracking-tight">MamaCare</span>
          <div className="flex flex-wrap justify-center items-center gap-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <a href="/emergency" className="text-red-500 flex items-center gap-2">Emergency Call</a>
            <a href="/privacy" className="hover:text-mamacare-teal transition-colors">Privacy Policy</a>
            <a href="/help" className="hover:text-mamacare-teal transition-colors">Help Center</a>
            <a href="/terms" className="hover:text-mamacare-teal transition-colors">Terms</a>
          </div>
          <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">© 2026 MamaCare Maternal Health Platform.</p>
        </div>
      </footer>
    </div>
  );
};

export default Library;
