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
          <h4>{getReviewerName()}</h4>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">{type === 'mentor' ? 'Specialization:' : 'Course:'}</span>
              <span className="detail-value">{subject || getReviewerCourse()}</span>
            </div>
            {date && (
              <div className="detail-item">
                <span className="detail-label">Date:</span>
                <span className="detail-value">{date}</span>
              </div>
            )}
            {location && (
              <div className="detail-item">
                <span className="detail-label">Location:</span>
                <span className="detail-value">{location}</span>
              </div>
            )}
            {type === 'learner' && (
              <div className="detail-item">
                <span className="detail-label">Year Level:</span>
                <span className="detail-value">{getReviewerYear()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}