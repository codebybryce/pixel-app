import { useState, useEffect } from 'react';

const useMediaType = (): string => {
  const [mediaType, setMediaType] = useState('mobile');
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 900)
        setMediaType('mobile');
      else
        setMediaType('desktop');
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return mediaType;
};

export default useMediaType;