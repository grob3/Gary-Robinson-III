import { Photo, BlogPost } from '../types';

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;
const BASE_URL = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/master/entries`;

// Helper to resolve assets from Contentful's "includes" response
const resolveAsset = (assetId: string, assets: any[]) => {
  return assets.find((asset: any) => asset.sys.id === assetId);
};

export const isCmsConfigured = (): boolean => {
  return !!(SPACE_ID && ACCESS_TOKEN);
};

export const getPhotos = async (): Promise<Photo[]> => {
  if (!isCmsConfigured()) return [];

  try {
    const response = await fetch(
      `${BASE_URL}?access_token=${ACCESS_TOKEN}&content_type=photo&order=-sys.createdAt`
    );
    
    if (!response.ok) throw new Error('Failed to fetch photos');
    
    const data = await response.json();
    const assets = data.includes?.Asset || [];

    return data.items.map((item: any) => {
      const imageId = item.fields.image?.sys?.id;
      const asset = imageId ? resolveAsset(imageId, assets) : null;
      const imageUrl = asset ? `https:${asset.fields.file.url}` : '';
      
      // Extract dimensions if available in asset metadata
      const details = asset?.fields?.file?.details?.image || { width: 800, height: 600 };

      return {
        id: item.sys.id,
        url: imageUrl,
        thumbnail: imageUrl ? `${imageUrl}?w=600` : '',
        title: item.fields.title || 'Untitled',
        location: item.fields.location || 'Unknown Location',
        width: details.width,
        height: details.height
      };
    });
  } catch (error) {
    console.error('Error fetching photos from CMS:', error);
    return [];
  }
};

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  if (!isCmsConfigured()) return [];

  try {
    const response = await fetch(
      `${BASE_URL}?access_token=${ACCESS_TOKEN}&content_type=blogPost&order=-fields.date`
    );

    if (!response.ok) throw new Error('Failed to fetch blog posts');

    const data = await response.json();
    const assets = data.includes?.Asset || [];

    return data.items.map((item: any) => {
      // Resolve Cover Image
      const coverId = item.fields.coverImage?.sys?.id;
      const coverAsset = coverId ? resolveAsset(coverId, assets) : null;
      const coverUrl = coverAsset ? `https:${coverAsset.fields.file.url}` : '';

      // Resolve Gallery Images
      const galleryUrls = (item.fields.gallery || []).map((ref: any) => {
        const asset = resolveAsset(ref.sys.id, assets);
        return asset ? `https:${asset.fields.file.url}` : null;
      }).filter(Boolean) as string[];

      return {
        id: item.sys.id,
        title: item.fields.title || 'Untitled',
        excerpt: item.fields.excerpt || '',
        content: item.fields.content || '', // Assumes Long Text field
        date: item.fields.date || new Date().toISOString(),
        readTime: item.fields.readTime || '5 min read',
        coverImage: coverUrl,
        gallery: galleryUrls,
        tags: item.fields.tags || []
      };
    });
  } catch (error) {
    console.error('Error fetching blog posts from CMS:', error);
    return [];
  }
};
