// Helper function to get image URL - handles both local and Cloudinary URLs
export const getImageUrl = (url) => {
    if (!url) return null;

    // If URL already starts with http/https, it's a complete URL (Cloudinary)
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }

    // Otherwise, it's a local path, prepend backend URL
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001';
    return `${backendUrl}${url}`;
};
