import React, { useEffect, useState } from 'react'

const useResponsive = () => {
  const [isMobileView, setIsMobileView]       = useState(false);
  const [isTabletView, setIsTabletView]       = useState(false);
  const [isResponsive, setIsResponsive]       = useState(false);
  const [windowDimension, setWindowDimension] = useState({
    windowWidth : window.innerWidth
  });

  useEffect(() => {
    const updateWindowDimension = () => {
      setWindowDimension({
        windowWidth  : window.innerWidth
      })
    }
    window.addEventListener('resize', updateWindowDimension);
    const widthSize = windowDimension.windowWidth;
    const tableView = widthSize <= 900 && widthSize > 600;
    const mobileView = widthSize <= 600;

    setIsTabletView(tableView);
    setIsMobileView(mobileView);
    setIsResponsive(tableView || mobileView);
    return() => {
      window.removeEventListener('resize', updateWindowDimension);
    }
  }, [windowDimension]);

  return { isMobileView, isTabletView, isResponsive }
}

export default useResponsive