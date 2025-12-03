'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faCalendarAlt as faRescheduleIcon, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import RescheduleDialog from '../RescheduleDialog/page';
import api from '@/lib/axios';
import styles from './session.module.css';
import { SessionComponentProps } from '@/interfaces/session';
import SessionCard from '@/components/molecules/SessionCard';
import FileModal from '@/components/molecules/FileModal';
import ConfirmationModal from '@/components/organisms/ConfirmationModal';
import { useSessions } from '@/hooks/useSessions';
import { sessionService } from '@/services/sessionService';

export default function SessionComponent({ 
  schedule = [], 
  upcomingSchedule = [], 
  mentFiles = { files: [] },
  schedForReview = [],
  userInformation = [],
  userData
}: SessionComponentProps) {
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
    userType: 'learner'
  });

  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [showRescheduleConfirmation, setShowRescheduleConfirmation] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [selectedMentorId, setSelectedMentorId] = useState<string | number | null>(null);
  const [reschedIsOpen, setReschedIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOptionClick = (option: string, item: any, event: React.MouseEvent) => {
    const result = baseHandleOptionClick(option, item, event);
    if (!result) return;
    
    switch (option) {
      case "reschedule":
        setShowRescheduleConfirmation(true);
        break;
      case "cancel":
        setShowCancelConfirmation(true);
        break;
    }
  };

  const handleOpenFiles = (mentorId: string | number, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedMentorId(mentorId);
    setIsFileModalOpen(true);
  };

  const handleCancelSession = async () => {
    if (!selectedItem) return;
    
    setIsSubmitting(true);
    try {
      await sessionService.cancelSession(selectedItem.id, 'learner');
      sessionService.removeFromSchedules(
        selectedItem.id,
        setTodaySchedule,
        setUpcomingSchedule
      );
      alert('Session cancelled successfully!');
    } catch (error: any) {
      console.error('Error cancelling session:', error);
      const errorMessage = error.response?.data?.message || 'Failed to cancel session';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
      setShowCancelConfirmation(false);
    }
  };

  const handleReschedule = async (newDate: string, newTime: string) => {
    if (!selectedSessionID) return;
    
    setIsSubmitting(true);
    try {
      await sessionService.rescheduleSession(selectedSessionID, newDate, newTime, 'learner');
      
      sessionService.updateLocalSchedules(
        selectedSessionID,
        { date: newDate, time: newTime },
        setTodaySchedule,
        setUpcomingSchedule
      );
      
      setReschedIsOpen(false);
      alert('Session rescheduled successfully!');
    } catch (error: any) {
      console.error('Error rescheduling session:', error);
      const errorMessage = error.response?.data?.message || 'Failed to reschedule session';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinMeeting = (scheduleId: string | number, event: React.MouseEvent) => {
    event.stopPropagation();
    router.push(`/meeting/${scheduleId}`);
  };

  const learnerPopupOptions = [
    {
      label: 'Reschedule',
      icon: <FontAwesomeIcon icon={faRescheduleIcon} className={styles['option-icon']} />,
      onClick: (item: any, e: React.MouseEvent) => handleOptionClick('reschedule', item, e)
    },
    {
      label: 'Cancel Session',
      icon: <FontAwesomeIcon icon={faTimes} className={styles['option-icon']} />,
      onClick: (item: any, e: React.MouseEvent) => handleOptionClick('cancel', item, e)
    }
  ];

  return (
    <div className={styles['session-wrapper']}>
      <div className={styles['table-header']}>
        <h2 className={styles['table-title']}>
          <FontAwesomeIcon icon={faCalendarAlt} className={styles['header-icon']} />
          Session Schedule
        </h2>
      </div>

      <div className={styles['lower-element']}>
        <div className={styles['session-grid']}>
          <div className={styles['session-card']}>
            <h1>TODAY</h1>
            <div className={styles['session-card-content']}>
              {todaySchedule.length === 0 ? (
                <div className={styles['no-sessions']}>
                  <p>No sessions scheduled for today</p>
                </div>
              ) : (
                todaySchedule.map((item, index) => (
                  <SessionCard
                    key={`${item.id}-${index}`}
                    item={item}
                    index={index}
                    type="today"
                    userType="learner"
                    popupOptions={learnerPopupOptions}
                    activePopup={activePopup}
                    onTogglePopup={togglePopup}
                    onJoinMeeting={handleJoinMeeting}
                    onOpenFiles={handleOpenFiles}
                    popupRef={getPopupRef('today', index)}
                    styles={styles}
                  />
                ))
              )}
            </div>
          </div>

          <div className={styles['session-card']}>
            <h1>UPCOMING</h1>
            <div className={styles['session-card-content']}>
              {upcommingSchedule.length === 0 ? (
                <div className={styles['no-sessions']}>
                  <p>No upcoming sessions</p>
                </div>
              ) : (
                upcommingSchedule.map((item, index) => (
                  <SessionCard
                    key={`${item.id}-${index}`}
                    item={item}
                    index={index}
                    type="upcoming"
                    userType="learner"
                    popupOptions={learnerPopupOptions}
                    activePopup={activePopup}
                    onTogglePopup={togglePopup}
                    onOpenFiles={handleOpenFiles}
                    popupRef={getPopupRef('upcoming', index)}
                    styles={styles}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <FileModal
        isOpen={isFileModalOpen}
        mentorId={selectedMentorId}
        onClose={() => setIsFileModalOpen(false)}
        initialFiles={mentFiles?.files || []}
        styles={styles}
      />

      <ConfirmationModal
        isOpen={showCancelConfirmation}
        title="Cancel Session"
        message={`Are you sure you want to cancel <strong>${selectedItem?.subject}</strong> with <strong>${selectedItem?.mentor?.user?.name}</strong>?`}
        confirmText={isSubmitting ? 'Cancelling...' : 'Yes, Cancel Session'}
        cancelText="No, Keep It"
        onConfirm={handleCancelSession}
        onCancel={() => setShowCancelConfirmation(false)}
        variant="danger"
        styles={styles}
      />

      <ConfirmationModal
        isOpen={showRescheduleConfirmation}
        title="Reschedule Session"
        message={`Are you sure you want to reschedule <strong>${selectedItem?.subject}</strong> with <strong>${selectedItem?.mentor?.user?.name}</strong>?`}
        confirmText="Yes, Reschedule"
        cancelText="No, Keep It"
        onConfirm={() => {
          setShowRescheduleConfirmation(false);
          setReschedIsOpen(true);
        }}
        onCancel={() => setShowRescheduleConfirmation(false)}
        styles={styles}
      />

      {reschedIsOpen && selectedSessionID && (
        <div className={styles['modal-overlay']}>
          <RescheduleDialog
            sessionId={selectedSessionID as number}
            currentDate={selectedItem?.date || ''}
            currentTime={selectedItem?.time || ''}
            onClose={() => setReschedIsOpen(false)}
            onReschedule={handleReschedule}
          />
        </div>
      )}
    </div>
  );
}