import React from 'react';
import { UserData, ProgressData, RankData } from '@/interfaces/user';

interface UserSidebarProps {
  userData: UserData | null;
  role: 'learner' | 'mentor';
  progressData?: ProgressData;
  rankData?: RankData | null;
  rankProgressPct?: number;
  showAllCourses: boolean;
  onToggleAllCourses: () => void;
  onEditInformation: () => void;
  onRegisterAltRole: () => void;
  onSwitchRole: () => void;
  onLogout: () => void;
  isMobileView: boolean;
  isSidebarVisible: boolean;
  styles: any;
}

export const UserSidebar: React.FC<UserSidebarProps> = ({
  userData,
  role,
  progressData,
  rankData,
  rankProgressPct = 0,
  showAllCourses,
  onToggleAllCourses,
  onEditInformation,
  onRegisterAltRole,
  onSwitchRole,
  onLogout,
  isMobileView,
  isSidebarVisible,
  styles
}) => {
  const courseAbbreviation = userData?.program || '';
  const subjects = userData?.subjects || [];
  const displayedCourses = subjects.slice(0, 5);
  const remainingCoursesCount = Math.max(subjects.length - 5, 0);

  return (
    <div className={`
      ${styles.sidebar}
      ${isMobileView ? styles['sidebar-mobile'] : ''}
      ${isMobileView && isSidebarVisible ? styles['sidebar-mobile-visible'] : ''}
    `}>
      <div className={styles['logo-container']}>
        <img src="/img/logo_gccoed.png" alt="GCCoEd Logo" className={styles.logo} />
        <span className={styles['logo-text']}>{role === 'learner' ? 'CCSPals' : 'MindMates'}</span>
      </div>

      <div className={styles['upper-element']}>
        <div>
          <h1>Hi, {role === 'learner' ? 'Learner' : 'Mentor'}!</h1>
          <img
            src={userData?.image || 'https://placehold.co/100x100'}
            alt="profile-pic"
            width={100}
            height={100}
          />
        </div>
        <div>
          <h2>{userData?.name || ''}</h2>
          <i><p>{userData?.yearLevel || ''}</p></i>
          <i><p>{courseAbbreviation}</p></i>
        </div>
      </div>

      {/* Progress Tracker - Only for Learner */}
      {role === 'learner' && progressData && (
        <div className={styles['progress-tracker']}>
          <h1>Learning Progress</h1>
          <div className={styles['progress-item']}>
            <div className={styles['progress-header']}>
              <span className={styles['progress-title']}>
                <p className={styles['progress-label']}>Rank:</p>
                {rankData ? `${rankData.rank}` : 'Sessions Attended'}
              </span>
              <span className={styles['progress-percentage']}>
                {rankData ? `${rankProgressPct}%` : `${Math.round(progressData.progress)}%`}
              </span>
            </div>
            <div className={styles['progress-bar']}>
              <div 
                className={styles['progress-fill']}
                style={{ width: `${rankData ? rankProgressPct : progressData.progress}%` }}
              ></div>
            </div>
            <div className={styles['progress-details']}>
              <span className={styles['progress-count']}>
                {rankData
                  ? (rankData.requiredSessions == null
                      ? 'Top rank achieved'
                      : `${rankData.progress} / ${rankData.requiredSessions} sessions` +
                        (typeof rankData.sessionsToNextRank === 'number'
                          ? ` • ${rankData.sessionsToNextRank} to next rank`
                          : '')
                    )
                  : `${progressData.sessionsAttended} / ${progressData.totalSessions} sessions`
                }
              </span>
            </div>
          </div>
        </div>
      )}

      <div className={styles['footer-element']}>
        <div className={styles.availability}>
          <h1>Availability</h1>
          <div className={styles.lines}>
            <h3>Days:</h3>
            <div>
              <p>{userData?.availability?.join(', ') || 'Not specified'}</p>
            </div>
          </div>
          <div className={styles.lines}>
            <h3>Duration:</h3>
            <div>
              <p>{userData?.sessionDur || 'Not specified'}</p>
            </div>
          </div>
        </div>

        <div className={role === 'learner' ? styles['subject-interest'] : styles.courseOffered}>
          <h1>Specialization</h1>
          <div className={styles['course-grid']}>
            {displayedCourses.map((subject, index) => (
              <div key={index} className={styles['course-card']}>
                <div className={styles.lines}>
                  <div>
                    <p title={subject}>{subject}</p>
                  </div>
                </div>
              </div>
            ))}
            {remainingCoursesCount > 0 && (
              <div
                className={`${styles['course-card']} ${styles['remaining-courses']}`}
                onClick={onToggleAllCourses}
              >
                <div className={styles.lines}>
                  <div>
                    <p>+{remainingCoursesCount}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {showAllCourses && (
            <div className={styles['all-courses-popup']}>
              <div
                className={styles['popup-overlay']}
                onClick={onToggleAllCourses}
              />
              <div className={styles['popup-content']}>
                <h3>All Specializations</h3>
                <div className={styles['popup-courses']}>
                  {subjects.map((subject, index) => (
                    <div key={index} className={styles['popup-course']}>
                      {subject}
                    </div>
                  ))}
                </div>
                <button
                  className={styles['popup-close-btn']}
                  onClick={onToggleAllCourses}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        <div className={styles['account-actions']}>
          <div className={styles['account-dropdown']}>
            <button className={styles['account-dropbtn']}>
              <img src="/svg/person.svg" alt="Account" className={styles['account-icon']} />
              Account
            </button>
            <div className={styles['account-dropdown-content']}>
              <a onClick={onEditInformation}>
                <img src="/svg/edit.svg" alt="Edit" /> Edit Information
              </a>
              <a onClick={onRegisterAltRole}>
                <img src="/svg/register.svg" alt="Register" /> 
                Register as {role === 'learner' ? 'Mentor' : 'Learner'}
              </a>
              <a onClick={onSwitchRole}>
                <img src="/svg/switch.svg" alt="Switch" /> Switch Account Role
              </a>
              <a onClick={onLogout}>
                <img src="/svg/logout.svg" alt="Logout" /> Logout
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};