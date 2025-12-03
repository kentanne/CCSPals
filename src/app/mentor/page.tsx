'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainComponent from '../components/mentorpage/main/page';
import SessionComponent from '../components/mentorpage/session/page';
import ReviewsComponent from '../components/mentorpage/reviews/page';
import FilesComponent from '../components/mentorpage/files/page';
import FileManagerComponent from '../components/mentorpage/filemanager/page';
import EditInformationComponent from '../components/mentorpage/information/page';
import LogoutComponent from '../components/mentorpage/logout/page';
import CommunityForumComponent from '../components/mentorpage/community/page';
import SessionAnalyticsComponent from '../components/mentorpage/analytics/page';
import GroupSessionInvite from '../components/mentorpage/GroupSessionInvite/page';
import ChallengesComponent from '../components/mentorpage/challenges/page';
// import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useNavigation } from '@/hooks/useNavigation';
import { useMobileView } from '@/hooks/useMobileView';
import { useUserData } from '@/hooks/useUserData';
import { pusherService } from '@/services/pusherService';
import { authService } from '@/services/authService';
import { userService } from '@/services/userService';
import { normalizeSchedulesForSession } from '@/utils/transformers';
import { useDatePopup, getCurrentDateTime } from '@/utils/dateUtils';
import { MENTOR_TOPBAR_ITEMS } from '@/constants/navigation';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import styles from './mentor.module.css';
import { toast } from 'react-toastify';
import ChatbotWidget from '@/components/organisms/ChatbotWidget';

const HexBadge = ({ badge, styles }: { badge: any; styles: any }) => {
  const def = badge.definition || undefined;
  const bg = def?.color || '#8B5CF6';
  const icon = def?.icon || '🏅';
  const title = def?.name || badge.badgeKey;
  return (
    <div className={styles.hexBadge} title={title} aria-label={title}>
      <div className={styles.hexBadgeInner} style={{ background: bg }}>
        <span className={styles.hexBadgeIcon}>{icon}</span>
      </div>
    </div>
  );
};

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
  
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [todaySchedule, setTodaySchedule] = useState<any[]>([]);
  const [upcomingSchedule, setUpcomingSchedule] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [forumData, setForumData] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [roleData, setRoleData] = useState<any>(null);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditInformation, setShowEditInformation] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showBadgesPopup, setShowBadgesPopup] = useState(false);
  const [showGroupInviteModal, setShowGroupInviteModal] = useState(false);
  const [selectedGroupSessionId, setSelectedGroupSessionId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const subjects = userData?.subjects || [];
  const displayedCourses = subjects.slice(0, 5);
  const remainingCoursesCount = Math.max(subjects.length - 5, 0);
  const courseAbbreviation = userData?.program?.match(/\(([^)]+)\)/)?.[1] || userData?.program || '';
  
  // Prepare progress data for sidebar
  const progressData = {
    sessionsCompleted: feedbacks.length,
    totalStudents: users.length,
    progress: users.length > 0 ? Math.min((feedbacks.length / (users.length * 2)) * 100, 100) : 0
  };

  const filteredUsers = users.filter((user) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      searchQuery === "" ||
      user.name.toLowerCase().includes(searchLower) ||
      user.yearLevel.toLowerCase().includes(searchLower) ||
      user.program.toLowerCase().includes(searchLower)
    );
  });

  // Pusher setup
  useEffect(() => {
    if (!userData?.userId) return;

    const cleanupPusher = pusherService.initializePusher(userData.userId, {
      onNewSchedule: (newSchedule: any) => {
        console.log('[Pusher] new-schedule received:', newSchedule);
        toast.info(`New schedule request from ${newSchedule.learner.name}!`);
        const scheduleDate = new Date(newSchedule.date);
        const today = new Date();
        scheduleDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        if (scheduleDate.getTime() === today.getTime()) {
          setTodaySchedule(prev => [newSchedule, ...prev]);
        } else {
          setUpcomingSchedule(prev => [newSchedule, ...prev]);
        }
      },
      onScheduleRescheduled: (updated: any) => {
        console.log('[Pusher] schedule-rescheduled', updated);
        setTodaySchedule(prev => prev.filter(s => s.id !== updated.id));
        setUpcomingSchedule(prev => prev.filter(s => s.id !== updated.id));
        const d = new Date(updated.date); d.setHours(0,0,0,0);
        const t = new Date(); t.setHours(0,0,0,0);
        if (d.getTime() === t.getTime()) setTodaySchedule(prev => [updated, ...prev]);
        else if (d > t) setUpcomingSchedule(prev => [updated, ...prev]);
      },
      onScheduleCancelled: (cancelled: any) => {
        console.log('[Pusher] schedule-cancelled', cancelled);
        setTodaySchedule(prev => prev.filter(s => s.id !== cancelled.id));
        setUpcomingSchedule(prev => prev.filter(s => s.id !== cancelled.id));
      },
      onNewFeedback: (fb: any) => {
        console.log('[Pusher] new-feedback', fb);
        toast.info(`New feedback received!`);
        setFeedbacks(prev => [fb, ...prev]);
      }
    });

    return cleanupPusher;
  }, [userData?.userId]);

  const fetchAdditionalData = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const [learnersData, schedulesData, feedbacksData, forumData, analyticsData] = await Promise.allSettled([
        userService.fetchLearners(),
        userService.fetchSchedules('mentor'),
        userService.fetchFeedbacks(),
        userService.fetchForumData(),
        userService.fetchAnalytics('mentor')
      ]);

      if (learnersData.status === 'fulfilled') {
        setUsers(learnersData.value);
      } else {
        console.warn('Failed to fetch learners:', learnersData.reason);
      }

      if (schedulesData.status === 'fulfilled') {
        const schedules = schedulesData.value;
        setTodaySchedule(schedules.todaySchedule || []);
        setUpcomingSchedule(schedules.upcomingSchedule || []);
      } else {
        console.warn('Failed to fetch schedules:', schedulesData.reason);
      }

      if (feedbacksData.status === 'fulfilled') {
        setFeedbacks(feedbacksData.value);
      } else {
        console.warn('Failed to fetch feedbacks:', feedbacksData.reason);
      }

      if (forumData.status === 'fulfilled') {
        setForumData(forumData.value);
      } else {
        console.warn('Failed to fetch forum data:', forumData.reason);
      }

      if (analyticsData.status === 'fulfilled') {
        setAnalyticsData(analyticsData.value?.data || null);
      } else {
        console.warn('Failed to fetch analytics:', analyticsData.reason);
      }

    } catch (error) {
      console.error('Error fetching additional data:', error);
      setApiError('Failed to load some data. Some features may not work properly.');
    } finally {
      setIsLoading(false);
    }
  };

  const getFiles = async () => {
    try {
      console.log("Fetching files...");
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
      if (userData.roleData) {
        setRoleData(userData.roleData);
      }
      if (userData.badges) {
        setBadges(userData.badges);
      }
      
      fetchAdditionalData();
      getFiles();
    }
  }, [userData]);

  const toggleShowAllCourses = () => {
    setShowAllCourses(!showAllCourses);
  };

  const registerLearnerRole = async () => {
    try {
      if(roleData?.altRole !== null && roleData?.altRole === 'learner') {
        toast.info('You have already registered as a Learner.');
        return;
      }
      router.replace('/info/learner/alt');
    } catch (error) {
      console.error('Error registering role:', error);
      toast.error('Failed to register as learner. Please try again.');
    }
  };

  const switchRole = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    try {
      if (roleData?.altRole === null) { 
        toast.error('No alternate role registered. Please register as a Learner first.');
        return;
      }
      await authService.switchRole();
      router.replace('/auth/login');
    } catch (error: any) {
      console.error('Error switching role:', error);
    }
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
          <button 
            className={styles.errorClose}
            onClick={() => setApiError(null)}
          >
            ×
          </button>
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
          userData={{
            ...userData,
            onOpenGroupInvite: (sessionId: string) => {
              setSelectedGroupSessionId(sessionId);
              setShowGroupInviteModal(true);
            }
          }}
          onScheduleCreated={fetchAdditionalData}
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
      case 'challenges':
        return <ChallengesComponent userData={userData} />;
      case 'community':
        return <CommunityForumComponent 
          forumData={forumData}
          userData={userData}
          onForumUpdate={() => userService.fetchForumData().then(setForumData)}
        />;
      case 'analytics':
        return <SessionAnalyticsComponent 
          analyticsData={analyticsData}
          userData={userData}
          onDataRefresh={() => userService.fetchAnalytics('mentor').then(data => setAnalyticsData(data?.data || null))}
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

      {showBadgesPopup && (
        <div
          className={styles.badgesOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="Mentor medals"
          onClick={() => setShowBadgesPopup(false)}
        >
          <div
            className={styles.badgesModal}
            onClick={(e) => e.stopPropagation()}
            style={{
              margin: 'auto',
              position: 'relative',
              maxHeight: '80vh',
              width: 'min(920px, 92vw)',
              overflow: 'auto'
            }}
          >
            <div className={styles.badgesHeader}>
              <h3>Badges</h3>
              <button
                className={styles.badgesClose}
                onClick={() => setShowBadgesPopup(false)}
                aria-label="Close medals"
              >
                ×
              </button>
            </div>

            <div className={styles.badgesSubheader}>
              <span className={styles.latestDot} /> Latest
            </div>

            <div className={styles.badgesGrid}>
              {(badges || []).map((b: any, i: number) => {
                const def = b.definition || undefined;
                const name = def?.name || b.badgeKey;
                const desc = def?.description || '';
                return (
                  <div key={`${b.badgeKey}-${i}`} className={styles.badgeCard}>
                    <HexBadge badge={b} styles={styles} />
                    <div className={styles.badgeMeta}>
                      <div className={styles.badgeName}>{name}</div>
                      {desc ? (
                        <div className={styles.badgeDesc}>{desc}</div>
                      ) : null}
                      <div className={styles.badgeDate}>
                        {new Date(b.awardedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                );
              })}
              {(!badges || badges.length === 0) && (
                <div className={styles.emptyBadges}>
                  No medals yet. Complete activities to earn medals.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showGroupInviteModal && selectedGroupSessionId && (
        <GroupSessionInvite
          sessionId={selectedGroupSessionId}
          onClose={() => {
            setShowGroupInviteModal(false);
            setSelectedGroupSessionId(null);
          }}
          onInviteSent={() => {
            setShowGroupInviteModal(false);
            setSelectedGroupSessionId(null);
            toast.success('Group session invite sent successfully!');
          }}
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
          <div className={styles.medalsSection}>
            <div className={styles.medalsHeader}>
              <h1 className={styles.medalsTitle}>Badges</h1>
              <button
                className={styles.viewAllBadgesBtn}
                onClick={() => setShowBadgesPopup(true)}
              >
                View All
              </button>
            </div>

            <div className={styles.medalsLatestRow}>
              <span className={styles.latestLabel}>Latest</span>
              <div className={styles.badgeRow}>
                {(badges || []).slice(0, 3).map((b: any, i: number) => (
                  <HexBadge key={`${b.badgeKey}-${i}`} badge={b} styles={styles} />
                ))}
                {(!badges || badges.length === 0) && (
                  <div className={styles.noBadgesText}>No medals yet</div>
                )}
              </div>
            </div>
          </div>
          
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
                <a onClick={registerLearnerRole} style={{ cursor: 'pointer' }}>
                  <img src="/svg/register.svg" alt="Register" /> Register as Learner
                </a>
                <a onClick={switchRole} style={{ cursor: 'pointer' }}>
                  <img src="/svg/switch.svg" alt="Switch" /> Switch Account Role
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

      <ChatbotWidget />
    </div>
  );
}