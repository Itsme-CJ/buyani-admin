import { useEffect, useState } from 'react';

const getBreakpoints = () => {
  const w = window.innerWidth;
  return {
    isMobileView: w <= 600,
    isTabletView: w <= 900 && w > 600,
  };
};

const useResponsive = () => {
  const [bp, setBp] = useState(getBreakpoints);

  useEffect(() => {
    const onResize = () => setBp(getBreakpoints());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return {
    isMobileView: bp.isMobileView,
    isTabletView: bp.isTabletView,
    isResponsive: bp.isMobileView || bp.isTabletView,
  };
};

export default useResponsive;
