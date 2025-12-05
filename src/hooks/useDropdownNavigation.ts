import { genderOptions } from '@/constants/options';
import { InputField, OptionItem } from '@/interfaces/editInformation';
import { normalizeOptionValue, toCamelCase } from '@/utils/infoHelpers';
import { useEffect, useState, RefObject } from 'react';

interface UseDropdownNavigationProps {
  dropdownOpen: Record<string, boolean>;
  currentDropdown: string;
  focusedIndex: number;
  dropdownFocusedIndex: number;
  totalFocusableElements: number;
  closeAllDropdowns: () => void;
  toggleDropdown: (field: string) => void;
  selectGender: (gender: string) => void;
  selectOption: (field: string, value: string, section?: 'personal' | 'profile') => void;
  handleCheckboxSelection: (field: string, value: string) => void;
  getDropdownOptions: (field: string) => any[];
  getCheckboxOptions: (field: string) => any[];
  inputRefs: RefObject<(HTMLInputElement | HTMLTextAreaElement | HTMLDivElement | HTMLButtonElement | null)[]>;
  dropdownOptionRefs: RefObject<(HTMLDivElement | null)[]>;
  inputFieldPersonalInformation: InputField[];
  inputFieldProfileInformation: InputField[];
  saveChanges: () => void;
  closeEditInformation: () => void;
}

export const useDropdownNavigation = ({
  dropdownOpen,
  currentDropdown,
  focusedIndex,
  dropdownFocusedIndex,
  totalFocusableElements,
  closeAllDropdowns,
  toggleDropdown,
  selectGender,
  selectOption,
  handleCheckboxSelection,
  getDropdownOptions,
  getCheckboxOptions,
  inputRefs,
  dropdownOptionRefs,
  inputFieldPersonalInformation,
  inputFieldProfileInformation,
  saveChanges,
  closeEditInformation
}: UseDropdownNavigationProps) => {
  const [localFocusedIndex, setFocusedIndex] = useState(focusedIndex);
  const [localDropdownFocusedIndex, setDropdownFocusedIndex] = useState(dropdownFocusedIndex);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (currentDropdown && dropdownOpen[currentDropdown]) {
        const dropdownOptions = getDropdownOptions(currentDropdown);
        const checkboxOptions = getCheckboxOptions(currentDropdown);
        const optionsCount = dropdownOptions.length || checkboxOptions.length;

        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            setDropdownFocusedIndex(prev => {
              const nextIndex = (prev + 1) % optionsCount;
              dropdownOptionRefs.current?.[nextIndex]?.focus();
              return nextIndex;
            });
            break;
          
          case 'ArrowUp':
            event.preventDefault();
            setDropdownFocusedIndex(prev => {
              const nextIndex = prev <= 0 ? optionsCount - 1 : prev - 1;
              dropdownOptionRefs.current?.[nextIndex]?.focus();
              return nextIndex;
            });
            break;
          
          case 'Enter':
            event.preventDefault();
            if (dropdownFocusedIndex >= 0) {
              if (currentDropdown === 'gender') {
                selectGender(genderOptions[dropdownFocusedIndex]);
              } else if (dropdownOptions.length > 0) {
                const opt = dropdownOptions[dropdownFocusedIndex];
                const optVal = normalizeOptionValue(opt as OptionItem);
                selectOption(
                  currentDropdown,
                  optVal,
                  inputFieldPersonalInformation.some(f => toCamelCase(f.field) === currentDropdown) ? 'personal' : 'profile'
                );
              } else if (checkboxOptions.length > 0) {
                const chk = checkboxOptions[dropdownFocusedIndex];
                const chkVal = normalizeOptionValue(chk as OptionItem);
                handleCheckboxSelection(currentDropdown, chkVal);
              }
            }
            break;
          
          case 'Escape':
            event.preventDefault();
            closeAllDropdowns();
            if (focusedIndex >= 0) {
              inputRefs.current?.[focusedIndex]?.focus();
            }
            break;
          
          case 'Tab':
            closeAllDropdowns();
            break;
          
          default:
            break;
        }
        return;
      }

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setFocusedIndex(prev => {
            const nextIndex = (prev + 1) % totalFocusableElements;
            inputRefs.current?.[nextIndex]?.focus();
            return nextIndex;
          });
          break;
        
        case 'ArrowUp':
          event.preventDefault();
          setFocusedIndex(prev => {
            const nextIndex = prev <= 0 ? totalFocusableElements - 1 : prev - 1;
            inputRefs.current?.[nextIndex]?.focus();
            return nextIndex;
          });
          break;
        
        case 'Enter':
          if (focusedIndex >= 0 && focusedIndex < totalFocusableElements - 1) {
            event.preventDefault();
            const fieldIndex = focusedIndex;
            if (fieldIndex < inputFieldPersonalInformation.length) {
              const field = inputFieldPersonalInformation[fieldIndex];
              if (field.type === 'select') {
                toggleDropdown(toCamelCase(field.field));
              }
            } else if (fieldIndex === inputFieldPersonalInformation.length) {
              toggleDropdown('gender');
            } else if (fieldIndex < inputFieldPersonalInformation.length + 1 + inputFieldProfileInformation.length) {
              const profileIndex = fieldIndex - inputFieldPersonalInformation.length - 1;
              const field = inputFieldProfileInformation[profileIndex];
              if (field.type === 'select' || field.type === 'checkbox') {
                toggleDropdown(toCamelCase(field.field));
              }
            }
          } else if (focusedIndex === totalFocusableElements - 1) {
            event.preventDefault();
            saveChanges();
          }
          break;

        case 'Escape':
          closeEditInformation();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    dropdownOpen,
    focusedIndex,
    dropdownFocusedIndex,
    currentDropdown,
    totalFocusableElements,
    getDropdownOptions,
    getCheckboxOptions
  ]);
};