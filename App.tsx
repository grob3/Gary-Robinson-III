import React, { useState, useEffect } from 'react';
import Logo from './components/Logo';
import ParallaxBackground from './components/ParallaxBackground';
import PhotoModal from './components/PhotoModal';
import BlogList from './components/BlogList';
import BlogPostView from './components/BlogPostView';
import { Photo, BlogPost } from './types';
import { Camera, Instagram, Mail, ArrowDown, Sun, Moon, Loader2 } from 'lucide-react';
import { getPhotos, getBlogPosts, isCmsConfigured } from './services/contentfulService';

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
    content: `Brutalism is often misunderstood. To many, it represents cold, imposing structures that lack humanity. To me, it is the purest form of architectural honesty. The raw concrete, the sharp angles, the interplay of light and shadow—it all speaks to a quiet strength that doesn't need to shout to be heard.

In this series, I traveled to Berlin to document the remnants of mid-century functionalism. I found that if you wait long enough, the sun softens even the hardest edges. The silence in these spaces is not empty; it is full of history, waiting to be acknowledged.

Photography, in this context, becomes an act of meditation. I spend hours waiting for the light to hit a specific corner, for a passerby to create the perfect scale reference. It is a slow process, one that requires patience and a willingness to see beauty where others see only grey.`,
    coverImage: 'https://picsum.photos/1200/600?random=101',
    tags: ['Architecture', 'Philosophy', 'Berlin'],
    gallery: [
       'https://picsum.photos/800/600?random=102',
       'https://picsum.photos/800/600?random=103',
       'https://picsum.photos/800/600?random=104'
    ]
  },
  {
    id: '2',
    title: 'Night Walks in Shinjuku',
    date: 'Sep 28, 2024',
    readTime: '3 min read',
    excerpt: 'A visual diary of neon lights, rain-slicked streets, and the solitary figures of the Tokyo night.',
    content: `There is no city quite like Tokyo at night. The sensory overload is immediate—the hum of electricity, the endless sea of neon signage, the rhythm of millions of people moving in sync. Yet, amidst this chaos, there are pockets of profound isolation.

My goal with this project was to capture that specific feeling of being alone in a crowd. Using high-speed film (and its digital equivalents), I pushed the ISO to embrace the grain. I wanted the images to feel textured, almost tactile, like the humid air of a Japanese summer night.

We often think of darkness as the absence of light, but in Shinjuku, darkness is a canvas for color. The blues of the vending machines, the reds of the brake lights, the greens of the taxi indicators—they all paint the night in vivid hues.`,
    coverImage: 'https://picsum.photos/1200/600?random=201',
    tags: ['Street Photography', 'Tokyo', 'Night'],
    gallery: [
        'https://picsum.photos/800/600?random=202',
        'https://picsum.photos/800/600?random=203'
    ]
  },
  {
    id: '3',
    title: 'Analog in a Digital World',
    date: 'Aug 15, 2024',
    readTime: '7 min read',
    excerpt: 'Why I still carry a Leica M6 alongside my digital kit, and the importance of slowing down.',
    content: `In an era of instant gratification, shooting film feels like a rebellion. It forces you to slow down, to think before you press the shutter. There is no chimping, no checking the histogram, no deleting a bad shot instantly. You have to trust your gut and your knowledge of light.

I carry my Leica M6 not because it is technically superior to my digital cameras—it isn't. I carry it because it changes how I see. With only 36 frames, every shot matters. I find myself observing more and shooting less.

The imperfections of film—the grain, the slight color shifts, the occasional light leak—add a layer of emotion that digital sensors struggle to replicate. It's not about fidelity; it's about feeling.`,
    coverImage: 'https://picsum.photos/1200/600?random=301',
    tags: ['Gear', 'Analog', 'Philosophy'],
    gallery: []
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
  
  // Navigation State
  const [view, setView] = useState<ViewState>('home');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  // Load Content
  useEffect(() => {
    const loadContent = async () => {
      setLoadingData(true);
      
      // Try fetching from CMS
      const cmsPhotos = await getPhotos();
      const cmsPosts = await getBlogPosts();

      // Use CMS data if available, otherwise fall back to demo data
      setPhotos(cmsPhotos.length > 0 ? cmsPhotos : DEMO_PHOTOS);
      setBlogPosts(cmsPosts.length > 0 ? cmsPosts : DEMO_BLOG_POSTS);
      
      setLoadingData(false);
    };

    loadContent();
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      setTheme('dark');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation Handlers
  const goHome = (anchor?: string) => {
    setView('home');
    setActivePost(null);
    if (anchor) {
      setTimeout(() => {
        const el = document.querySelector(anchor);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const openBlog = () => {
    setView('blog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openBlogPost = (post: BlogPost) => {
    setActivePost(post);
    setView('blog-post');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Rangefinder Focus Calculation
  const focusOffset = Math.max(0, 60 - scrollY * 1.2); // Faster offset (1.2 multiplier) for quicker snap
  const opacity = Math.min(1, Math.max(0, 1 - (scrollY - 300) / 300));

  if (loadingData) {
     return (
       <div className="min-h-screen bg-gray-50 dark:bg-[#050505] flex flex-col items-center justify-center text-gray-900 dark:text-white">
         <Loader2 size={40} className="animate-spin mb-4 text-[#CE191D]" />
         <p className="font-mono text-sm tracking-widest uppercase">Initializing Portfolio...</p>
       </div>
     );
  }

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-white selection:bg-[#CE191D] selection:text-white font-sans transition-colors duration-500">
      <ParallaxBackground />

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrollY > 50 ? 'bg-white/80 dark:bg-black/80 backdrop-blur-md py-4 border-b border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none' : 'py-8 bg-transparent'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div onClick={() => goHome()} title="Home">
             <Logo />
          </div>
          <div className="flex items-center gap-8">
            <nav className="hidden md:flex space-x-8 text-sm font-medium tracking-widest uppercase text-gray-900 dark:text-white">
              <button onClick={() => goHome('#gallery')} className="hover:text-[#CE191D] transition-colors duration-300">Work</button>
              <button onClick={openBlog} className={`hover:text-[#CE191D] transition-colors duration-300 ${view.includes('blog') ? 'text-[#CE191D]' : ''}`}>Journal</button>
              <button onClick={() => goHome('#about')} className="hover:text-[#70B786] transition-colors duration-300">About</button>
              <button onClick={() => goHome('#contact')} className="hover:text-[#1F6B91] transition-colors duration-300">Contact</button>
            </nav>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-gray-900 dark:text-white"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="md:hidden text-gray-900 dark:text-white p-2">
              <div className="w-6 h-0.5 bg-current mb-1.5"></div>
              <div className="w-6 h-0.5 bg-current mb-1.5"></div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Router */}
      <main>
        {view === 'home' && (
          <>
            {/* Hero Section with Rangefinder Effect */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
              <div 
                className="absolute inset-0 z-0 opacity-20 dark:opacity-40 bg-[url('https://picsum.photos/1920/1080?grayscale')] bg-cover bg-center transition-opacity duration-500"
                style={{ transform: `scale(${1 + scrollY * 0.0005})` }} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-gray-50/20 to-transparent dark:from-[#050505] dark:via-black/20 dark:to-black/40 z-10 transition-colors duration-500" />
              
              <div 
                className="relative z-20 w-[90vw] max-w-[800px] aspect-[3/2] border-2 border-black/10 dark:border-white/10 rounded-sm flex items-center justify-center pointer-events-none overflow-hidden bg-white/5 dark:bg-black/5 backdrop-blur-[1px] transition-colors duration-500"
                style={{ opacity }}
              >
                 <div className="absolute top-6 left-6 w-8 h-8 border-t-[3px] border-l-[3px] border-gray-900/90 dark:border-white/90 rounded-tl-sm shadow-[0_0_10px_rgba(0,0,0,0.1)] dark:shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-colors duration-500"></div>
                 <div className="absolute top-6 right-6 w-8 h-8 border-t-[3px] border-r-[3px] border-gray-900/90 dark:border-white/90 rounded-tr-sm shadow-[0_0_10px_rgba(0,0,0,0.1)] dark:shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-colors duration-500"></div>
                 <div className="absolute bottom-6 left-6 w-8 h-8 border-b-[3px] border-l-[3px] border-gray-900/90 dark:border-white/90 rounded-bl-sm shadow-[0_0_10px_rgba(0,0,0,0.1)] dark:shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-colors duration-500"></div>
                 <div className="absolute bottom-6 right-6 w-8 h-8 border-b-[3px] border-r-[3px] border-gray-900/90 dark:border-white/90 rounded-br-sm shadow-[0_0_10px_rgba(0,0,0,0.1)] dark:shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-colors duration-500"></div>

                 <div className="absolute w-[30%] h-[20%] bg-white/5 border border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.05)] backdrop-contrast-125 rounded-sm"></div>

                 <div className="relative z-30 transform scale-90 md:scale-100 flex flex-col items-center">
                     <div className="relative">
                        <h1 
                          className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter text-gray-400 dark:text-gray-600 mix-blend-multiply dark:mix-blend-overlay absolute top-0 left-0 w-full text-center whitespace-nowrap opacity-60 blur-[0.5px] transition-colors duration-500"
                          style={{ 
                            transform: `translateX(${focusOffset}px)`,
                          }}
                        >
                          GARY ROBINSON, III
                        </h1>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter text-gray-900 dark:text-white relative z-10 text-center whitespace-nowrap transition-colors duration-500">
                          GARY ROBINSON, III
                        </h1>
                     </div>
                    
                    <div className="mt-6 flex items-center justify-center gap-4 opacity-80">
                        <div className="h-[1px] w-8 md:w-12 bg-[#CE191D] shadow-[0_0_8px_#CE191D]"></div>
                        <p className="text-xs md:text-sm font-mono text-gray-600 dark:text-gray-300 tracking-[0.4em] uppercase transition-colors duration-500">
                            Photography
                        </p>
                        <div className="h-[1px] w-8 md:w-12 bg-[#1F6B91] shadow-[0_0_8px_#1F6B91]"></div>
                    </div>
                 </div>
              </div>

              <div 
                  className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center gap-2 transition-opacity duration-300"
                  style={{ opacity: Math.max(0, 1 - scrollY / 200) }}
              >
                <span className="text-[10px] font-mono tracking-widest uppercase text-gray-500">Align to Focus</span>
                <ArrowDown className="text-gray-900 dark:text-white animate-bounce transition-colors duration-500" size={20} />
              </div>
            </section>

            {/* Gallery Section */}
            <section id="gallery" className="relative z-20 py-32 container mx-auto px-4 md:px-8">
              <div className="flex items-end justify-between mb-20 border-b border-gray-200 dark:border-white/10 pb-8 transition-colors duration-500">
                <div>
                  <h2 className="text-4xl md:text-6xl font-bold mb-2 text-gray-900 dark:text-white transition-colors duration-500">Selected Works</h2>
                  <p className="text-gray-500">2023 — 2024 Collection</p>
                </div>
                <div className="hidden md:block text-right">
                   <p className="text-sm font-mono text-gray-600">SCROLL TO EXPLORE</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                {photos.map((photo, index) => (
                  <div 
                    key={photo.id}
                    onClick={() => setSelectedPhoto(photo)}
                    className="group relative cursor-pointer"
                    style={{ 
                      marginTop: index % 2 !== 0 ? '4rem' : '0',
                      transform: `translateY(${scrollY * (index % 3 === 0 ? 0.05 : 0)}px)` 
                    }}
                  >
                    <div className="aspect-[3/4] overflow-hidden rounded-sm bg-gray-200 dark:bg-gray-900 relative transition-colors duration-500">
                       <div className="absolute inset-0 bg-gray-300 dark:bg-gray-800 animate-pulse z-0" />
                       <img 
                        src={photo.thumbnail} 
                        alt={photo.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 z-10 relative opacity-90 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 z-20" />
                      
                      {/* Floating details on hover */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0 z-30">
                        <h3 className="text-xl font-bold text-white shadow-black/50 drop-shadow-md">{photo.title}</h3>
                        <p className="text-sm text-gray-200 flex items-center gap-2 mt-1 drop-shadow-md">
                          <span className="w-2 h-0.5 bg-[#CE191D] inline-block"></span>
                          {photo.location}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* About Section */}
            <section id="about" className="relative z-20 py-24 bg-gray-100 dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-white/5 transition-colors duration-500">
              <div className="container mx-auto px-6 max-w-4xl text-center">
                <div className="w-24 h-24 mx-auto bg-gray-200 dark:bg-gray-800 rounded-full mb-8 overflow-hidden relative group border-2 border-gray-300 dark:border-white/10">
                   <img src="https://picsum.photos/200/200?grayscale" alt="Gary Robinson, III" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-8 text-gray-900 dark:text-white transition-colors duration-500">Capturing the Unseen</h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-12 transition-colors duration-500">
                  I am a visual artist drawn to the geometry of urban life and the quiet breath of nature.
                  My work explores the space between reality and abstraction, searching for stillness within chaos.
                  Through my lens, I aim to capture the emotion of a moment — not just what it looked like, but how it felt.
                </p>
                <div className="flex justify-center gap-6" id="contact">
                  <a href="#" className="p-3 border border-gray-300 dark:border-gray-700 rounded-full hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-gray-900 dark:text-white transition-all hover:scale-110">
                    <Camera size={24} />
                  </a>
                  <a href="#" className="p-3 border border-gray-300 dark:border-gray-700 rounded-full hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-gray-900 dark:text-white transition-all hover:scale-110">
                    <Instagram size={24} />
                  </a>
                  <a href="#" className="p-3 border border-gray-300 dark:border-gray-700 rounded-full hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-gray-900 dark:text-white transition-all hover:scale-110">
                    <Mail size={24} />
                  </a>
                </div>
              </div>
            </section>
          </>
        )}

        {view === 'blog' && (
          <BlogList 
            posts={blogPosts} 
            onSelectPost={openBlogPost} 
          />
        )}

        {view === 'blog-post' && activePost && (
          <BlogPostView 
            post={activePost} 
            onBack={openBlog} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-20 py-12 bg-white dark:bg-black border-t border-gray-200 dark:border-white/10 text-center transition-colors duration-500">
        <div className="flex justify-center items-center mb-4 cursor-pointer" onClick={() => goHome()}>
            <Logo />
        </div>
        <p className="text-gray-500 text-sm">© 2024 Gary Robinson Photography. All rights reserved.</p>
        <p className="text-gray-700 dark:text-gray-600 text-xs mt-2 font-mono">
            {isCmsConfigured() ? 'CMS Online' : 'Demo Mode'}
        </p>
      </footer>

      {/* Modal */}
      {selectedPhoto && (
        <PhotoModal 
          photo={selectedPhoto} 
          onClose={() => setSelectedPhoto(null)} 
        />
      )}
    </div>
  );
}

export default App;