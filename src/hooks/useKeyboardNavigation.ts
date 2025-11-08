import { useState, useRef, RefObject } from 'react';

// Update the interface to be more flexible
export interface FocusableElement {
  ref: RefObject<any>; // Use 'any' or more specific union types
  type: string;
}

export const useKeyboardNavigation = (focusableElements: FocusableElement[]) => {
  const [focusedIndex, setFocusedIndex] = useState(0);

  const focusNextElement = () => {
    const nextIndex = (focusedIndex + 1) % focusableElements.length;
    setFocusedIndex(nextIndex);
    focusableElements[nextIndex].ref.current?.focus();
  };

  const focusPreviousElement = () => {
    const prevIndex = focusedIndex === 0 ? focusableElements.length - 1 : focusedIndex - 1;
    setFocusedIndex(prevIndex);
    focusableElements[prevIndex].ref.current?.focus();
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
        if (index === focusableElements.length - 2) {
          const formEvent = new Event('submit', { cancelable: true, bubbles: true });
          e.currentTarget.dispatchEvent(formEvent);
        } else if (index === focusableElements.length - 1) {
          (focusableElements[index].ref.current as HTMLAnchorElement)?.click();
        }
        break;
      
      case ' ':
        e.preventDefault();
        if (index === focusableElements.length - 2) {
          const formEvent = new Event('submit', { cancelable: true, bubbles: true });
          e.currentTarget.dispatchEvent(formEvent);
        } else if (index === focusableElements.length - 1) {
          (focusableElements[index].ref.current as HTMLAnchorElement)?.click();
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
        focusableElements[0].ref.current?.focus();
        break;
    }
  };

  const handleElementFocus = (index: number) => {
    setFocusedIndex(index);
  };

  return {
    focusedIndex,
    handleKeyDown,
    handleElementFocus,
  };
};