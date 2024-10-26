import { useState, useEffect } from 'react';

function useScreenSize() {
  const [screenSize, setScreenSize] = useState({
    width: 1200,
    height: 1200,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return screenSize;
}

export default useScreenSize;
