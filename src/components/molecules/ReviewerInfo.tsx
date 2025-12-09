import { Reviewer } from '@/interfaces/reviews';

interface ReviewerInfoProps {
  reviewer?: Reviewer;
  subject?: string;
  date?: string;
  location?: string;
  type?: 'mentor' | 'learner';
}

export default function ReviewerInfo({ 
  reviewer, 
  subject, 
  date, 
  location,
  type = 'mentor'
}: ReviewerInfoProps) {
  const getReviewerName = () => reviewer?.name || (type === 'mentor' ? 'Unknown Mentor' : 'Unknown Learner');
  const getReviewerCourse = () => {
    if (!reviewer?.course && !reviewer?.program) return 'N/A';
    const course = reviewer.course || reviewer.program || '';
    return course.match(/\(([^)]+)\)/)?.[1] || course;
  };
  const getReviewerYear = () => reviewer?.year || reviewer?.yearLevel || 'N/A';
  
  return (
    <div className="reviewer-info">
      <div className="profile-section">
        <div className="profile-image">
          <img
            src={reviewer?.image 
              ? `${process.env.NEXT_PUBLIC_API_URL}/api/image/${reviewer.image}`
              : `https://placehold.co/120x120/3b9aa9/ffffff?text=${getReviewerName().charAt(0)}`
            }
            alt={getReviewerName()}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://placehold.co/120x120/3b9aa9/ffffff?text=${getReviewerName().charAt(0)}`;
            }}
          />
        </div>
        <div className="profile-details">
          <h4 className="reviewer-name">{getReviewerName()}</h4>
          <div className="details-row">
            <div className="detail-badge detail-course">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
              </svg>
              <span>{getReviewerCourse()}</span>
            </div>
            <div className="detail-badge detail-year">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
              </svg>
              <span>{getReviewerYear()}</span>
            </div>
            {date && (
              <div className="detail-badge detail-date">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/>
                </svg>
                <span>{date}</span>
              </div>
            )}
            {subject && (
              <div className="detail-badge detail-subject">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 4h2v5l-1-.75L9 9V4zm9 16H6V4h1v9l3-2.25L13 13V4h5v16z"/>
                </svg>
                <span>{subject}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}