'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainComponent from '../components/learnerpage/main/page';
import SessionComponent from '../components/learnerpage/session/page';
import ReviewsComponent from '../components/learnerpage/reviews/page';
import ChallengesComponent from '../components/learnerpage/challenges/page';
import EditInformation from '../components/learnerpage/information/page';
import LogoutComponent from '../components/learnerpage/logout/page';
import CommunityForumComponent from '../components/learnerpage/community/page';
import SessionAnalyticsComponent from '../components/learnerpage/analytics/page';
// import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useNavigation } from '@/hooks/useNavigation';
import { useMobileView } from '@/hooks/useMobileView';
import { useUserData } from '@/hooks/useUserData';
import { pusherService } from '@/services/pusherService';
import { authService } from '@/services/authService';
import { userService } from '@/services/userService';
import { transformSchedulesForReview, transformMentorData, normalizeSchedulesForSession } from '@/utils/transformers';
import { useDatePopup, getCurrentDateTime } from '@/utils/dateUtils';
import { LEARNER_TOPBAR_ITEMS } from '@/constants/navigation';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { DatePopup } from '@/components/atoms/DatePopup';
import { TopbarNavigation } from '@/components/molecules/TopbarNavigation';
import { CalendarButton } from '@/components/molecules/CalendarButton';
import { UserSidebar } from '@/components/organisms/UserSidebar';
import styles from './learner.module.css';
import { toast } from 'react-toastify';
import ChatbotWidget from '@/components/organisms/ChatbotWidget';

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
  
  const [isLoading, setIsLoading] = useState(false);
  const [schedForReview, setSchedForReview] = useState([]);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [upcomingSchedule, setUpcomingSchedule] = useState([]);
  const [mentorFiles, setMentorFiles] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [transformedMentors, setTransformedMentors] = useState([]);
  const [forumData, setForumData] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [roleData, setRoleData] = useState(null);
  const [rankData, setRankData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const progressData = {
    sessionsAttended: schedForReview.filter(session => session.has_feedback).length,
    totalSessions: schedForReview.length,
    progress: schedForReview.length > 0 ? (schedForReview.filter(session => session.has_feedback).length / schedForReview.length) * 100 : 0
  };

  const rankProgressPct = (() => {
    if (!rankData) return progressData.progress;
    if (rankData.requiredSessions == null) return 100;
    const req = Math.max(Number(rankData.requiredSessions) || 0, 1);
    const prog = Math.max(Number(rankData.progress) || 0, 0);
    return Math.min(Math.round((prog / req) * 100), 100);
  })();

  // Pusher setup
  useEffect(() => {
    if (!userData?.userId) return;

    const cleanupPusher = pusherService.initializePusher(userData.userId, {
      onNewSchedule: (newSchedule) => {
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
      onScheduleRescheduled: (updated) => {
        console.log('[Pusher] schedule-rescheduled', updated);
        setTodaySchedule(prev => prev.filter(s => s.id !== updated.id));
        setUpcomingSchedule(prev => prev.filter(s => s.id !== updated.id));
        const d = new Date(updated.date); d.setHours(0,0,0,0);
        const t = new Date(); t.setHours(0,0,0,0);
        if (d.getTime() === t.getTime()) setTodaySchedule(prev => [updated, ...prev]);
        else if (d > t) setUpcomingSchedule(prev => [updated, ...prev]);
      },
      onScheduleCancelled: (cancelled) => {
        console.log('[Pusher] schedule-cancelled', cancelled);
        setTodaySchedule(prev => prev.filter(s => s.id !== cancelled.id));
        setUpcomingSchedule(prev => prev.filter(s => s.id !== cancelled.id));
      }
    });

    return cleanupPusher;
  }, [userData?.userId]);

  const fetchAdditionalData = async () => {
    setIsLoading(true);
    try {
      const [schedulesData, mentorsData, forumData, analyticsData] = await Promise.allSettled([
        userService.fetchSchedules('learner'),
        userService.fetchMentors(),
        userService.fetchForumData(),
        userService.fetchAnalytics('learner')
      ]);

      if (schedulesData.status === 'fulfilled') {
        setTodaySchedule(schedulesData.value.todaySchedule || []);
        setUpcomingSchedule(schedulesData.value.upcomingSchedule || []);
        setSchedForReview(schedulesData.value.schedForReview || []);
      }

      if (mentorsData.status === 'fulfilled') {
        setMentors(mentorsData.value);
        setTransformedMentors(transformMentorData(mentorsData.value));
      }

      if (forumData.status === 'fulfilled') {
        setForumData(forumData.value);
      }

      if (analyticsData.status === 'fulfilled') {
        setAnalyticsData(analyticsData.value?.data || null);
      }
    } catch (error) {
      console.error('Error fetching additional data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchAdditionalData();
    }
  }, [userData]);

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

  const registerMentorRole = async () => {
    try {
      if(roleData?.altRole !== null && roleData?.altRole === 'mentor') {
        toast.info('You have already registered as a Mentor.');
        return;
      }
      router.push('/info/mentor/alt');
    } catch (error) {
      console.error('Error registering role:', error);
    }
  };

  const switchRole = async (e) => {
    e?.preventDefault();
    try {
      if (roleData?.altRole === null) { 
        toast.error('No alternate role registered. Please register as a Mentor first.');
        return;
      }
      await authService.switchRole();
      router.replace('/auth/login');
    } catch (error) {
      // Error handled in service
    }
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
      onScheduleCreated: fetchAdditionalData 
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
      case 'challenges':
        return <ChallengesComponent userData={userData} />;
      case 'community':
        return (
          <CommunityForumComponent 
            forumData={forumData}
            userData={userData}
            onForumUpdate={() => userService.fetchForumData().then(setForumData)}
          />
        );
      case 'analytics':
        return (
          <SessionAnalyticsComponent 
            analyticsData={analyticsData}
            userData={userData}
            onDataRefresh={() => userService.fetchAnalytics('learner').then(data => setAnalyticsData(data?.data || null))}
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
        progressData={progressData}
        rankData={rankData}
        rankProgressPct={rankProgressPct}
        showAllCourses={showAllCourses}
        onToggleAllCourses={() => setShowAllCourses(!showAllCourses)}
        onEditInformation={() => setIsEdit(true)}
        onRegisterAltRole={registerMentorRole}
        onSwitchRole={switchRole}
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
              console.log('Data saved:', updatedData);
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

      <ChatbotWidget />
    </>
  );
}