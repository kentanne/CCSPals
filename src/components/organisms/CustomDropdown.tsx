import { useRef } from 'react';
import styles from '@/components/organisms/forms/MentorEditInformationForm/information.module.css';
import { OptionItem } from '@/interfaces/editInformation';
import { normalizeOptionValue, normalizeOptionLabel, toCamelCase } from '@/utils/infoHelpers';

interface CustomDropdownProps {
  field: string;
  value: string;
  placeholder: string;
  isOpen: boolean;
  options: OptionItem[];
  type: 'select' | 'checkbox';
  selectedValues?: string[];
  onToggle: () => void;
  onSelect: (value: string) => void;
  onFocus: () => void;
  inputRef: (el: HTMLDivElement | null) => void;
  optionRefs: (el: HTMLDivElement | null, index: number) => void;
  isError?: boolean;
}

export const CustomDropdown = ({
  field,
  value,
  placeholder,
  isOpen,
  options,
  type,
  selectedValues = [],
  onToggle,
  onSelect,
  onFocus,
  inputRef,
  optionRefs,
  isError = false
}: CustomDropdownProps) => {
  const handleOptionClick = (option: OptionItem) => {
    const val = normalizeOptionValue(option);
    onSelect(val);
  };

  return (
    <div className={styles.customDropdown}>
      <div
        ref={inputRef}
        className={styles.dropdownContainer}
        onClick={onToggle}
        onFocus={onFocus}
        tabIndex={0}
      >
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          readOnly
          className={`${styles.standardInput} ${isError ? styles.inputError : ''}`}
        />
        <i className={`${styles.dropdownIcon} ${isOpen ? styles.dropdownIconOpen : ''}`}>▼</i>
      </div>
      {isOpen && (
        <div className={`${styles.dropdownOptions} ${type === 'checkbox' ? styles.checkboxOptions : ''}`}>
          {options.map((option, i) => {
            const val = normalizeOptionValue(option);
            const label = normalizeOptionLabel(option);
            
            if (type === 'checkbox') {
              return (
                <div 
                  key={i} 
                  ref={el => optionRefs(el, i)}
                  className={styles.checkboxOption}
                  tabIndex={-1}
                >
                  <input
                    type="checkbox"
                    id={`${toCamelCase(field)}-${i}`}
                    className={styles.checkboxInput}
                    value={val}
                    checked={selectedValues.includes(val)}
                    onChange={() => handleOptionClick(option)}
                  />
                  <label htmlFor={`${toCamelCase(field)}-${i}`} className={styles.checkboxLabel}>
                    {label}
                  </label>
                </div>
              );
            }
            
            return (
              <div
                key={val + '-' + i}
                className={styles.dropdownOption}
                onClick={() => handleOptionClick(option)}
                ref={el => optionRefs(el, i)}
                tabIndex={0}
              >
                {label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};