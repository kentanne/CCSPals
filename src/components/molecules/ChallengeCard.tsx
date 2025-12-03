import React from 'react';
import { Challenge } from '@/interfaces/challenges';
import { getSpecializationIcon, formatSpecialization } from '../../utils/challengeHelpers';
import learnerStyles from '@/app/components/learnerpage/challenges/challenges.module.css';
import mentorStyles from '@/app/components/mentorpage/challenges/challenges.module.css';

interface ChallengeCardProps {
  challenge: Challenge;
  onViewDetails?: (challenge: Challenge) => void;
  onEdit?: (challenge: Challenge) => void;
  onDelete?: (challengeId: string) => void;
  onSubmit?: (challenge: Challenge) => void;
  onViewSubmissions?: (challenge: Challenge) => void;
  hasSubmitted?: boolean;
  submissionStatus?: string;
  isMentor?: boolean;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onViewDetails,
  onEdit,
  onDelete,
  onSubmit,
  onViewSubmissions,
  hasSubmitted = false,
  submissionStatus,
  isMentor = false
}) => {
  const { getStatusColor } = require('../../utils/challengeHelpers');

  // pick styles dynamically
  const styles = isMentor ? mentorStyles : learnerStyles;

  return (
    <div className={styles.challengeCard}>
      <div className={styles.challengeHeader}>
        <span className={styles.categoryIcon}>
          {getSpecializationIcon(challenge.specialization)}
        </span>
        <div className={styles.challengeInfo}>
          <h3 className={styles.challengeTitle}>{challenge.title}</h3>
          <div className={styles.challengeMeta}>
            <span className={styles.points}>{challenge.points} pts</span>
            <span className={styles.specializationTag}>
              {formatSpecialization(challenge.specialization)}
            </span>
            {challenge.deadline && (
              <span className={styles.deadline}>
                Due: {new Date(challenge.deadline).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>

      <p className={styles.challengeDescription}>{challenge.description}</p>

      <div className={styles.challengeFooter}>
        <div className={styles.submissionInfo}>
          {isMentor ? (
            <>
              <svg className={styles.submissionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{challenge.submissions.length} submissions</span>
              {challenge.submissions.filter(sub => sub.status === 'pending').length > 0 && (
                <span className={styles.pendingCount}>
                  {challenge.submissions.filter(sub => sub.status === 'pending').length} pending
                </span>
              )}
            </>
          ) : (
            hasSubmitted ? (
              <div className={styles.submissionStatus}>
                <span 
                  className={styles.statusBadge}
                  style={{ backgroundColor: getStatusColor(submissionStatus || 'pending') }}
                >
                  {submissionStatus?.toUpperCase() || 'SUBMITTED'}
                </span>
                {submissionStatus === 'approved' && (
                  <span className={styles.pointsAwarded}>
                    +{challenge.points} points earned!
                  </span>
                )}
              </div>
            ) : (
              <span className={styles.notSubmitted}>Not submitted yet</span>
            )
          )}
        </div>
        
        <div className={styles.challengeActions}>
          {onViewDetails && (
            <button
              className={styles.viewButton}
              onClick={() => onViewDetails(challenge)}
              title="View Challenge Details"
            >
              <svg className={styles.buttonIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {isMentor ? 'View' : 'Details'}
            </button>
          )}
          
          {isMentor && onViewSubmissions && (
            <button
              className={styles.viewButton}
              onClick={() => onViewSubmissions(challenge)}
              title="View Submissions"
            >
              <svg className={styles.buttonIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
          )}
          
          {isMentor && onEdit && (
            <button
              className={styles.editButton}
              onClick={() => onEdit(challenge)}
              title="Edit Challenge"
            >
              <svg className={styles.buttonIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          
          {isMentor && onDelete && (
            <button
              className={styles.deleteButton}
              onClick={() => onDelete(challenge.id)}
              title="Delete Challenge"
            >
              <svg className={styles.buttonIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
          
          {!isMentor && !hasSubmitted && onSubmit && (
            <button
              className={styles.submitButton}
              onClick={() => onSubmit(challenge)}
              title="Submit Solution"
            >
              <svg className={styles.buttonIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
