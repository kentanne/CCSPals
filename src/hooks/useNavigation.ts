import { useState, useRef, KeyboardEvent } from 'react';
import { TopbarItem } from '@/constants/navigation';

export const useNavigation = (items: TopbarItem[], defaultActive: string = 'main') => {
  const [activeComponent, setActiveComponent] = useState(defaultActive);
  const [focusedTopbarIndex, setFocusedTopbarIndex] = useState(0);
  const [isTopbarFocused, setIsTopbarFocused] = useState(false);
  const topbarRef = useRef<HTMLDivElement>(null);

  const switchComponent = (component: string) => {
    console.log('Switching to component:', component);
    if (activeComponent !== component) {
      setActiveComponent(component);
      const newIndex = items.findIndex(item => item.key === component);
      if (newIndex >= 0) {
        setFocusedTopbarIndex(newIndex);
      }
    }
  };

  const handleTopbarKeyDown = (e: KeyboardEvent) => {
    if (!isTopbarFocused) return;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        setFocusedTopbarIndex((prev) => (prev + 1) % items.length);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        setFocusedTopbarIndex((prev) => (prev - 1 + items.length) % items.length);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        const focusedItem = items[focusedTopbarIndex];
        switchComponent(focusedItem.key);
        break;
      case 'Home':
        e.preventDefault();
        setFocusedTopbarIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setFocusedTopbarIndex(items.length - 1);
        break;
      case 'Escape':
        e.preventDefault();
        setIsTopbarFocused(false);
        break;
    }
  };

  const focusTopbar = () => {
    setIsTopbarFocused(true);
    const currentIndex = items.findIndex(item => item.key === activeComponent);
    setFocusedTopbarIndex(currentIndex >= 0 ? currentIndex : 0);
  };

  return {
    activeComponent,
    focusedTopbarIndex,
    isTopbarFocused,
    topbarRef,
    switchComponent,
    handleTopbarKeyDown,
    focusTopbar,
    setIsTopbarFocused
  };
};