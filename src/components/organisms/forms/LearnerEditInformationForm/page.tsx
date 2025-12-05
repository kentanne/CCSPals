'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './information.module.css';
import api from '@/lib/axios';
import { toast } from 'react-toastify';

// Import reusable components and utilities
import { EditInformationComponentProps, InputField, BioField } from '@/interfaces/editInformation';
import { 
  yearLevelOptions, 
  programOptions, 
  genderOptions, 
  teachingModalityOptions, 
  durationOptions, 
  daysOptions, 
  teachingStyleOptions 
} from '@/constants/options';
import { 
  normalizeOptionValue, 
  normalizeOptionLabel, 
  capitalizeFirstLetter, 
  toCamelCase 
} from '@/utils/infoHelpers';
import { useDropdownNavigation } from '@/hooks/useDropdownNavigation';
import { useSubjects } from '@/hooks/useSubjects';
import { CustomDropdown } from '@/components/organisms/CustomDropdown';
import { SpecializationDropdown } from '@/components/organisms/SpecializationDropdown';

// CONSTANTS
const inputFieldPersonalInformation: InputField[] = [
  { field: 'Year Level', type: 'select', options: yearLevelOptions, placeholder: 'Select your current year level' },
  { field: 'Program', type: 'select', options: programOptions, placeholder: 'Choose your degree program' },
  { field: 'Address', type: 'text', placeholder: 'Enter your complete residential address' },
  { field: 'Contact Number', type: 'text', placeholder: 'Enter your 11-digit phone number' },
];

const inputFieldProfileInformation: InputField[] = [
  { field: 'Teaching Modality', type: 'select', options: teachingModalityOptions, placeholder: 'Select preferred teaching method' },
  { field: 'Days of Availability', type: 'checkbox', options: daysOptions, placeholder: 'Choose days you are available' },
  { field: 'Teaching Style', type: 'checkbox', options: teachingStyleOptions, placeholder: 'Choose your teaching approaches' },
  { field: 'Preferred Session Duration', type: 'select', options: durationOptions, placeholder: 'Select session length preference' },
  { field: 'Specialization', type: 'select', placeholder: 'Select subjects you can teach' },
];

const bioAndExperienceFields: BioField[] = [
  { field: 'Short Bio', column: 1, placeholder: 'Tell us about yourself, your background, and teaching philosophy...' },
  { field: 'Tutoring Experience', column: 2, placeholder: 'Describe your previous tutoring or teaching experiences...' },
];

export default function EditInformationComponent({
  userData,
  onSave,
  onCancel = () => {},
  onUpdateUserData,
}: EditInformationComponentProps) {
  const [personalData, setPersonalData] = useState({
    gender: userData?.sex || '',
    otherGender: '',
    yearLevel: userData?.yearLevel || '',
    program: userData?.program || '',
    address: userData?.address || '',
    contactNumber: userData?.phoneNumber || '',
  });
  
  const [profileData, setProfileData] = useState({
    courseOffered: userData?.subjects || [] as string[],
    shortBio: userData?.bio || '',
    tutoringExperience: userData?.goals || '',
    teachingModality: userData?.modality || '',
    daysOfAvailability: userData?.availability || [] as string[],
    teachingStyle: userData?.style || [] as string[],
    preferredSessionDuration: userData?.sessionDur || '',
  });
  
  const [dropdownOpen, setDropdownOpen] = useState<Record<string, boolean>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [dropdownFocusedIndex, setDropdownFocusedIndex] = useState<number>(-1);
  const [currentDropdown, setCurrentDropdown] = useState<string>('');

  // CUSTOM HOOKS
  const { availableSubjects, updateAvailableSubjects } = useSubjects();

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const inputRefs = useRef<(HTMLInputElement | HTMLTextAreaElement | HTMLDivElement | HTMLButtonElement | null)[]>([]);
  const dropdownOptionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const totalFocusableElements = inputFieldPersonalInformation.length + 1 +
                                inputFieldProfileInformation.length + 
                                bioAndExperienceFields.length + 
                                1;

  const getPlaceholder = (field: string, section: 'personal' | 'profile') => {
    const mappings: Record<string, Record<string, any>> = {
      personal: {
        'Full Name': userData?.name,
        'Year Level': userData?.yearLevel,
        'Program': userData?.program,
        'Address': userData?.address,
        'Contact Number': userData?.phoneNumber,
        'Sex at Birth': capitalizeFirstLetter(userData?.sex || ''),
      },
      profile: {
        'Teaching Modality': userData?.modality,
        'Days of Availability': userData?.availability?.join(', '),
        'Teaching Style': userData?.style?.join(', ') || '',
        'Preferred Session Duration': userData?.sessionDur,
        'Specialization': userData?.subjects?.join(', '),
        'Short Bio': userData?.bio,
        'Tutoring Experience': userData?.goals,
      },
    };

    return (mappings[section] as any)[field];
  };

  const getDropdownOptions = (field: string) => {
    if (field === 'gender') {
      return genderOptions;
    }
    
    const personalField = inputFieldPersonalInformation.find(f => toCamelCase(f.field) === field);
    if (personalField && personalField.options) {
      return personalField.options;
    }
    
    const profileField = inputFieldProfileInformation.find(f => toCamelCase(f.field) === field);
    if (profileField && profileField.options) {
      return profileField.options;
    }
    
    return [];
  };

  const getCheckboxOptions = (field: string) => {
    const profileField = inputFieldProfileInformation.find(f => toCamelCase(f.field) === field);
    return profileField?.options || [];
  };

  const getDisplayValue = (field: string) => {
    const value = profileData[field as keyof typeof profileData];
    
    if (Array.isArray(value)) {
      if (value.length === 0) {
        if (field === 'daysOfAvailability') {
          return userData?.availability?.join(', ') || '';
        }
        if (field === 'teachingStyle') {
          return userData?.style?.join(', ') || '';
        }
      }
      return value.join(', ');
    }
    return value || '';
  };

  const closeAllDropdowns = () => {
    setDropdownOpen({});
    setCurrentDropdown('');
    setDropdownFocusedIndex(-1);
  };

  const toggleDropdown = (field: string) => {
    setDropdownOpen(prev => {
      const newState: Record<string, boolean> = {};
      Object.keys(prev).forEach(key => {
        if (key !== field) newState[key] = false;
      });
      newState[field] = !prev[field];
      
      if (newState[field]) {
        setCurrentDropdown(field);
        setDropdownFocusedIndex(0);
      } else {
        setCurrentDropdown('');
        setDropdownFocusedIndex(-1);
      }
      
      return newState;
    });
  };

  const selectOption = (field: string, value: string, section: 'personal' | 'profile' = 'profile') => {
    if (section === 'personal') {
      setPersonalData(prev => ({ ...prev, [field]: value }));
    } else {
      if (Array.isArray(profileData[field as keyof typeof profileData])) {
        const currentArray = profileData[field as keyof typeof profileData] as string[];
        const index = currentArray.indexOf(value);
        let newArray;
        
        if (index === -1) {
          newArray = [...currentArray, value];
        } else {
          newArray = currentArray.filter(item => item !== value);
        }
        
        setProfileData(prev => ({ ...prev, [field]: newArray }));
      } else {
        setProfileData(prev => ({ ...prev, [field]: value }));
      }
    }
    closeAllDropdowns();
  };

  const selectGender = (gender: string) => {
    setPersonalData(prev => ({ ...prev, gender }));
    closeAllDropdowns();
  };

  const handleCourseOfferedChange = (subject: string) => {
    setProfileData(prev => {
      const currentSubjects = prev.courseOffered;
      const index = currentSubjects.indexOf(subject);
      let newSubjects;
      
      if (index === -1) {
        newSubjects = [...currentSubjects, subject];
      } else {
        newSubjects = currentSubjects.filter((item: string) => item !== subject);
      }
      
      return { ...prev, courseOffered: newSubjects };
    });
  };

  const handleCheckboxSelection = (field: string, value: string) => {
    setProfileData(prev => {
      const currentArray = prev[field as keyof typeof profileData] as string[];
      const index = currentArray.indexOf(value);
      let newArray;
      
      if (index === -1) {
        newArray = [...currentArray, value];
      } else {
        newArray = currentArray.filter(item => item !== value);
      }
      
      return { ...prev, [field]: newArray };
    });
  };

  const validateField = (field: string, value: string) => {
    const trimmedValue = value.trim();

    if (trimmedValue === '') {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      return;
    }

    let error = '';
    switch (field) {
      case 'shortBio':
        if (trimmedValue.length < 20) {
          error = 'Short Bio should be at least 20 characters.';
        }
        break;
      case 'tutoringExperience':
        if (trimmedValue.length < 10) {
          error = 'Tutoring Experience should be at least 10 characters.';
        }
        break;
      case 'contactNumber':
        if (trimmedValue.length !== 11) {
          error = 'Contact Number should be 11 digits.';
        } else if (!/^\d+$/.test(trimmedValue)) {
          error = 'Contact Number should contain only digits.';
        }
        break;
      case 'address':
        if (trimmedValue.length < 10) {
          error = 'Address should be at least 10 characters.';
        }
        break;
      default:
        break;
    }

    setValidationErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const saveChanges = async () => {
    Object.keys(personalData).forEach(key => {
      validateField(key, personalData[key as keyof typeof personalData]);
    });
    Object.keys(profileData).forEach(key => {
      if (typeof profileData[key as keyof typeof profileData] === 'string') {
        validateField(key, profileData[key as keyof typeof profileData] as string);
      }
    });

    if (Object.values(validationErrors).some(error => error)) {
      toast.error('Please fix validation errors before saving.');
      return;
    }

    try {
      const payload: any = {};
      
      if (personalData.gender && personalData.gender !== userData?.sex) {
        payload.sex = personalData.gender.toLowerCase();
      }
      if (personalData.contactNumber && personalData.contactNumber !== userData?.phoneNumber) {
        payload.phoneNumber = personalData.contactNumber;
      }
      if (personalData.address && personalData.address !== userData?.address) {
        payload.address = personalData.address;
      }
      if (personalData.program && personalData.program !== userData?.program) {
        if (personalData.program.includes('Information Technology')) {
          payload.program = 'BSIT';
        } else if (personalData.program.includes('Computer Science')) {
          payload.program = 'BSCS';
        } else if (personalData.program.includes('Entertainment and Multimedia')) {
          payload.program = 'BSEMC';
        }
      }
      if (personalData.yearLevel && personalData.yearLevel !== userData?.yearLevel) {
        payload.yearLevel = personalData.yearLevel.toLowerCase();
      }
      
      if (profileData.courseOffered.length && JSON.stringify(profileData.courseOffered) !== JSON.stringify(userData?.subjects)) {
        payload.subjects = profileData.courseOffered;
      }
      if (profileData.teachingModality && profileData.teachingModality !== userData?.modality) {
        payload.modality = profileData.teachingModality.toLowerCase();
      }
      if (profileData.teachingStyle?.length && JSON.stringify(profileData.teachingStyle) !== JSON.stringify(userData?.style)) {
        payload.style = profileData.teachingStyle.map((s: string) => s.toLowerCase().replace(/\s+/g, '-'));
      }
      if (profileData.daysOfAvailability?.length && JSON.stringify(profileData.daysOfAvailability) !== JSON.stringify(userData?.availability)) {
        payload.availability = profileData.daysOfAvailability.map((d: string) => d.toLowerCase());
      }
      if (profileData.preferredSessionDuration && profileData.preferredSessionDuration !== userData?.sessionDur) {
        if (profileData.preferredSessionDuration.includes('1')) {
          payload.sessionDur = '1hr';
        } else if (profileData.preferredSessionDuration.includes('2')) {
          payload.sessionDur = '2hrs';
        } else if (profileData.preferredSessionDuration.includes('3')) {
          payload.sessionDur = '3hrs';
        }
      }
      if (profileData.shortBio && profileData.shortBio !== userData?.bio) {
        payload.bio = profileData.shortBio;
      }
      if (profileData.tutoringExperience && profileData.tutoringExperience !== userData?.goals) {
        payload.goals = profileData.tutoringExperience;
      }

      if (Object.keys(payload).length === 0) {
        toast.info('No changes detected to save.');
        return;
      }

      const response = await api.patch('/api/learner/profile/edit', payload);

      if (response.status === 200) {
        toast.success('Profile updated successfully.');
        
        const updatedData: any = {
          ...userData,
        };

        if (response.data.learner) {
          if (response.data.learner.sex) updatedData.sex = capitalizeFirstLetter(response.data.learner.sex);
          if (response.data.learner.phoneNumber) updatedData.phoneNumber = response.data.learner.phoneNumber;
          if (response.data.learner.address) updatedData.address = response.data.learner.address;
          if (response.data.learner.program) {
            updatedData.program = response.data.learner.program === 'BSIT' ? 'Bachelor of Science in Information Technology (BSIT)' :
                        response.data.learner.program === 'BSCS' ? 'Bachelor of Science in Computer Science (BSCS)' :
                        response.data.learner.program === 'BSEMC' ? 'Bachelor of Science in Entertainment and Multimedia Computing (BSEMC)' :
                        response.data.learner.program;
          }
          if (response.data.learner.yearLevel) updatedData.yearLevel = capitalizeFirstLetter(response.data.learner.yearLevel);
          if (response.data.learner.subjects) updatedData.subjects = response.data.learner.subjects;
          if (response.data.learner.modality) updatedData.modality = capitalizeFirstLetter(response.data.learner.modality);
          if (response.data.learner.style) {
            updatedData.style = response.data.learner.style.map((s: string) => 
              s.split('-').map((w: string) => capitalizeFirstLetter(w)).join(' ')
            );
          }
          if (response.data.learner.availability) {
            updatedData.availability = response.data.learner.availability.map((d: string) => capitalizeFirstLetter(d));
          }
          if (response.data.learner.sessionDur) {
            updatedData.sessionDur = response.data.learner.sessionDur.replace('1hr', '1 hour')
              .replace('2hrs', '2 hours').replace('3hrs', '3 hours');
          }
          if (response.data.learner.bio) updatedData.bio = response.data.learner.bio;
          if (response.data.learner.goals) updatedData.goals = response.data.learner.goals;
        }
        
        onSave(updatedData);
        try {
          onUpdateUserData?.(updatedData);
        } catch (e) {}
      }
    } catch (error: any) {
      console.error('Error saving changes:', error);
      
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        toast.error(`Validation failed:\n${error.response.data.errors.join('\n')}`);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An error occurred while saving changes.');
      }
    }
  };

  const closeEditInformation = () => {
    onCancel();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeEditInformation();
    }
  };

  // USE DROPDOWN NAVIGATION HOOK
  useDropdownNavigation({
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
  });

  useEffect(() => {
    if (userData?.program) {
      updateAvailableSubjects(userData.program);
    }
    
    setPersonalData({
      gender: userData?.sex || '',
      otherGender: '',
      yearLevel: userData?.yearLevel || '',
      program: userData?.program || '',
      address: userData?.address || '',
      contactNumber: userData?.phoneNumber || '',
    });
    
    setProfileData(prev => ({
      ...prev,
      courseOffered: userData?.subjects || [],
      daysOfAvailability: userData?.availability || [],
      teachingStyle: userData?.style || [],
      teachingModality: userData?.modality || '',
      preferredSessionDuration: userData?.sessionDur || '',
      shortBio: userData?.bio || '',
      tutoringExperience: userData?.goals || '',
    }));
  }, [userData]);

  useEffect(() => {
    if (personalData.program) {
      updateAvailableSubjects(personalData.program);
    }
  }, [personalData.program]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeAllDropdowns();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    dropdownOptionRefs.current = dropdownOptionRefs.current.slice(0, 
      getDropdownOptions(currentDropdown).length || getCheckboxOptions(currentDropdown).length
    );
  }, [currentDropdown, dropdownOpen]);

  return (
    <>
      <div 
        className={styles.editInformationOverlay} 
        onClick={handleOverlayClick}
      />
      
      <div className={styles.editInformationModal} ref={dropdownRef}>
        <div className={styles.editInformation}>
          <div className={styles.upperElement}>
            <h1 className={styles.upperElementH1}>Edit Information</h1>
            <img 
              src="/exit.svg" 
              alt="exit" 
              className={styles.exitIcon}
              onClick={closeEditInformation}
            />
          </div>
          <div className={styles.lowerElement}>
            <div className={styles.personalInformation}>
              <h1 className={styles.sectionH1}>I. PERSONAL INFORMATION</h1>
              <div className={styles.inputWrapper}>
                {inputFieldPersonalInformation.map((item, index) => (
                  <div key={index} className={styles.inputFields}>
                    <label className={styles.label}>{item.field}</label>

                    {item.type === 'text' ? (
                      <>
                        <input
                          ref={el => { inputRefs.current[index] = el as HTMLInputElement | null; }}
                          type="text"
                          value={personalData[toCamelCase(item.field) as keyof typeof personalData] as string}
                          onChange={(e) => {
                            const newValue = e.target.value;
                            setPersonalData(prev => ({ ...prev, [toCamelCase(item.field)]: newValue }));
                            validateField(toCamelCase(item.field), newValue);
                          }}
                          onFocus={() => setFocusedIndex(index)}
                          className={styles.standardInput}
                          placeholder={String(getPlaceholder(item.field, 'personal') || item.placeholder)}
                        />
                        {validationErrors[toCamelCase(item.field)] && (
                          <span className={styles.errorMessage}>
                            {validationErrors[toCamelCase(item.field)]}
                          </span>
                        )}
                      </>
                    ) : item.type === 'select' && item.field !== 'Gender' ? (
                      <CustomDropdown
                        field={item.field}
                        value={personalData[toCamelCase(item.field) as keyof typeof personalData] as string}
                        placeholder={getPlaceholder(item.field, 'personal') || item.placeholder}
                        isOpen={dropdownOpen[toCamelCase(item.field)] || false}
                        options={item.options || []}
                        type="select"
                        onToggle={() => toggleDropdown(toCamelCase(item.field))}
                        onSelect={(value) => selectOption(toCamelCase(item.field), value, 'personal')}
                        onFocus={() => setFocusedIndex(index)}
                        inputRef={(el) => { inputRefs.current[index] = el; }}
                        optionRefs={(el, i) => { dropdownOptionRefs.current[i] = el; }}
                      />
                    ) : null}
                  </div>
                ))}

                <div className={styles.inputFields}>
                  <label className={styles.label}>Sex at Birth</label>
                  <CustomDropdown
                    field="gender"
                    value={personalData.gender}
                    placeholder={getPlaceholder('Sex at Birth', 'personal') || 'Select your gender'}
                    isOpen={dropdownOpen.gender || false}
                    options={genderOptions}
                    type="select"
                    onToggle={() => toggleDropdown('gender')}
                    onSelect={selectGender}
                    onFocus={() => setFocusedIndex(inputFieldPersonalInformation.length)}
                    inputRef={(el) => { inputRefs.current[inputFieldPersonalInformation.length] = el; }}
                    optionRefs={(el, i) => { dropdownOptionRefs.current[i] = el; }}
                  />
                </div>
              </div>
            </div>

            <div className={styles.profileInformation}>
              <h1 className={styles.sectionH1}>II. PROFILE INFORMATION</h1>
              <div className={styles.inputWrapper}>
                {inputFieldProfileInformation.map((item, index) => {
                  const globalIndex = inputFieldPersonalInformation.length + 1 + index;
                  
                  if (item.field === 'Specialization') {
                    return (
                      <div key={index} className={styles.inputFields}>
                        <label className={styles.label}>{item.field}</label>
                        <SpecializationDropdown
                          value={getDisplayValue('courseOffered')}
                          placeholder={getPlaceholder(item.field, 'profile') || item.placeholder}
                          isOpen={dropdownOpen[toCamelCase(item.field)] || false}
                          subjects={availableSubjects.coreSubjects}
                          selectedSubjects={profileData.courseOffered}
                          onToggle={() => toggleDropdown(toCamelCase(item.field))}
                          onSubjectChange={handleCourseOfferedChange}
                          onFocus={() => setFocusedIndex(globalIndex)}
                          inputRef={(el) => { inputRefs.current[globalIndex] = el; }}
                          optionRefs={(el, i) => { dropdownOptionRefs.current[i] = el; }}
                        />
                      </div>
                    );
                  }

                  return (
                    <div key={index} className={styles.inputFields}>
                      <label className={styles.label}>{item.field}</label>
                      <CustomDropdown
                        field={item.field}
                        value={item.type === 'select' 
                          ? (profileData[toCamelCase(item.field) as keyof typeof profileData] as string) 
                          : getDisplayValue(toCamelCase(item.field))}
                        placeholder={getPlaceholder(item.field, 'profile') || item.placeholder}
                        isOpen={dropdownOpen[toCamelCase(item.field)] || false}
                        options={item.options || []}
                        type={item.type as 'select' | 'checkbox'}
                        selectedValues={item.type === 'checkbox' 
                          ? (profileData[toCamelCase(item.field) as keyof typeof profileData] as string[]) 
                          : undefined}
                        onToggle={() => toggleDropdown(toCamelCase(item.field))}
                        onSelect={(value) => selectOption(toCamelCase(item.field), value)}
                        onFocus={() => setFocusedIndex(globalIndex)}
                        inputRef={(el) => { inputRefs.current[globalIndex] = el; }}
                        optionRefs={(el, i) => { dropdownOptionRefs.current[i] = el; }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.bioGoalsWrapper}>
              <div className={styles.bioGoalsGrid}>
                {bioAndExperienceFields.map((item, index) => {
                  const globalIndex = inputFieldPersonalInformation.length + 1 + inputFieldProfileInformation.length + index;
                  return (
                    <div key={`bio-${index}`} className={styles.inputFields}>
                      <label className={styles.label}>{item.field}</label>
                      <textarea
                        ref={el => { inputRefs.current[globalIndex] = el as HTMLTextAreaElement | null; }}
                        value={profileData[toCamelCase(item.field) as keyof typeof profileData] as string}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setProfileData(prev => ({ ...prev, [toCamelCase(item.field)]: newValue }));
                          validateField(toCamelCase(item.field), newValue);
                        }}
                        onFocus={() => setFocusedIndex(globalIndex)}
                        className={styles.fixedTextarea}
                        placeholder={getPlaceholder(item.field, 'profile') || item.placeholder}
                      />
                      {validationErrors[toCamelCase(item.field)] && (
                        <span className={styles.errorMessage}>
                          {validationErrors[toCamelCase(item.field)]}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className={styles.save}>
            <button 
              ref={el => { inputRefs.current[totalFocusableElements - 1] = el as HTMLButtonElement | null; }}
              className={styles.saveButton} 
              onClick={saveChanges}
              onFocus={() => setFocusedIndex(totalFocusableElements - 1)}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
}