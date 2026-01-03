
import { Photo, BlogPost } from '../types.ts';

// Safely access environment variables to prevent ReferenceErrors in browser ESM
const getEnv = (key: string): string | undefined => {
  try {
    // Try process.env first (for Vite build-time replacement)
    if (typeof process !== 'undefined' && process.env) {
      const value = process.env[key];
      if (value) return value;
    }
    // Fallback: try to get from window (for runtime injection)
    if (typeof window !== 'undefined' && (window as any).__ENV__) {
      return (window as any).__ENV__[key];
    }
  } catch (e) {
    // process.env is not available
  }
  return undefined;
};

const HYGRAPH_ENDPOINT = getEnv('HYGRAPH_ENDPOINT');

export const isCmsConfigured = (): boolean => {
  return !!HYGRAPH_ENDPOINT;
};

export const getPhotos = async (): Promise<Photo[]> => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/4cf3cb96-7efe-45ea-9e52-c83cb01fb542',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'cmsService.ts:28',message:'getPhotos called',data:{isConfigured:isCmsConfigured()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  if (!isCmsConfigured()) return [];

  const query = `
    query GetPhotos {
      photos(orderBy: createdAt_DESC) {
        id
        title
        location
        image {
          url
          width
          height
        }
      }
    }
  `;

  try {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/4cf3cb96-7efe-45ea-9e52-c83cb01fb542',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'cmsService.ts:49',message:'fetching photos from Hygraph',data:{endpoint:HYGRAPH_ENDPOINT?HYGRAPH_ENDPOINT.substring(0,50)+'...':'undefined'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    const response = await fetch(HYGRAPH_ENDPOINT!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/4cf3cb96-7efe-45ea-9e52-c83cb01fb542',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'cmsService.ts:56',message:'photos fetch response received',data:{status:response.status,ok:response.ok},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    const { data } = await response.json();
    if (!data || !data.photos) return [];

    return data.photos.map((p: any) => ({
      id: p.id,
      url: p.image.url,
      thumbnail: `${p.image.url}?width=600`,
      title: p.title,
      location: p.location,
      width: p.image.width,
      height: p.image.height,
    }));
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/4cf3cb96-7efe-45ea-9e52-c83cb01fb542',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'cmsService.ts:66',message:'getPhotos error',data:{errorMessage:error instanceof Error?error.message:String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    console.error('Hygraph Photo Fetch Error:', error);
    return [];
  }
};

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/4cf3cb96-7efe-45ea-9e52-c83cb01fb542',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'cmsService.ts:77',message:'getBlogPosts called',data:{isConfigured:isCmsConfigured()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  if (!isCmsConfigured()) return [];

  const query = `
    query GetBlogPosts {
      blogPosts(orderBy: date_DESC) {
        id
        title
        excerpt
        content
        date
        readTime
        coverImage {
          url
        }
        gallery {
          url
        }
        tags
      }
    }
  `;

  try {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/4cf3cb96-7efe-45ea-9e52-c83cb01fb542',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'cmsService.ts:100',message:'fetching blog posts from Hygraph',data:{endpoint:HYGRAPH_ENDPOINT?HYGRAPH_ENDPOINT.substring(0,50)+'...':'undefined'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    const response = await fetch(HYGRAPH_ENDPOINT!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/4cf3cb96-7efe-45ea-9e52-c83cb01fb542',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'cmsService.ts:107',message:'blog posts fetch response received',data:{status:response.status,ok:response.ok},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    const { data } = await response.json();
    if (!data || !data.blogPosts) return [];

    return data.blogPosts.map((post: any) => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      date: new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime: post.readTime,
      coverImage: post.coverImage?.url || '',
      gallery: post.gallery?.map((img: any) => img.url) || [],
      tags: post.tags || [],
    }));
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/4cf3cb96-7efe-45ea-9e52-c83cb01fb542',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'cmsService.ts:121',message:'getBlogPosts error',data:{errorMessage:error instanceof Error?error.message:String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    console.error('Hygraph Blog Fetch Error:', error);
    return [];
  }
};