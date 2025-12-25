
import React, { useState, useEffect, useCallback } from 'react';
import Logo from './components/Logo';
import ParallaxBackground from './components/ParallaxBackground';
import PhotoModal from './components/PhotoModal';
import BlogList from './components/BlogList';
import BlogPostView from './components/BlogPostView';
import { Photo, BlogPost } from './types';
import { Camera, Instagram, Mail, ArrowDown, Sun, Moon, Loader2, ShieldAlert, Lock } from 'lucide-react';
import { getPhotos, getBlogPosts, isCmsConfigured } from './services/cmsService';

// Fallback / Demo Data
const DEMO_PHOTOS: Photo[] = Array.from({ length: 12 }).map((_, i) => {
  const width = i % 3 === 0 ? 800 : 600;
  const height = i % 2 === 0 ? 1200 : 800; 
  return {
    id: i,
    url: `https://picsum.photos/${width}/${height}?random=${i + 10}`,
    thumbnail: `https://picsum.photos/400/600?random=${i + 10}`,
    title: `Composition #${i + 1}`,
    location: ['Tokyo, Japan', 'Berlin, Germany', 'New York, USA', 'Reykjavik, Iceland'][i % 4],
    width,
    height
  };
});

const DEMO_BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Geometry of Silence',
    date: 'Oct 12, 2024',
    readTime: '5 min read',
    excerpt: 'Exploring the quiet spaces in brutalist architecture and finding peace in concrete structures.',
    content: `Brutalism is often misunderstood. To many, it represents cold, imposing structures that lack humanity. To me, it is the purest form of architectural honesty. The raw concrete, the sharp angles, the interplay of light and shadow—it all speaks to a quiet strength that doesn't need to shout to be heard.\n\nIn this series, I traveled to Berlin to document the remnants of mid-century functionalism. I found that if you wait long enough, the sun softens even the hardest edges. The silence in these spaces is not empty; it is full of history, waiting to be acknowledged.\n\nPhotography, in this context, becomes an act of meditation. I spend hours waiting for the light to hit a specific corner, for a passerby to create the perfect scale reference. It is a slow process, one that requires patience and a willingness to see beauty where others see only grey.`,
    coverImage: 'https://picsum.photos/1200/600?random=101',
    tags: ['Architecture', 'Philosophy', 'Berlin'],
    gallery: [
       'https://picsum.photos/800/600?random=102',
       'https://picsum.photos/800/600?random=103',
       'https://picsum.photos/800/600?random=104'
    ]
  }
];

type ViewState = 'home' | 'blog' | 'blog-post';

function App() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [view, setView] = useState<ViewState>('home');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  
  // Protection State
  const [showProtectionToast, setShowProtectionToast] = useState(false);

  // Copyright Protection Handlers
  const handleProtectionTrigger = useCallback((e: any) => {
    e.preventDefault();
    setShowProtectionToast(true);
    setTimeout(() => setShowProtectionToast(false), 3000);
  }, []);

  useEffect(() => {
    // Disable right click
    window.addEventListener('contextmenu', handleProtectionTrigger);
    // Disable drag globally for images
    window.addEventListener('dragstart', handleProtectionTrigger);
    
    return () => {
      window.removeEventListener('contextmenu', handleProtectionTrigger);
      window.removeEventListener('dragstart', handleProtectionTrigger);
    };
  }, [handleProtectionTrigger]);

  // Load Content
  useEffect(() => {
    const loadContent = async () => {
      setLoadingData(true);
      const [cmsPhotos, cmsPosts] = await Promise.all([getPhotos(), getBlogPosts()]);
      setPhotos(cmsPhotos.length > 0 ? cmsPhotos : DEMO_PHOTOS);
      setBlogPosts(cmsPosts.length > 0 ? cmsPosts : DEMO_BLOG_POSTS);
      setLoadingData(false);
    };
    loadContent();
  }, []);

  // Theme Logic
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    } else {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => setScrollY(window.scrollY));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goHome = (anchor?: string) => {
    setView('home');
    setActivePost(null);
    if (anchor) {
      setTimeout(() => {
        document.querySelector(anchor)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const opacity = Math.min(1, Math.max(0, 1 - (scrollY - 300) / 300));
  const focusOffset = Math.max(0, 60 - scrollY * 1.2);

  if (loadingData) {
     return (
       <div className="min-h-screen bg-gray-50 dark:bg-[#050505] flex flex-col items-center justify-center text-gray-900 dark:text-white">
         <Loader2 size={40} className="animate-spin mb-4 text-[#CE191D]" />
         <p className="font-mono text-xs tracking-[0.3em] uppercase opacity-50">Initializing Secure Portfolio...</p>
       </div>
     );
  }

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-white selection:bg-[#CE191D] selection:text-white font-sans transition-colors duration-500 overflow-x-hidden">
      <ParallaxBackground />

      {/* Copyright Protection Toast */}
      {showProtectionToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-fade-in-up">
           <div className="bg-black/90 dark:bg-white/95 backdrop-blur-xl text-white dark:text-black px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-white/10 dark:border-black/5">
              <Lock size={16} className="text-[#CE191D]" />
              <span className="text-xs font-bold tracking-widest uppercase">Content Protected</span>
           </div>
        </div>
      )}

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrollY > 50 ? 'bg-white/80 dark:bg-black/80 backdrop-blur-md py-4 border-b border-gray-200 dark:border-white/5' : 'py-8 bg-transparent'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div onClick={() => goHome()} className="cursor-pointer"><Logo /></div>
          <div className="flex items-center gap-8">
            <nav className="hidden md:flex space-x-8 text-[10px] font-bold tracking-[0.2em] uppercase text-gray-900 dark:text-white">
              <button onClick={() => goHome('#gallery')} className="hover:text-[#CE191D] transition-colors">Work</button>
              <button onClick={() => setView('blog')} className={`hover:text-[#CE191D] transition-colors ${view.includes('blog') ? 'text-[#CE191D]' : ''}`}>Journal</button>
              <button onClick={() => goHome('#about')} className="hover:text-[#70B786] transition-colors">About</button>
              <button onClick={() => goHome('#contact')} className="hover:text-[#1F6B91] transition-colors">Contact</button>
            </nav>
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>

      <main>
        {view === 'home' && (
          <>
            {/* Hero */}
            <section className="relative h-screen flex items-center justify-center">
              <div 
                className="absolute inset-0 opacity-20 dark:opacity-40 bg-[url('https://picsum.photos/1920/1080?grayscale')] bg-cover bg-center"
                style={{ transform: `scale(${1 + scrollY * 0.0005})` }} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-[#050505] via-transparent to-transparent z-10" />
              
              <div className="relative z-20 w-[90vw] max-w-[800px] aspect-[3/2] border border-black/10 dark:border-white/10 flex items-center justify-center bg-white/5 dark:bg-black/5 backdrop-blur-[1px]" style={{ opacity }}>
                 <div className="absolute top-6 left-6 w-8 h-8 border-t-[2px] border-l-[2px] border-gray-900 dark:border-white"></div>
                 <div className="absolute top-6 right-6 w-8 h-8 border-t-[2px] border-r-[2px] border-gray-900 dark:border-white"></div>
                 <div className="absolute bottom-6 left-6 w-8 h-8 border-b-[2px] border-l-[2px] border-gray-900 dark:border-white"></div>
                 <div className="absolute bottom-6 right-6 w-8 h-8 border-b-[2px] border-r-[2px] border-gray-900 dark:border-white"></div>

                 <div className="relative flex flex-col items-center">
                    <div className="relative">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-gray-400 dark:text-gray-600 mix-blend-multiply dark:mix-blend-overlay absolute top-0 left-0 w-full text-center whitespace-nowrap opacity-60 blur-[0.5px]" style={{ transform: `translateX(${focusOffset}px)` }}>GARY ROBINSON, III</h1>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-gray-900 dark:text-white relative z-10 text-center whitespace-nowrap">GARY ROBINSON, III</h1>
                    </div>
                    <div className="mt-6 flex items-center gap-4 opacity-80">
                        <div className="h-[1px] w-12 bg-[#CE191D]"></div>
                        <p className="text-[10px] font-mono text-gray-600 dark:text-gray-300 tracking-[0.5em] uppercase">Visual Artist</p>
                        <div className="h-[1px] w-12 bg-[#1F6B91]"></div>
                    </div>
                 </div>
              </div>
            </section>

            {/* Gallery */}
            <section id="gallery" className="relative z-20 py-32 container mx-auto px-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-4 border-b border-gray-200 dark:border-white/10 pb-8">
                <div>
                  <h2 className="text-5xl font-bold mb-2 text-gray-900 dark:text-white">Selected Works</h2>
                  <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">© Private Collection</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {photos.map((photo, index) => (
                  <div 
                    key={photo.id}
                    onClick={() => setSelectedPhoto(photo)}
                    className="group relative cursor-pointer"
                    style={{ marginTop: index % 2 !== 0 ? '4rem' : '0' }}
                  >
                    <div className="aspect-[3/4] overflow-hidden bg-gray-200 dark:bg-gray-900 relative">
                       <img 
                        src={photo.thumbnail} 
                        alt={photo.title}
                        draggable="false"
                        onContextMenu={(e) => e.preventDefault()}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 pointer-events-none"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-500 flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100">
                        <div className="flex items-center gap-2 mb-2">
                           <ShieldAlert size={14} className="text-[#CE191D]" />
                           <span className="text-[10px] text-white font-bold tracking-widest uppercase">Copyright Protected</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white leading-none mb-2">{photo.title}</h3>
                        <p className="text-xs text-gray-300 font-mono">{photo.location}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {view === 'blog' && (
          <BlogList 
            posts={blogPosts} 
            onSelectPost={(p) => { setActivePost(p); setView('blog-post'); window.scrollTo(0,0); }} 
          />
        )}

        {view === 'blog-post' && activePost && (
          <BlogPostView 
            post={activePost} 
            onBack={() => setView('blog')} 
          />
        )}
      </main>

      <footer className="relative z-20 py-20 bg-white dark:bg-[#080808] border-t border-gray-200 dark:border-white/5 text-center">
        <div className="container mx-auto px-6">
            <Logo />
            <div className="mt-8 flex flex-col items-center gap-2">
                <p className="text-gray-900 dark:text-white text-xs font-bold tracking-[0.3em] uppercase">
                   © {new Date().getFullYear()} Gary Robinson III
                </p>
                <p className="text-gray-500 text-[10px] max-w-sm mx-auto leading-relaxed">
                   All photographs and design elements are protected under international copyright law. Unauthorized reproduction or use is strictly prohibited.
                </p>
                <div className="mt-4 flex items-center justify-center gap-4">
                   <div className={`h-1.5 w-1.5 rounded-full ${isCmsConfigured() ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                   <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                      {isCmsConfigured() ? 'Hygraph Active' : 'Demo Mode Enabled'}
                   </span>
                </div>
            </div>
        </div>
      </footer>

      {selectedPhoto && <PhotoModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />}
    </div>
  );
}

export default App;
