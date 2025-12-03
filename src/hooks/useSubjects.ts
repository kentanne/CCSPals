import { useState } from 'react';

interface AvailableSubjects {
  coreSubjects: string[];
  gecSubjects: string[];
  peNstpSubjects: string[];
}

export const useSubjects = () => {
  const [availableSubjects, setAvailableSubjects] = useState<AvailableSubjects>({
    coreSubjects: [],
    gecSubjects: [],
    peNstpSubjects: [],
  });

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const updateAvailableSubjects = (program: string) => {
    switch (program) {
      case 'Bachelor of Science in Information Technology (BSIT)':
        setAvailableSubjects({
          coreSubjects: [
            'Web and Mobile Application Development',
            'Network Administration and Security Management',
            'Data Science and Software Design',
            'Service Management for Business Process Outsourcing',
            'Business Analytics',
            'Cloud Computing'
          ],
          gecSubjects: [],
          peNstpSubjects: []
        });
        break;

      case 'Bachelor of Science in Computer Science (BSCS)':
        setAvailableSubjects({
          coreSubjects: [
            'Software Engineering',
            'Artificial Intelligence and Machine Learning',
            'Data Science',
            'Cloud Computing',
            'Cybersecurity'
          ],
          gecSubjects: [],
          peNstpSubjects: []
        });
        break;

      case 'Bachelor of Science in Entertainment and Multimedia Computing (BSEMC)':
        setAvailableSubjects({
          coreSubjects: [
            'Game Development',
            'Digital Animation Technology',
            'Interactive Media and Web Development',
            'Virtual Reality and Augmented Reality',
            'Multimedia Design'
          ],
          gecSubjects: [],
          peNstpSubjects: []
        });
        break;

      default:
        setAvailableSubjects({
          coreSubjects: [],
          gecSubjects: [],
          peNstpSubjects: [],
        });
    }

    setSelectedSubjects([]); 
  };

  const handleSubjectChange = (subject: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]
    );
  };

  const getAllSubjects = () => {
    return [
      ...availableSubjects.coreSubjects,
      ...availableSubjects.gecSubjects,
      ...availableSubjects.peNstpSubjects
    ];
  };

  return {
    availableSubjects,
    selectedSubjects,
    setSelectedSubjects,
    updateAvailableSubjects,
    handleSubjectChange,
    getAllSubjects
  };
};
