import { useState, useEffect } from 'react';

export const useMobileView = (defaultSidebarVisible: boolean = false) => {
  const [isMobileView, setIsMobileView] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(defaultSidebarVisible);

  const checkMobileView = () => {
    if (typeof window !== 'undefined') {
      const mobile = window.innerWidth <= 768;
      setIsMobileView(mobile);
      if (!mobile) {
        setIsSidebarVisible(true);
      } else {
        setIsSidebarVisible(false);
      }
    }
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  useEffect(() => {
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    
    return () => {
      window.removeEventListener('resize', checkMobileView);
    };
  }, []);

  return {
    isMobileView,
    isSidebarVisible,
    toggleSidebar,
    setIsSidebarVisible
  };
};