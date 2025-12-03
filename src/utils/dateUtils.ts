import { useState, useEffect, useRef, RefObject } from 'react';

export const useDatePopup = () => {
  const [showDatePopup, setShowDatePopup] = useState(false);
  const datePopupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePopupRef.current && !datePopupRef.current.contains(event.target as Node)) {
        setShowDatePopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return {
    showDatePopup,
    setShowDatePopup,
    datePopupRef
  };
};

export const getCurrentDateTime = () => {
  const now = new Date();
  return {
    date: now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    time: now.toLocaleTimeString("en-US", {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  };
};