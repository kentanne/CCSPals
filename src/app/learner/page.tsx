'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Lazy load heavy components
const MainComponent = dynamic(() => import('@/components/templates/LearnerMainTemplate/page'), {
  loading: () => <div className="loadingFallback">Loading...</div>,
  ssr: false
});
const SessionComponent = dynamic(() => import('@/components/organisms/views/LearnerSessionsView/page'), {
  loading: () => <div className="loadingFallback">Loading sessions...</div>,
  ssr: false
});
const ReviewsComponent = dynamic(() => import('@/components/organisms/tables/LearnerReviewsTable/page'), {
  loading: () => <div className="loadingFallback">Loading reviews...</div>,
  ssr: false
});
const EditInformation = dynamic(() => import('@/components/organisms/forms/LearnerEditInformationForm/page'), {
  loading: () => <div className="loadingFallback">Loading form...</div>,
  ssr: false
});
const LogoutComponent = dynamic(() => import('@/components/organisms/modals/LogoutModal/page'), {
  loading: () => null,
  ssr: false
});
// import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useNavigation } from '@/hooks/useNavigation';
import { useMobileView } from '@/hooks/useMobileView';
import { useUserData } from '@/hooks/useUserData';
import { useMentors } from '@/hooks/useMentors';
import { useScheduleManager } from '@/hooks/useScheduleManager';
import { authService } from '@/services/authService';
import { normalizeSchedulesForSession } from '@/utils/transformers';
import { useDatePopup, getCurrentDateTime } from '@/utils/dateUtils';
import { LEARNER_TOPBAR_ITEMS } from '@/constants/navigation';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { DatePopup } from '@/components/atoms/DatePopup';
import { TopbarNavigation } from '@/components/molecules/TopbarNavigation';
import { CalendarButton } from '@/components/molecules/CalendarButton';
import { UserSidebar } from '@/components/organisms/UserSidebar';
import styles from './learner.module.css';
import { toast } from 'react-toastify';

export default function LearnerPage() {
  const router = useRouter();
  // useAuthGuard('learner');
  
  const { 
    activeComponent, 
    focusedTopbarIndex, 
    isTopbarFocused, 
    topbarRef, 
    switchComponent, 
    handleTopbarKeyDown, 
    focusTopbar,
    setIsTopbarFocused 
  } = useNavigation(LEARNER_TOPBAR_ITEMS, 'main');
  
  const { isMobileView, isSidebarVisible, toggleSidebar } = useMobileView();
  const { showDatePopup, setShowDatePopup, datePopupRef } = useDatePopup();
  const { userData, isLoading: userLoading, updateUserData } = useUserData('learner');
  
  // Use custom hooks for data fetching
  const { transformedMentors, isLoading: mentorsLoading, error: mentorsError, refetch: refetchMentors } = useMentors();
  
  // Use schedule manager for learner
  const userName = userData?.name || userData?.username || '';
  const {
    todaySchedules,
    upcomingSchedules,
    loading: schedulesLoading,
    error: schedulesError,
    fetchSchedules,
    createSchedule
  } = useScheduleManager(userName, 'learner');
  
  const [mentorFiles, setMentorFiles] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isLoading = mentorsLoading || schedulesLoading || userLoading;

  // Refetch function to refresh all data
  const refetchData = async () => {
    await Promise.all([refetchMentors(), fetchSchedules()]);
  };

  const filteredUsers = transformedMentors.filter((user) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      searchQuery === "" ||
      user.userName.toLowerCase().includes(searchLower) ||
      user.yearLevel.toLowerCase().includes(searchLower) ||
      user.course.toLowerCase().includes(searchLower)
    );
  });

  const handleLogout = async () => {
    setConfirmLogout(false);
    try {
      await authService.logout();
      router.replace('/auth/login');
    } catch (error) {
      // Error handled in service
    }
  };

  const handleCancelLogout = () => {
    setConfirmLogout(false);
  };

  const renderComponent = () => {
    const sessionSchedule = normalizeSchedulesForSession(todaySchedules);
    const sessionUpcoming = normalizeSchedulesForSession(upcomingSchedules);
    const sessionMentFiles = {
      files: (mentorFiles || []).map(f => ({
        id: Number(f.id) || 0,
        file_name: f.file_name || f.name || '',
        file_id: f.file_id || '',
        owner_id: Number(f.owner_id) || 0
      }))
    };

    const props = {
      userInformation: filteredUsers,
      userData,
      upcomingSchedule: sessionUpcoming,
      schedule: sessionSchedule,
      mentFiles: sessionMentFiles,
      onScheduleCreated: refetchData,
      createSchedule
    };

    switch (activeComponent) {
      case 'main':
        return <MainComponent {...props} />;
      case 'session':
        return (
          <SessionComponent
            schedule={sessionSchedule}
            upcomingSchedule={sessionUpcoming}
            mentFiles={sessionMentFiles}
            userInformation={filteredUsers}
            userData={userData}
          />
        );
      case 'records':
        // Mock data for learner reviews
        const mockSchedulesForReview = [
          {
            id: '1',
            subject: 'Data Structures and Algorithms',
            date: '2024-11-28',
            time: '10:00 AM',
            location: 'Online - Zoom',
            mentor: {
              id: 'M001',
              name: 'Kent Ann Ecal',
              program: 'Bachelor of Science in Computer Science (BSCS)',
              yearLevel: '4th Year',
              image: 'https://placehold.co/100x100'
            },
            mentorId: 'M001',
            scheduleId: 'SCH001',
            has_feedback: false
          },
          {
            id: '2',
            subject: 'Web Development',
            date: '2024-11-25',
            time: '2:00 PM',
            location: 'Room 305',
            mentor: {
              id: 'M002',
              name: 'Maverick Lance Coronel',
              program: 'Bachelor of Science in Information Technology (BSIT)',
              yearLevel: '3rd Year',
              image: 'https://placehold.co/100x100'
            },
            mentorId: 'M002',
            scheduleId: 'SCH002',
            rating: 5,
            comment: 'Excellent mentor! Very patient and knowledgeable. Helped me understand React hooks clearly.',
            has_feedback: true
          },
          {
            id: '3',
            subject: 'Database Management',
            date: '2024-11-20',
            time: '1:00 PM',
            location: 'Online - Google Meet',
            mentor: {
              id: 'M003',
              name: 'Vincent David Ong',
              program: 'Bachelor of Science in Computer Science (BSCS)',
              yearLevel: '4th Year',
              image: 'https://placehold.co/100x100'
            },
            mentorId: 'M003',
            scheduleId: 'SCH003',
            rating: 4,
            comment: 'Great session on SQL queries. Would recommend!',
            has_feedback: true
          },
          {
            id: '4',
            subject: 'Python Programming',
            date: '2024-11-15',
            time: '3:30 PM',
            location: 'Library Study Room 2',
            mentor: {
              id: 'M004',
              name: 'Paulo Cordova',
              program: 'Bachelor of Science in Information Technology (BSIT)',
              yearLevel: '3rd Year',
              image: 'https://placehold.co/100x100'
            },
            mentorId: 'M004',
            scheduleId: 'SCH004',
            has_feedback: false
          },
          {
            id: '5',
            subject: 'Object-Oriented Programming',
            date: '2024-11-10',
            time: '11:00 AM',
            location: 'Online - MS Teams',
            mentor: {
              id: 'M005',
              name: 'Rosary Jane Garcia',
              program: 'Bachelor of Science in Computer Science (BSCS)',
              yearLevel: '4th Year',
              image: 'https://placehold.co/100x100'
            },
            mentorId: 'M005',
            scheduleId: 'SCH005',
            rating: 5,
            comment: 'Best tutor I\'ve had! Made OOP concepts so easy to understand. Highly recommended.',
            has_feedback: true
          }
        ];
        
        return (
          <ReviewsComponent
            userData={userData}
            schedForReview={mockSchedulesForReview}
            data={{ schedForReview: mockSchedulesForReview }}
          />
        );
      default:
        return <MainComponent {...props} />;
    }
  };

  if (userLoading) {
    return <LoadingSpinner styles={styles} />;
  }

  return (
    <>
      {isLoading && <LoadingSpinner styles={styles} />}

      {isMobileView && (
        <button className={styles['sidebar-toggle']} onClick={toggleSidebar}>
          ☰
        </button>
      )}

      {isMobileView && isSidebarVisible && (
        <div className={styles['sidebar-overlay']} onClick={toggleSidebar}></div>
      )}

      <UserSidebar
        userData={userData}
        role="learner"
        showAllCourses={showAllCourses}
        onToggleAllCourses={() => setShowAllCourses(!showAllCourses)}
        onEditInformation={() => setIsEdit(true)}
        onLogout={() => setConfirmLogout(true)}
        isMobileView={isMobileView}
        isSidebarVisible={isSidebarVisible}
        styles={styles}
      />

      <TopbarNavigation
        items={LEARNER_TOPBAR_ITEMS}
        activeComponent={activeComponent}
        focusedTopbarIndex={focusedTopbarIndex}
        isTopbarFocused={isTopbarFocused}
        onItemClick={switchComponent}
        onKeyDown={handleTopbarKeyDown}
        onFocus={focusTopbar}
        topbarRef={topbarRef}
        styles={styles}
      />

      <CalendarButton 
        onClick={() => setShowDatePopup(!showDatePopup)}
        styles={styles}
      />

      <DatePopup 
        showDatePopup={showDatePopup}
        datePopupRef={datePopupRef}
        styles={styles}
      />

      <div className={`
        ${styles['main-content']}
        ${isMobileView && !isSidebarVisible ? styles['content-expanded'] : ''}
      `}>
        {renderComponent()}
      </div>

      {isEdit && userData && (
        <div className={styles['edit-information-popup']}>
          <EditInformation 
            userData={userData}
            onCancel={() => setIsEdit(false)}
            onSave={(updatedData) => {
              updateUserData(updatedData);
              setIsEdit(false);
            }}
            onUpdateUserData={updateUserData}
          />
        </div>
      )}

      {confirmLogout && (
        <LogoutComponent 
          onConfirm={handleLogout}
          onCancel={handleCancelLogout} 
        />
      )}
    </>
  );
}