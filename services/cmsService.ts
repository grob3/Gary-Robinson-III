
import { Photo, BlogPost } from '../types';

const HYGRAPH_ENDPOINT = process.env.HYGRAPH_ENDPOINT;

export const isCmsConfigured = (): boolean => {
  return !!HYGRAPH_ENDPOINT;
};

export const getPhotos = async (): Promise<Photo[]> => {
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
    const response = await fetch(HYGRAPH_ENDPOINT!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    const { data } = await response.json();
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
    console.error('Hygraph Photo Fetch Error:', error);
    return [];
  }
};

export const getBlogPosts = async (): Promise<BlogPost[]> => {
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
    const response = await fetch(HYGRAPH_ENDPOINT!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    const { data } = await response.json();
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
    console.error('Hygraph Blog Fetch Error:', error);
    return [];
  }
};
