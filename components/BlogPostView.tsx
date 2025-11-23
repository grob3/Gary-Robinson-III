import React from 'react';
import { BlogPost } from '../types';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';

interface BlogPostViewProps {
  post: BlogPost;
  onBack: () => void;
}

const BlogPostView: React.FC<BlogPostViewProps> = ({ post, onBack }) => {
  return (
    <article className="min-h-screen bg-gray-50 dark:bg-[#050505] pb-24 animate-fade-in-up">
      {/* Hero Image */}
      <div className="h-[50vh] md:h-[60vh] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10" />
        <img 
          src={post.coverImage} 
          alt={post.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-24 left-6 z-20">
             <button 
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full transition-all text-sm font-medium tracking-wide uppercase"
              >
                <ArrowLeft size={16} /> Back to Journal
              </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-20 bg-gradient-to-t from-black/80 to-transparent">
          <div className="container mx-auto max-w-4xl">
             <div className="flex items-center gap-4 text-white/80 font-mono text-sm mb-4">
                <span className="flex items-center gap-2"><Calendar size={14}/> {post.date}</span>
                <span>•</span>
                <span>{post.readTime}</span>
             </div>
             <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4 shadow-black drop-shadow-lg">
                {post.title}
             </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-3xl -mt-8 relative z-30">
        <div className="bg-white dark:bg-[#111] p-8 md:p-12 shadow-2xl rounded-sm border border-gray-100 dark:border-gray-800">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold uppercase tracking-wider rounded-sm flex items-center gap-1">
                        <Tag size={10} /> {tag}
                    </span>
                ))}
            </div>

            {/* Content Body */}
            <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
                {post.content.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-6 leading-relaxed text-gray-800 dark:text-gray-300">
                        {paragraph}
                    </p>
                ))}
            </div>
        </div>
      </div>

      {/* Gallery Section within Blog */}
      {post.gallery && post.gallery.length > 0 && (
          <div className="container mx-auto px-6 max-w-5xl mt-16">
              <h3 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white border-l-4 border-[#CE191D] pl-4">Visual Gallery</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {post.gallery.map((img, idx) => (
                      <div key={idx} className="group relative overflow-hidden aspect-[4/3] rounded-sm bg-gray-200 dark:bg-gray-900">
                          <img 
                            src={img} 
                            alt={`Gallery ${idx}`}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                          />
                      </div>
                  ))}
              </div>
          </div>
      )}
    </article>
  );
};

export default BlogPostView;