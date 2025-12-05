'use client';

import { useState, useEffect } from 'react';
import styles from './reviews.module.css';
import api from '@/lib/axios';
import { ReviewsComponentProps } from '@/interfaces/reviews';
import StarRating from '@/components/atoms/StarRating';
import ReviewerInfo from '@/components/molecules/ReviewerInfo';
import { useReviews } from '@/hooks/useReviews';
import { filterRecords } from '@/utils/reviewUtils';

export default function ReviewsComponent({ feedbacks = [] }: ReviewsComponentProps) {
  const {
    records,
    isFeedback,
    searchQuery,
    setSearchQuery,
    recordView,
    viewFeedback,
    closeFeedback
  } = useReviews({
    initialFeedbacks: feedbacks,
    type: 'mentor'
  });

  const filteredRecords = filterRecords(records, searchQuery, 'mentor');

  return (
    <div className={styles.reviewsTableContainer}>
      <div className={styles.reviewsTableHeader}>
        <h2 className={styles.reviewsTableTitle}>
          <svg className={styles.reviewsHeaderIcon} viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
          </svg>
          Session Records
        </h2>

        <div className={styles.reviewsSearchContainer}>
          <div className={styles.reviewsSearchWrapper}>
            <svg className={styles.reviewsSearchIcon} viewBox="0 0 24 24" width="18" height="18">
              <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input
              type="text"
              placeholder="Search records..."
              className={styles.reviewsSearchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className={styles.reviewsTableScrollContainer}>
        <table className={styles.reviewsDataTable}>
          <thead>
            <tr>
              <th>LEARNER&apos;S NAME</th>
              <th>SPECIALIZATION</th>
              <th>YEAR</th>
              <th>RATING</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record) => (
              <tr key={record.id}>
                <td>{record.reviewer?.name || 'Unknown Learner'}</td>
                <td>{record.reviewer?.course || record.subject || 'N/A'}</td>
                <td>{record.reviewer?.year || 'N/A'}</td>
                <td>
                  <StarRating rating={record.rating} size="small" />
                </td>
                <td>
                  <button 
                    onClick={() => viewFeedback(record)} 
                    className={styles.reviewsDetailsBtn}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16">
                      <path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                    <span>View Feedback</span>
                  </button>
                </td>
              </tr>
            ))}
            {filteredRecords.length === 0 && (
              <tr>
                <td colSpan={5} className={styles.reviewsNoUsers}>
                  No records to display
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isFeedback && recordView && (
        <div className={styles.reviewsModalOverlay} onClick={closeFeedback}>
          <div className={styles.reviewsModalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.reviewsModalHeader}>
              <div className={styles.reviewsHeaderContent}>
                <svg className={styles.reviewsModalIcon} viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                </svg>
                <h3>Feedback Details</h3>
              </div>
              <button className={styles.reviewsCloseBtn} onClick={closeFeedback}>
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>

            <div className={styles.reviewsModalBody}>
              <ReviewerInfo
                reviewer={recordView.reviewer}
                subject={recordView.subject || recordView.reviewer?.course}
                date={recordView.date}
                location={recordView.location}
                type="learner"
              />

              <div className={styles.reviewsFeedbackSection}>
                <div className={styles.reviewsFeedbackCard}>
                  <h5>Rating</h5>
                  <div className={styles.reviewsRatingDisplay}>
                    <StarRating rating={recordView.rating} size="medium" />
                    <span className={styles.reviewsRatingText}>({recordView.rating}/5)</span>
                  </div>
                </div>

                <div className={styles.reviewsFeedbackCard}>
                  <h5>Feedback</h5>
                  <div className={styles.reviewsFeedbackContent}>
                    <p>{recordView.comment || "No feedback provided"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}