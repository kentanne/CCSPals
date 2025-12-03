'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import notify from '@/lib/toast';
import './ReviewsComponent.css';
import { ReviewsComponentProps, Feedback } from '@/interfaces/reviews';
import StarRating from '@/components/atoms/StarRating';
import ReviewerInfo from '@/components/molecules/ReviewerInfo';
import { useReviews } from '@/hooks/useReviews';
import { reviewService } from '@/services/reviewService';
import { hasFeedback, filterRecords } from '@/utils/reviewUtils';

export default function ReviewsComponent({ schedForReview = [], userData, data }: ReviewsComponentProps) {
  const {
    records,
    setRecords,
    recordView,
    setRecordView,
    isFeedback,
    setIsFeedback,
    searchQuery,
    setSearchQuery,
    tempRating,
    setTempRating,
    hoverRating,
    setHoverRating,
    feedbackText,
    setFeedbackText,
    isSubmitting,
    setIsSubmitting,
    viewFeedback,
    closeFeedback,
    handleSetRating,
    fetchExistingFeedbacks
  } = useReviews({
    initialSchedules: schedForReview || data?.schedForReview,
    type: 'learner',
    userData
  });

  const handleSubmitFeedback = async () => {
    if (tempRating === 0) {
      alert('Please provide a rating before submitting feedback.');
      return;
    }

    if (!recordView) {
      alert('No session selected for feedback.');
      return;
    }

    const mentorId = recordView.mentorId;
    const scheduleId = recordView.scheduleId;
    
    if (!mentorId || !scheduleId) {
      alert('Missing required information. Cannot submit feedback.');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Submitting feedback:', {
        mentorId,
        scheduleId,
        rating: tempRating,
        comments: feedbackText
      });

      await reviewService.submitFeedback(scheduleId, mentorId, tempRating, feedbackText, 'learner');
      console.log('Feedback submitted successfully');

      const updatedRecord = {
        ...recordView,
        rating: tempRating,
        comment: feedbackText,
        has_feedback: true
      };

      reviewService.updateRecord(recordView.id, updatedRecord, setRecords);
      
      await fetchExistingFeedbacks();
      
      closeFeedback();
      notify.success('Feedback submitted successfully!');

    } catch (error: any) {
      reviewService.handleSubmitError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRecords = filterRecords(records, searchQuery, 'learner');

  return (
    <div className="reviews-container">
      <div className="reviews-header">
        <h2 className="reviews-title">
          <svg className="header-icon" viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
          </svg>
          Session Records
        </h2>

        <div className="search-container">
          <div className="search-wrapper">
            <svg className="search-icon" viewBox="0 0 24 24" width="18" height="18">
              <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input
              type="text"
              placeholder="Search records..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="table-scroll-container">
        <table className="reviews-table">
          <thead>
            <tr>
              <th>MENTOR&apos;S NAME</th>
              <th>SPECIALIZATION</th>
              <th>DATE</th>
              <th>RATING</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record) => (
              <tr key={record.id}>
                <td>{record.reviewer?.name || 'Unknown Mentor'}</td>
                <td>{record.subject || 'N/A'}</td>
                <td>{record.date || 'N/A'}</td>
                <td>
                  <StarRating rating={record.rating} size="small" />
                </td>
                <td>
                  <button 
                    onClick={() => viewFeedback(record)} 
                    className={`details-btn ${hasFeedback(record) ? 'sent' : ''}`}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16">
                      <path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                    <span>{hasFeedback(record) ? 'View Feedback' : 'Give Feedback'}</span>
                  </button>
                </td>
              </tr>
            ))}
            {filteredRecords.length === 0 && (
              <tr>
                <td colSpan={5} className="no-records">
                  No records to display
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isFeedback && recordView && (
        <div className="modal-overlay" onClick={closeFeedback}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="header-content">
                <svg className="modal-icon" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                </svg>
                <h3>Feedback</h3>
              </div>
              <button className="close-btn" onClick={closeFeedback} aria-label="Close feedback form">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <ReviewerInfo
                reviewer={recordView.reviewer}
                subject={recordView.subject}
                date={recordView.date}
                location={recordView.location}
                type="mentor"
              />

              <div className="feedback-section">
                <div className="feedback-card">
                  <h5>
                    <svg viewBox="0 0 24 24" width="16" height="16" style={{ marginRight: '0.5rem' }}>
                      <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                    Rate This Session
                  </h5>
                  <StarRating
                    rating={tempRating}
                    interactive={!hasFeedback(recordView)}
                    onRatingChange={handleSetRating}
                    disabled={hasFeedback(recordView)}
                    size="large"
                  />
                  {hasFeedback(recordView) && (
                    <div className="current-rating">
                      Your rating: {recordView.rating} stars
                    </div>
                  )}
                </div>

                <div className="feedback-card">
                  <h5>
                    <svg viewBox="0 0 24 24" width="16" height="16" style={{ marginRight: '0.5rem' }}>
                      <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                    </svg>
                    Feedback
                  </h5>
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder={hasFeedback(recordView) ? '' : 'Enter your feedback here...'}
                    className="feedback-input"
                    disabled={hasFeedback(recordView)}
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-btn back" onClick={closeFeedback}>
                <svg viewBox="0 0 24 24" width="16" height="16" style={{ marginRight: '0.5rem' }}>
                  <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                </svg>
                Back to Records
              </button>
              {!hasFeedback(recordView) && (
                <button
                  onClick={handleSubmitFeedback}
                  className="modal-btn submit"
                  disabled={tempRating === 0 || isSubmitting}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" style={{ marginRight: '0.5rem' }}>
                    <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                  </svg>
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}