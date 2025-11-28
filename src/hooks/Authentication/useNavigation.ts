import { useState, useRef, useEffect } from 'react';

export const useNavigation = (elementCount: number) => {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  const focusNextElement = () => {
    const nextIndex = (focusedIndex + 1) % elementCount;
    setFocusedIndex(nextIndex);
    refs.current[nextIndex]?.focus();
  };

  const focusPreviousElement = () => {
    const prevIndex = focusedIndex === 0 ? elementCount - 1 : focusedIndex - 1;
    setFocusedIndex(prevIndex);
    refs.current[prevIndex]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case 'Tab':
        e.preventDefault();
        if (e.shiftKey) {
          focusPreviousElement();
        } else {
          focusNextElement();
        }
        break;

      case 'Enter':
        e.preventDefault();
        if (index === elementCount - 1) {
          (refs.current[index] as HTMLAnchorElement)?.click();
        } else {
          (refs.current[index] as HTMLButtonElement)?.click();
        }
        break;

      case ' ':
        e.preventDefault();
        if (index === elementCount - 2 || index === elementCount - 1) {
          (refs.current[index] as HTMLButtonElement | HTMLAnchorElement)?.click();
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        focusNextElement();
        break;

      case 'ArrowUp':
        e.preventDefault();
        focusPreviousElement();
        break;

      case 'Escape':
        setFocusedIndex(0);
        refs.current[0]?.focus();
        break;
    }
  };

  const handleElementFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const registerRef = (index: number, ref: HTMLElement | null) => {
    refs.current[index] = ref;
  };

  return {
    focusedIndex,
    handleKeyDown,
    handleElementFocus,
    registerRef
  };
};