import { useRef } from 'react';
import styles from '@/app/components/mentorpage/information/information.module.css';

interface SpecializationDropdownProps {
  value: string;
  placeholder: string;
  isOpen: boolean;
  subjects: string[];
  selectedSubjects: string[];
  onToggle: () => void;
  onSubjectChange: (subject: string) => void;
  onFocus: () => void;
  inputRef: (el: HTMLDivElement | null) => void;
  optionRefs: (el: HTMLDivElement | null, index: number) => void;
}

export const SpecializationDropdown = ({
  value,
  placeholder,
  isOpen,
  subjects,
  selectedSubjects,
  onToggle,
  onSubjectChange,
  onFocus,
  inputRef,
  optionRefs
}: SpecializationDropdownProps) => {
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
          className={styles.standardInput}
        />
        <i className={`${styles.dropdownIcon} ${isOpen ? styles.dropdownIconOpen : ''}`}>▼</i>
      </div>
      {isOpen && (
        <div className={`${styles.dropdownOptions} ${styles.checkboxOptions}`}>
          {subjects.length > 0 && (
            <div className={styles.categorySection}>
              <h4 className={styles.categoryH4}>Specializations</h4>
              {subjects.map((subject, i) => (
                <div key={`core-${i}`} className={styles.checkboxOption}>
                  <input
                    type="checkbox"
                    id={`core-${i}`}
                    className={styles.checkboxInput}
                    value={subject}
                    checked={selectedSubjects.includes(subject)}
                    onChange={() => onSubjectChange(subject)}
                  />
                  <label htmlFor={`core-${i}`} className={styles.checkboxLabel}>{subject}</label>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};