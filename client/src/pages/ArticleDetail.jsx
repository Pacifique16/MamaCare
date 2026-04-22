import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { libraryApi } from '../api/services';
import { ChevronLeft, Clock, Tag } from 'lucide-react';

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

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    libraryApi.getById(id)
      .then(r => {
        setArticle(r.data);
        // Load related articles from same category
        return libraryApi.getAll({ status: 'Published' });
      })
      .then(r => setRelated(r.data.filter(a => a.id !== Number(id)).slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-white font-poppins">
      <Navbar />
      <div className="pt-40 flex justify-center">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-mamacare-teal rounded-full animate-spin" />
      </div>
    </div>
  );

  if (!article) return (
    <div className="min-h-screen bg-white font-poppins">
      <Navbar />
      <div className="pt-40 text-center space-y-4">
        <p className="text-2xl font-bold text-gray-400">Article not found.</p>
        <Link to="/library" className="text-mamacare-teal font-bold hover:underline">← Back to Library</Link>
      </div>
    </div>
  );

  const theme = CATEGORY_THEMES[article.category] || CATEGORY_THEMES.Default;

  // Local image overrides
  const displayImage = getArticleImage(article);

  return (
    <div className="min-h-screen bg-white font-poppins">
      <Navbar />
      <main className="pt-32 pb-20 max-w-3xl mx-auto px-6 space-y-10">

        {/* Back */}
        <Link to="/library" className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-600 hover:text-mamacare-teal transition-colors">
          <ChevronLeft size={16} /> Back to Library
        </Link>

        {/* Hero Image */}
        <div className="w-full h-72 rounded-[2.5rem] overflow-hidden shadow-xl">
          <img src={displayImage} alt={article.title} className="w-full h-full object-cover" />
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`px-4 py-1.5 ${theme.bg} ${theme.text} text-[10px] font-black rounded-lg uppercase tracking-[0.2em]`}>
            {theme.label}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
            <Clock size={13} />
            {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-black text-[#003e3d] tracking-tight leading-tight">
          {article.title}
        </h1>

        {/* Summary */}
        <p className="text-lg text-gray-500 font-medium leading-relaxed border-l-4 border-mamacare-teal pl-6">
          {article.summary}
        </p>

        {/* Content */}
        {(article.content || article.Content) ? (
          <div className="max-w-none text-gray-700 leading-relaxed space-y-4 [&_h2]:text-[#003e3d] [&_h2]:font-black [&_h2]:text-2xl [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-[#003e3d] [&_h3]:font-black [&_h3]:text-xl [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_li]:text-gray-600"
            dangerouslySetInnerHTML={{ __html: article.content || article.Content }} />
        ) : (
          <div className="bg-[#F2FBFA] rounded-[2rem] p-10 space-y-4 text-center">
            <p className="text-mamacare-teal font-bold text-lg">Full article coming soon.</p>
            <p className="text-gray-500 font-medium text-sm">
              Our clinical team is preparing the full content for this article. Check back soon or explore related topics below.
            </p>
          </div>
        )}

        {/* Related Articles */}
        {related.length > 0 && (
          <div className="space-y-6 pt-10 border-t border-gray-100">
            <h3 className="text-[10px] font-black text-mamacare-teal uppercase tracking-[0.25em]">Related Articles</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map(a => {
                const t = CATEGORY_THEMES[a.category] || CATEGORY_THEMES.Default;
                return (
                  <Link key={a.id} to={`/library/${a.id}`}
                    className="group bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all">
                    <div className="h-32 overflow-hidden">
                      <img src={getArticleImage(a)} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={e => { e.target.src = (CATEGORY_THEMES[a.category] || CATEGORY_THEMES.Default).fallback; }} />
                    </div>
                    <div className="p-4">
                      <p className="font-bold text-gray-900 text-sm leading-tight group-hover:text-mamacare-teal transition-colors line-clamp-2">{a.title}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ArticleDetail;
