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
import { useSchedules } from '@/hooks/useSchedules';
import { authService } from '@/services/authService';
import { transformSchedulesForReview, normalizeSchedulesForSession } from '@/utils/transformers';
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
  const { 
    todaySchedule, 
    upcomingSchedule, 
    schedForReview, 
    isLoading: schedulesLoading, 
    error: schedulesError,
    refetch: refetchSchedules 
  } = useSchedules('learner');
  
  const [mentorFiles, setMentorFiles] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isLoading = mentorsLoading || schedulesLoading || userLoading;

  // Refetch function to refresh all data
  const refetchData = async () => {
    await Promise.all([refetchMentors(), refetchSchedules()]);
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
    const transformedSchedForReview = transformSchedulesForReview(schedForReview);
    const sessionSchedule = normalizeSchedulesForSession(todaySchedule);
    const sessionUpcoming = normalizeSchedulesForSession(upcomingSchedule);
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
      schedForReview: schedForReview,
      mentFiles: sessionMentFiles,
      onScheduleCreated: refetchData 
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
            schedForReview={transformedSchedForReview}
            userInformation={filteredUsers}
            userData={userData}
          />
        );
      case 'records':
        return (
          <ReviewsComponent
            schedForReview={schedForReview}
            userData={userData}
            data={{ schedForReview: schedForReview }}
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