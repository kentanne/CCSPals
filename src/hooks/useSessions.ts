import { useState, useEffect, useRef } from 'react';
import { SessionItem } from '@/interfaces/session';

interface UseSessionsProps {
  initialSchedule?: SessionItem[];
  initialUpcomingSchedule?: SessionItem[];
  userType: 'mentor' | 'learner';
}

export const useSessions = ({ 
  initialSchedule = [], 
  initialUpcomingSchedule = [], 
  userType 
}: UseSessionsProps) => {
  const [todaySchedule, setTodaySchedule] = useState<SessionItem[]>(initialSchedule);
  const [upcomingSchedule, setUpcomingSchedule] = useState<SessionItem[]>(initialUpcomingSchedule);
  const [selectedItem, setSelectedItem] = useState<SessionItem | null>(null);
  const [activePopup, setActivePopup] = useState<{ type: string | null; index: number | null }>({ type: null, index: null });
  const [selectedSessionID, setSelectedSessionID] = useState<string | number | null>(null);
  
  const todayPopupRefs = useRef<(HTMLDivElement | null)[]>([]);
  const upcomingPopupRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setTodaySchedule(initialSchedule);
    setUpcomingSchedule(initialUpcomingSchedule);
  }, [initialSchedule, initialUpcomingSchedule]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutsideToday = todayPopupRefs.current.every(
        ref => ref && !ref.contains(event.target as Node)
      );
      const isOutsideUpcoming = upcomingPopupRefs.current.every(
        ref => ref && !ref.contains(event.target as Node)
      );

      if (isOutsideToday && isOutsideUpcoming) {
        setActivePopup({ type: null, index: null });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const togglePopup = (type: string, index: number, event: React.MouseEvent) => {
    event.stopPropagation();
    const popupId = `${type}-${index}`;
    if (activePopup.type === popupId) {
      setActivePopup({ type: null, index: null });
    } else {
      setActivePopup({ type: popupId, index });
    }
  };

  const handleOptionClick = (option: string, item: SessionItem, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedItem(item);
    setSelectedSessionID(item.id);
    setActivePopup({ type: null, index: null });
    return { option, item };
  };

  const getPopupRef = (type: 'today' | 'upcoming', index: number) => {
    if (type === 'today') {
      return (el: HTMLDivElement | null) => {
        todayPopupRefs.current[index] = el;
      };
    } else {
      return (el: HTMLDivElement | null) => {
        upcomingPopupRefs.current[index] = el;
      };
    }
  };

  return {
    todaySchedule,
    setTodaySchedule,
    upcomingSchedule,
    setUpcomingSchedule,
    selectedItem,
    setSelectedItem,
    activePopup,
    setActivePopup,
    selectedSessionID,
    setSelectedSessionID,
    togglePopup,
    handleOptionClick,
    getPopupRef,
    todayPopupRefs,
    upcomingPopupRefs
  };
};