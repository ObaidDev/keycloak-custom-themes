import { useState, useEffect } from 'react';

export const useImageLoader = (imageSrc: string) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const img = new Image();
    
    const handleLoad = () => {
      setIsLoaded(true);
      setHasError(false);
    };
    
    const handleError = () => {
      setHasError(true);
      setIsLoaded(true); // Set to true even on error to prevent infinite loading
    };

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);
    
    img.src = imageSrc;
    
    // If image is already cached, it might load immediately
    if (img.complete) {
      handleLoad();
    }

    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [imageSrc]);

  return { isLoaded, hasError };
}; 