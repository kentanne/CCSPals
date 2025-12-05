'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Lazy load heavy components
const MainComponent = dynamic(() => import('@/components/templates/MentorMainTemplate/page'), {
  loading: () => <div className="loadingFallback">Loading...</div>,
  ssr: false
});
const SessionComponent = dynamic(() => import('@/components/organisms/views/MentorSessionsView/page'), {
  loading: () => <div className="loadingFallback">Loading sessions...</div>,
  ssr: false
});
const ReviewsComponent = dynamic(() => import('@/components/organisms/tables/MentorReviewsTable/page'), {
  loading: () => <div className="loadingFallback">Loading reviews...</div>,
  ssr: false
});
const FilesComponent = dynamic(() => import('@/components/organisms/forms/FileUploadForm/page'), {
  loading: () => <div className="loadingFallback">Loading file upload...</div>,
  ssr: false
});
const FileManagerComponent = dynamic(() => import('@/components/organisms/tables/FileManagerTable/page'), {
  loading: () => <div className="loadingFallback">Loading files...</div>,
  ssr: false
});
const EditInformationComponent = dynamic(() => import('@/components/organisms/forms/MentorEditInformationForm/page'), {
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
import { useLearners } from '@/hooks/useLearners';
import { useSchedules } from '@/hooks/useSchedules';
import { useFeedbacks } from '@/hooks/useFeedbacks';
import { authService } from '@/services/authService';
import { normalizeSchedulesForSession } from '@/utils/transformers';
import { useDatePopup, getCurrentDateTime } from '@/utils/dateUtils';
import { MENTOR_TOPBAR_ITEMS } from '@/constants/navigation';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import styles from './mentor.module.css';
import { toast } from 'react-toastify';

export default function MentorPage() {
  const router = useRouter();
  // useAuthGuard('mentor');
  
  const { 
    activeComponent, 
    focusedTopbarIndex, 
    isTopbarFocused, 
    topbarRef, 
    switchComponent, 
    handleTopbarKeyDown, 
    focusTopbar,
    setIsTopbarFocused 
  } = useNavigation(MENTOR_TOPBAR_ITEMS, 'main');
  
  const { isMobileView, isSidebarVisible, toggleSidebar } = useMobileView();
  const { showDatePopup, setShowDatePopup, datePopupRef } = useDatePopup();
  const { userData, isLoading: userLoading, updateUserData } = useUserData('mentor');
  
  // Use custom hooks for data fetching
  const { learners: users, isLoading: learnersLoading, error: learnersError, refetch: refetchLearners } = useLearners();
  const { 
    todaySchedule, 
    upcomingSchedule, 
    isLoading: schedulesLoading, 
    error: schedulesError,
    refetch: refetchSchedules 
  } = useSchedules('mentor');
  const { feedbacks, isLoading: feedbacksLoading, error: feedbacksError, refetch: refetchFeedbacks } = useFeedbacks();
  const [files, setFiles] = useState<any[]>([]);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditInformation, setShowEditInformation] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const isLoading = learnersLoading || schedulesLoading || feedbacksLoading || userLoading;
  const apiError = learnersError || schedulesError || feedbacksError;

  // Refetch function to refresh all data
  const refetchData = async () => {
    await Promise.all([refetchLearners(), refetchSchedules(), refetchFeedbacks()]);
  };

  const subjects = userData?.subjects || [];
  const displayedCourses = subjects.slice(0, 5);
  const remainingCoursesCount = Math.max(subjects.length - 5, 0);
  const courseAbbreviation = userData?.program?.match(/\(([^)]+)\)/)?.[1] || userData?.program || '';
  
  const filteredUsers = users.filter((user) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      searchQuery === "" ||
      user.name?.toLowerCase().includes(searchLower) ||
      user.yearLevel?.toLowerCase().includes(searchLower) ||
      user.program?.toLowerCase().includes(searchLower)
    );
  });

  const getFiles = async () => {
    try {
      const mockFiles = [
        { id: 1, name: "Mathematics_Notes.pdf", size: "2.4 MB", date: "2024-01-10" },
        { id: 2, name: "Programming_Exercises.zip", size: "5.1 MB", date: "2024-01-08" },
      ];
      setFiles(mockFiles);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    if (userData) {
      getFiles();
    }
  }, [userData]);

  const toggleShowAllCourses = () => {
    setShowAllCourses(!showAllCourses);
  };

  const handleLogout = async () => {
    setShowLogoutModal(false);
    try {
      await authService.logout();
      router.replace('/auth/login');
    } catch (error) {
      // Error handled in authService
    }
  };

  const cancelLogout = () => setShowLogoutModal(false);
  
  const openEditInformation = () => {
    setShowEditInformation(true);
  };

  const handleSaveInformation = (updatedData: any) => {
    updateUserData(updatedData);
    setShowEditInformation(false);
    toast.success('Profile updated successfully!');
  };

  const handleCancelEdit = () => {
    setShowEditInformation(false);
  };

  const ErrorDisplay = () => {
    if (!apiError) return null;
    
    return (
      <div className={styles.apiErrorBanner}>
        <div className={styles.errorContent}>
          <span className={styles.errorIcon}>⚠️</span>
          <span className={styles.errorMessage}>{apiError}</span>
        </div>
      </div>
    );
  };

  const renderComponent = () => {
    const sessionSchedule = normalizeSchedulesForSession(todaySchedule);
    const sessionUpcoming = normalizeSchedulesForSession(upcomingSchedule);

    switch (activeComponent) {
      case 'main':
        return (
          <MainComponent 
            users={users.map(u => ({
              id: u.id,
              name: u.name,
              yearLevel: u.yearLevel,
              program: u.program,
              image: u.image
            }))}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setUserId={() => {}}
            mentorData={userData}
            userData={userData}
          />
        );
      case 'session':
        return <SessionComponent 
          schedule={sessionSchedule} 
          upcomingSchedule={sessionUpcoming}
          userData={userData}
          onScheduleCreated={refetchData}
        />;
      case 'reviews':
        return <ReviewsComponent 
          feedbacks={feedbacks}
          userData={userData}
        />;
      case 'files':
        return <FilesComponent 
          files={files} 
          setFiles={setFiles}
          userData={userData}
        />;
      case 'fileManage':
        return <FileManagerComponent 
          files={files} 
          setFiles={setFiles}
          userData={userData}
        />;
      default:
        return (
          <MainComponent 
            users={filteredUsers}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setUserId={() => {}}
            mentorData={userData}
            userData={userData}
          />
        );
    }
  };

  if (userLoading) {
    return <LoadingSpinner styles={styles} />;
  }

  return (
    <div className={styles.mentorPage}>
      <ErrorDisplay />
      
      {isLoading && <LoadingSpinner styles={styles} />}

      {showEditInformation && userData && (
        <EditInformationComponent 
          userData={userData}
          onSave={handleSaveInformation}
          onCancel={handleCancelEdit}
          onUpdateUserData={updateUserData}
        />
      )}
      
      {showLogoutModal && (
        <LogoutComponent
          onConfirm={handleLogout}
          onCancel={cancelLogout}
        />
      )}

      {isMobileView && (
        <button className={styles.sidebarToggle} onClick={toggleSidebar}>
          ☰
        </button>
      )}

      {isMobileView && isSidebarVisible && (
        <div className={styles.sidebarOverlay} onClick={toggleSidebar}></div>
      )}

      {/* Custom Sidebar matching your CSS structure */}
      <div 
        className={`${styles.sidebar} ${
          isMobileView ? styles.sidebarMobile : ''
        } ${
          isMobileView && isSidebarVisible ? styles.sidebarMobileVisible : ''
        }`}
      >
        <div className={styles.logoContainer}>
          <img src="/img/logo_gccoed.png" alt="GCCoEd Logo" className={styles.logo} />
          <span className={styles.logoText}>CCSPals</span>
        </div>

        <div className={styles.upperElement}>
          <div>
            <h1>Hi, Mentor!</h1>
            <img
              src={userData?.image || 'https://placehold.co/600x400'}
              alt="profile-pic"
              width={100}
              height={100}
              className={styles.profileImage}
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/600x400';
              }}
            />
          </div>
          <div>
            <h2>{userData?.name || ''}</h2>
            <i><p>{userData?.yearLevel || ''}</p></i>
            <p className={styles.programText}>{courseAbbreviation}</p>
          </div>
        </div>

        <div className={styles.footerElement}>
          <div className={styles.availability}>
            <h1>Availability</h1>
            <div className={styles.lines}>
              <h3>Days:</h3>
              <div>
                <p>{userData?.availability?.join(", ") || 'Not specified'}</p>
              </div>
            </div>
            <div className={styles.lines}>
              <h3>Duration:</h3>
              <div>
                <p>{userData?.sessionDur || 'Not specified'}</p>
              </div>
            </div>
          </div>

          <div className={styles.courseOffered}>
            <h1>Specialization</h1>
            
            <div className={styles.courseGrid}>
              {displayedCourses.map((card: string, index: number) => (
                <div key={index} className={styles.courseCard}>
                  <div className={styles.lines}>
                    <div>
                      <p title={card}>{card}</p>
                    </div>
                  </div>
                </div>
              ))}
              {remainingCoursesCount > 0 && (
                <div 
                  className={`${styles.courseCard} ${styles.remainingCourses}`} 
                  onClick={toggleShowAllCourses}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleShowAllCourses();
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Show all ${subjects.length} courses`}
                >
                  <div className={styles.lines}>
                    <div>
                      <p style={{ color: '#007bff', fontWeight: 'bold' }}>
                        +{remainingCoursesCount} more
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {showAllCourses && (
              <div className={styles.allCoursesPopup}>
                <div className={styles.popupOverlay} onClick={toggleShowAllCourses}></div>
                <div className={styles.popupContent}>
                  <h3>All Courses Offered ({subjects.length})</h3>
                  <div className={styles.popupCourses}>
                    {subjects.map((course: string, index: number) => (
                      <div key={index} className={styles.popupCourse}>
                        {course}
                      </div>
                    ))}
                  </div>
                  <button 
                    className={styles.closePopup}
                    onClick={toggleShowAllCourses}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className={styles.accountActions}>
            <div className={styles.accountDropdown}>
              <button className={styles.accountDropbtn}>
                <img src="/svg/person.svg" alt="Account" className={styles.accountIcon} />
                Account
              </button>
              <div className={styles.accountDropdownContent}>
                <a onClick={openEditInformation} style={{ cursor: 'pointer' }}>
                  <img src="/svg/edit.svg" alt="Edit" /> Edit Information
                </a>
                <a onClick={() => setShowLogoutModal(true)} style={{ cursor: 'pointer' }}>
                  <img src="/svg/logout.svg" alt="Logout" /> Logout
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div 
        ref={topbarRef}
        className={`${styles.topbar} ${
          isMobileView && !isSidebarVisible ? styles.topbarExpanded : ''
        } ${isTopbarFocused ? styles.topbarFocused : ''}`}
        tabIndex={0}
        onKeyDown={handleTopbarKeyDown}
        onFocus={focusTopbar}
        onBlur={() => setIsTopbarFocused(false)}
        onClick={focusTopbar}
      >
        <div className={styles.topbarLeft}>
          {MENTOR_TOPBAR_ITEMS.map((item, index) => (
            <div 
              key={item.key}
              onClick={() => switchComponent(item.key)}
              className={`${styles.topbarOption} ${
                activeComponent === item.key ? styles.active : ''
              } ${index === focusedTopbarIndex && isTopbarFocused ? styles.focused : ''}`}
            >
              <img src={item.icon} alt={item.label} className={styles.navIcon} />
              <span className={styles.navText}>{item.label}</span>
            </div>
          ))}
        </div>
        
        <div className={styles.dateContainer} ref={datePopupRef}>
          <button 
            className={styles.calendarIconBtn}
            onClick={() => setShowDatePopup(!showDatePopup)}
            aria-label="Show current date and time"
          >
            <img src="/svg/time.svg" alt="Calendar" className={styles.calendarIcon} />
          </button>
          
          {showDatePopup && (
            <div className={styles.datePopup}>
              <div className={styles.dateContent}>
                <div className={styles.currentDate}>
                  {getCurrentDateTime().date}
                </div>
                <div className={styles.currentTime}>
                  {getCurrentDateTime().time}
                </div>
              </div>
              <div className={styles.popupArrow}></div>
            </div>
          )}
        </div>
      </div>

      <div 
        className={`${styles.mainContent} ${
          isMobileView && !isSidebarVisible ? styles.contentExpanded : ''
        }`}
        style={{ position: 'relative' }}
      >
        {renderComponent()}
      </div>
    </div>
  );
}