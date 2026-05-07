/**
 * Utility to optimize image URLs for performance.
 * Supports Unsplash and Supabase Storage transformations.
 */
export const getOptimizedImageUrl = (url: string, width: number = 600) => {
  if (!url) return '';

  // Handle Unsplash URLs
  if (url.includes('images.unsplash.com')) {
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?auto=format&fit=crop&q=80&w=${width}`;
  }

  // Handle Supabase Storage URLs (assuming standard public URL structure)
  // Requires Supabase Image Transformation to be enabled (Pro plan or self-hosted)
  // If not enabled, it will just return the original URL
  if (url.includes('supabase.co/storage/v1/object/public')) {
    return `${url}?width=${width}&quality=80`;
  }

  return url;
};

export const getProductSrcSet = (url: string) => {
  if (!url || !url.includes('images.unsplash.com')) return undefined;
  
  const baseUrl = url.split('?')[0];
  return `
    ${baseUrl}?auto=format&fit=crop&q=80&w=300 300w,
    ${baseUrl}?auto=format&fit=crop&q=80&w=600 600w,
    ${baseUrl}?auto=format&fit=crop&q=80&w=900 900w
  `.trim();
};
