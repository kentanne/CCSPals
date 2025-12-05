import { SessionItem } from '@/interfaces/session';
import { FontAwesomeIcon, faUser, faCalendarAlt, faClock, faMapMarkerAlt, faVideo, faFileAlt } from '@/components/atoms/SessionIcons';
import PopupMenu from './PopupMenu';
import { formatDate, formatTime, isOnlineSession } from '@/utils/sessionUtils';

interface SessionCardProps {
  item: SessionItem;
  index: number;
  type: 'today' | 'upcoming';
  userType: 'mentor' | 'learner';
  popupOptions: Array<{
    label: string;
    icon: React.ReactNode;
    onClick: (item: SessionItem, event: React.MouseEvent) => void;
  }>;
  activePopup: { type: string | null; index: number | null };
  onTogglePopup: (type: string, index: number, event: React.MouseEvent) => void;
  onJoinMeeting?: (scheduleId: string | number, event: React.MouseEvent) => void;
  onOpenFiles?: (mentorId: string | number, event: React.MouseEvent) => void;
  popupRef?: (el: HTMLDivElement | null) => void;
  className?: string;
  styles: any; // Pass the CSS module object
}

export default function SessionCard({
  item,
  index,
  type,
  userType,
  popupOptions,
  activePopup,
  onTogglePopup,
  onJoinMeeting,
  onOpenFiles,
  popupRef,
  className = '',
  styles
}: SessionCardProps) {
  const userName = userType === 'mentor' 
    ? item.learner?.name || "Unknown User"
    : item.mentor?.user?.name || item.mentor?.name || "Unknown Mentor";
  
  const canJoinMeeting = isOnlineSession(item.location);
  
  return (
    <div className={`${styles[type === 'today' ? 'sessionTodayCard' : 'sessionUpcomingCard']} ${className}`}>
      <div className={styles.sessionCardHeader}>
        <div className={styles.sessionTitleContainer}>
          <h1>{item.subject}</h1>
        </div>
        <div className={styles.sessionHeaderActions}>
          {canJoinMeeting && onJoinMeeting && type === 'today' && (
            <button
              className={styles.sessionJoinBtn}
              onClick={(e) => onJoinMeeting(item.id, e)}
              title="Join Online Meeting"
            >
              <FontAwesomeIcon icon={faVideo} style={{ color: '#4CAF50', fontSize: '1.5rem' }} />
            </button>
          )}
          
          {userType === 'learner' && onOpenFiles && (
            <button
              className={styles.sessionFilesBtn}
              onClick={(e) => {
                const mentorId = item.mentor?.id || item.mentor?.ment_inf_id || 0;
                onOpenFiles(mentorId, e);
              }}
              title="View Files"
            >
              <FontAwesomeIcon icon={faFileAlt} style={{ color: '#f72197', fontSize: '1.5rem' }} />
            </button>
          )}
          
          <div 
            className={styles.sessionEllipsisContainer} 
            ref={popupRef}
          >
            <PopupMenu
              item={item}
              index={index}
              type={type}
              options={popupOptions}
              isOpen={activePopup.type === `${type}-${index}`}
              onToggle={(e) => onTogglePopup(type, index, e)}
              styles={styles}
            />
          </div>
        </div>
      </div>
      
      <div className={styles.sessionInfo}>
        <FontAwesomeIcon icon={faUser} style={{ color: '#533566', fontSize: '1.2rem' }} />
        <h2>{userName}</h2>
      </div>
      
      <div className={styles.sessionInfo}>
        <FontAwesomeIcon icon={faCalendarAlt} style={{ color: '#0084ce', fontSize: '1.2rem' }} />
        <p>{formatDate(item.date)}</p>
      </div>
      
      <div className={styles.sessionInfo}>
        <FontAwesomeIcon icon={faClock} style={{ color: '#f8312f', fontSize: '1.2rem' }} />
        <p>{formatTime(item.time)}</p>
      </div>
      
      <div className={styles.sessionInfo}>
        <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: '#f72197', fontSize: '1.2rem' }} />
        <p>{item.location}</p>
      </div>
    </div>
  );
}