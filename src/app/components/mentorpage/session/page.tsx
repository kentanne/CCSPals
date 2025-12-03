'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faBell, faCalendarAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import RescheduleDialog from '../RescheduleDialog/page';
import api from '@/lib/axios';
import notify from '@/lib/toast';
import styles from './session.module.css';
import { SessionComponentProps } from '@/interfaces/session';
import SessionCard from '@/components/molecules/SessionCard';
import ConfirmationModal from '@/components/organisms/ConfirmationModal';
import { useSessions } from '@/hooks/useSessions';
import { sessionService } from '@/services/sessionService';

export default function SessionComponent({ schedule = [], upcomingSchedule = [], userData, onScheduleCreated }: SessionComponentProps) {
  const router = useRouter();
  
  const {
    todaySchedule,
    setTodaySchedule,
    upcomingSchedule: upcommingSchedule,
    setUpcomingSchedule,
    selectedItem,
    activePopup,
    selectedSessionID,
    togglePopup,
    handleOptionClick: baseHandleOptionClick,
    getPopupRef
  } = useSessions({
    initialSchedule: schedule,
    initialUpcomingSchedule: upcomingSchedule,
    userType: 'mentor'
  });

  const [showRemindConfirmation, setShowRemindConfirmation] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [reschedIsOpen, setReschedIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOptionClick = (option: string, item: any, event: React.MouseEvent) => {
    const result = baseHandleOptionClick(option, item, event);
    if (!result) return;
    
    switch (option) {
      case 'remind':
        setShowRemindConfirmation(true);
        break;
      case 'reschedule':
        setReschedIsOpen(true);
        break;
      case 'cancel':
        setShowCancelConfirmation(true);
        break;
    }
  };

  const handleSendReminder = async () => {
    if (!selectedItem) return;
    
    setIsSubmitting(true);
    try {
      await sessionService.sendReminder(selectedItem.id);
      notify.success('Reminder sent successfully!');
    } catch (error) {
      console.error('Error sending reminder:', error);
      notify.error('Error sending reminder. Please try again.');
    } finally {
      setIsSubmitting(false);
      setShowRemindConfirmation(false);
    }
  };

  const handleCancelSession = async () => {
    if (!selectedItem) return;
    
    setIsSubmitting(true);
    try {
      await sessionService.cancelSession(selectedItem.id, 'mentor');
      sessionService.removeFromSchedules(
        selectedItem.id,
        setTodaySchedule,
        setUpcomingSchedule
      );
      notify.success('Session cancelled successfully!');
    } catch (error) {
      console.error('Error cancelling session:', error);
      notify.error('Error cancelling session. Please try again.');
    } finally {
      setIsSubmitting(false);
      setShowCancelConfirmation(false);
    }
  };

  const handleReschedule = async (selectedDate: Date) => {
    if (!selectedItem) return;

    setIsSubmitting(true);
    try {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const formattedTime = selectedDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      await sessionService.rescheduleSession(selectedItem.id, formattedDate, formattedTime, 'mentor');
      
      sessionService.updateLocalSchedules(
        selectedItem.id,
        { date: formattedDate, time: formattedTime },
        setTodaySchedule,
        setUpcomingSchedule
      );
      
      setReschedIsOpen(false);
      notify.success('Session rescheduled successfully!');
    } catch (error) {
      console.error('Error rescheduling session:', error);
      notify.error('Error rescheduling session. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinMeeting = (scheduleId: string | number, event: React.MouseEvent) => {
    event.stopPropagation();
    router.push(`/meeting/${scheduleId}`);
  };

  const mentorPopupOptions = [
    {
      label: 'Remind',
      icon: <FontAwesomeIcon icon={faBell} className={styles.sessionOptionIcon} />,
      onClick: (item: any, e: React.MouseEvent) => handleOptionClick('remind', item, e)
    },
    {
      label: 'Reschedule',
      icon: <FontAwesomeIcon icon={faCalendarAlt} className={styles.sessionOptionIcon} />,
      onClick: (item: any, e: React.MouseEvent) => handleOptionClick('reschedule', item, e)
    },
    {
      label: 'Cancel Session',
      icon: <FontAwesomeIcon icon={faTimes} className={styles.sessionOptionIcon} />,
      onClick: (item: any, e: React.MouseEvent) => handleOptionClick('cancel', item, e)
    }
  ];

  return (
    <div className={styles.sessionWrapper}>
      {/* Header Section */}
      <div className={styles.sessionTableHeader}>
        <h2 className={styles.sessionTableTitle}>
          <FontAwesomeIcon icon={faCalendar} className={styles.sessionHeaderIcon} />
          Session Schedule
        </h2>
      </div>

      {/* Main Content Section */}
      <div className={styles.sessionLowerElement}>
        <div className={styles.sessionGrid}>
          {/* Today Schedule */}
          <div className={styles.sessionCard}>
            <h1>TODAY</h1>
            <div className={styles.sessionCardContent}>
              {todaySchedule.length > 0 ? (
                todaySchedule.map((item, index) => (
                  <SessionCard
                    key={item.id}
                    item={item}
                    index={index}
                    type="today"
                    userType="mentor"
                    popupOptions={mentorPopupOptions}
                    activePopup={activePopup}
                    onTogglePopup={togglePopup}
                    onJoinMeeting={handleJoinMeeting}
                    popupRef={getPopupRef('today', index)}
                    styles={styles}
                  />
                ))
              ) : (
                <div className={styles.noScheduleMessage}>
                  <p>No sessions scheduled for today</p>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Schedule */}
          <div className={styles.sessionCard}>
            <h1>UPCOMING</h1>
            <div className={styles.sessionCardContent}>
              {upcommingSchedule.length > 0 ? (
                upcommingSchedule.map((item, index) => (
                  <SessionCard
                    key={item.id}
                    item={item}
                    index={index}
                    type="upcoming"
                    userType="mentor"
                    popupOptions={mentorPopupOptions}
                    activePopup={activePopup}
                    onTogglePopup={togglePopup}
                    popupRef={getPopupRef('upcoming', index)}
                    styles={styles}
                  />
                ))
              ) : (
                <div className={styles.noScheduleMessage}>
                  <p>No upcoming sessions scheduled</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showRemindConfirmation}
        title="Send Reminder"
        message={`Are you sure you want to send a reminder for <strong>${selectedItem?.subject}</strong> to <strong>${selectedItem?.learner?.name}</strong>?`}
        confirmText={isSubmitting ? 'Sending...' : 'Send Reminder'}
        cancelText="Cancel"
        onConfirm={handleSendReminder}
        onCancel={() => setShowRemindConfirmation(false)}
        styles={styles}
      />

      <ConfirmationModal
        isOpen={showCancelConfirmation}
        title="Cancel Session"
        message={`Are you sure you want to cancel <strong>${selectedItem?.subject}</strong> with <strong>${selectedItem?.learner?.name}</strong>?`}
        confirmText={isSubmitting ? 'Cancelling...' : 'Yes, Cancel Session'}
        cancelText="No, Keep It"
        onConfirm={handleCancelSession}
        onCancel={() => setShowCancelConfirmation(false)}
        variant="danger"
        styles={styles}
      />

      {reschedIsOpen && selectedItem && (
        <RescheduleDialog
          id={selectedItem.id as string}
          onClose={() => setReschedIsOpen(false)}
          onReschedule={handleReschedule}
        />
      )}
    </div>
  );
}