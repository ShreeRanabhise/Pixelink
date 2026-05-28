export const getOptimizedImageUrl = (url, options = {}) => {
  if (!url) return '';
  
  // Only optimize Cloudinary URLs
  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    const { width = 'auto', quality = 'auto', format = 'auto' } = options;
    
    // Check if there are already transformations in the URL
    if (url.match(/\/upload\/[a-z_0-9,]+\//)) {
        // If there are existing transformations, we might want to append or just return as is.
        // For now, let's keep it simple and just return if it looks like it has transformations like /upload/v1234/
        // Actually, Cloudinary transformations usually come before the version number (e.g. /upload/c_limit,w_400/v123/)
        // We'll let `replace` handle inserting our params.
    }

    let transformString = `q_${quality},f_${format}`;
    if (width !== 'auto') {
      transformString = `c_limit,w_${width},` + transformString;
    }

    return url.replace('/upload/', `/upload/${transformString}/`);
  }
  
  return url;
};
