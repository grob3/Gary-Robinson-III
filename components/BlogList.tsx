
import React from 'react';
import { BlogPost } from '../types.ts';
import { ArrowRight, Calendar, Clock } from 'lucide-react';

interface BlogListProps {
  posts: BlogPost[];
  onSelectPost: (post: BlogPost) => void;
}

const BlogList: React.FC<BlogListProps> = ({ posts, onSelectPost }) => {
  return (
    <div className="container mx-auto px-6 py-32 animate-fade-in">
      <div className="flex items-end justify-between mb-16 border-b border-gray-200 dark:border-white/10 pb-8 transition-colors duration-500">
        <div>
          <h2 className="text-4xl md:text-6xl font-bold mb-2 text-gray-900 dark:text-white transition-colors duration-500">Journal</h2>
          <p className="text-gray-500">Stories, techniques, and visual essays.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {posts.map((post) => (
          <article 
            key={post.id} 
            className="group cursor-pointer flex flex-col gap-4"
            onClick={() => onSelectPost(post)}
          >
            <div className="aspect-[16/9] overflow-hidden rounded-sm bg-gray-100 dark:bg-gray-900 relative">
              <img 
                src={post.coverImage} 
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/5 pointer-events-none" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-widest text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {post.date}
                </span>
                <span className="w-px h-3 bg-gray-300 dark:bg-gray-700" />
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {post.readTime}
                </span>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white group-hover:text-[#CE191D] transition-colors">
                {post.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>

              <div className="pt-2 flex items-center text-[#1F6B91] font-bold text-sm tracking-wide group-hover:translate-x-2 transition-transform duration-300">
                READ ARTICLE <ArrowRight size={16} className="ml-2" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default BlogList;