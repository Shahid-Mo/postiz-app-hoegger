import { useCallback } from 'react';
export const useMediaDirectory = () => {
  const set = useCallback((path: string) => {
    if (!path) return '/no-picture.jpg';
    
    // If path is already a full URL, return as-is
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    
    // If path starts with /uploads, return as-is (already relative)
    if (path.startsWith('/uploads')) {
      return path;
    }
    
    // If path is just a filename or relative path, prepend /uploads
    return `/uploads/${path}`;
  }, []);
  return {
    set,
  };
};
