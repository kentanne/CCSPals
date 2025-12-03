'use client';

import { useState, useEffect, useMemo } from 'react';
import styles from './analytics.module.css';
import { Icons } from '@/components/atoms/Icons';
import StatCard from '@/components/molecules/StatCard';
import ProgressBar from '@/components/atoms/ProgressBar';
import { 
  LearnerAnalyticsData, 
  SessionAnalyticsProps,
  Schedule 
} from '@/interfaces/analytics';
import { formatDate } from '@/utils/analyticsHelpers';

export default function LearnerSessionAnalyticsComponent({ 
  analyticsData, 
  userData, 
  onDataRefresh 
}: SessionAnalyticsProps) {
  const [data, setData] = useState<LearnerAnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');
  const [isLoading, setIsLoading] = useState(false);
  const [sortKey, setSortKey] = useState<keyof Schedule | ''>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    subject: 'all'
  });

  const defaultData: LearnerAnalyticsData = {
    totalSessions: 47,
    groupSessions: 28,
    oneOnOneSessions: 19,
    subjectsOfInterest: [
      { subject: 'Mathematics', count: 15 },
      { subject: 'Programming', count: 12 },
      { subject: 'Physics', count: 8 },
      { subject: 'Algorithms', count: 7 },
      { subject: 'Data Structures', count: 5 }
    ],
    schedules: [
      {
        id: '1', date: '2024-01-15', time: '10:00', subject: 'Mathematics', mentor: 'Alice Johnson', duration: '60', type: 'one-on-one', location: 'Room 101', status: 'completed',
        learners: undefined,
        learningStyle: undefined
      },
      {
        id: '2', date: '2024-01-14', time: '14:00', subject: 'Programming', mentor: 'Bob Smith', duration: '45', type: 'group', location: 'Room 102', status: 'completed',
        learners: undefined,
        learningStyle: undefined
      },
      {
        id: '3', date: '2024-01-13', time: '09:00', subject: 'Algorithms', mentor: 'Carol Davis', duration: '90', type: 'one-on-one', location: 'Room 103', status: 'completed',
        learners: undefined,
        learningStyle: undefined
      },
      {
        id: '4', date: '2024-01-16', time: '11:00', subject: 'Physics', mentor: 'David Wilson', duration: '75', type: 'group', location: 'Room 104', status: 'scheduled',
        learners: undefined,
        learningStyle: undefined
      },
      {
        id: '5', date: '2024-01-12', time: '13:00', subject: 'Data Structures', mentor: 'Eva Brown', duration: '60', type: 'one-on-one', location: 'Room 105', status: 'completed',
        learners: undefined,
        learningStyle: undefined
      },
      {
        id: '6', date: '2024-01-11', time: '15:00', subject: 'Mathematics', mentor: 'Frank Miller', duration: '120', type: 'group', location: 'Room 106', status: 'cancelled',
        learners: undefined,
        learningStyle: undefined
      }
    ]
  };

  useEffect(() => {
    if (analyticsData) {
      setData(analyticsData as LearnerAnalyticsData);
    } else {
      setData(defaultData);
    }
  }, [analyticsData]);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await onDataRefresh();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (key: keyof Schedule) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const getSortArrow = (key: keyof Schedule) => {
    if (sortKey !== key) return null;
    return (
      <span className={`${styles.sortArrow} ${sortOrder === 'desc' ? styles.sortArrowDesc : ''}`}>
        ▲
      </span>
    );
  };

  const filteredAndSortedSessions = useMemo(() => {
    const sessions = data?.schedules || [];
    
    let filtered = sessions.filter(session => {
      if (filters.status !== 'all' && session.status.toLowerCase() !== filters.status.toLowerCase()) return false;
      if (filters.type !== 'all' && session.type !== filters.type) return false;
      if (filters.subject !== 'all' && session.subject !== filters.subject) return false;
      return true;
    });

    if (!sortKey) return filtered;

    return filtered.sort((a, b) => {
      let A: any = a[sortKey];
      let B: any = b[sortKey];
      
      if (sortKey === 'date') {
        A = new Date(a[sortKey]).getTime();
        B = new Date(b[sortKey]).getTime();
      }
      if (sortKey === 'duration') {
        A = parseInt(A) || 0;
        B = parseInt(B) || 0;
      }
      
      if (A < B) return sortOrder === 'asc' ? -1 : 1;
      if (A > B) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data?.schedules, filters, sortKey, sortOrder]);

  const uniqueValues = useMemo(() => {
    const sessions = data?.schedules || [];
    return {
      statuses: ['all', ...Array.from(new Set(sessions.map(s => s.status)))],
      types: ['all', ...Array.from(new Set(sessions.map(s => s.type)))],
      subjects: ['all', ...Array.from(new Set(sessions.map(s => s.subject)))]
    };
  }, [data?.schedules]);

  const getStatusBadge = (status: string) => {
    const statusClass = {
      COMPLETED: styles.statusCompleted,
      SCHEDULED: styles.statusScheduled,
      CANCELLED: styles.statusCancelled
    }[status] || styles.statusDefault;
    
    return <span className={`${styles.statusBadge} ${statusClass}`}>{status}</span>;
  };

  const getSessionTypeBadge = (type: string) => {
    const typeClass = {
      'group': styles.typeGroup,
      'one-on-one': styles.typeOneOnOne
    }[type] || styles.typeDefault;
    
    return <span className={`${styles.typeBadge} ${typeClass}`}>{type}</span>;
  };

  const getTopSubjects = () => data?.subjectsOfInterest || [];
  const getMaxSubjectCount = () => Math.max(...getTopSubjects().map(s => s.count), 1);

  if (!data) {
    return (
      <div className={styles.analyticsLoading}>
        <div className={styles.loadingSpinner}>
          <Icons.Refresh />
          Loading analytics...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.analyticsContainer}>
      <div className={styles.analyticsHeader}>
        <div className={styles.headerMain}>
          <div className={styles.headerTitle}>
            <div className={styles.headerIcon}>
              <Icons.Chart />
            </div>
            <h1>Session Analytics Dashboard</h1>
          </div>
        </div>

        <div className={styles.analyticsControls}>
          <div className={styles.customSelect}>
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className={styles.timeRangeSelect}
              aria-label="Select Time Range"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 90 Days</option>
            </select>
            <div className={styles.selectArrow}>
              <Icons.ChevronDown />
            </div>
          </div>
          
          <button 
            className={`${styles.refreshBtn} ${isLoading ? styles.refreshing : ''}`}
            onClick={handleRefresh}
            disabled={isLoading}
            aria-label="Refresh Data"
          >
            <Icons.Refresh />
            {isLoading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <StatCard
          title="Total Sessions"
          value={data.totalSessions}
          subtitle="All time"
          icon={<Icons.TotalSessions />}
          color="#4f46e5"
          styles={styles}
        />
        <StatCard
          title="Group Sessions"
          value={data.groupSessions}
          subtitle={`${Math.round((data.groupSessions / Math.max(data.totalSessions, 1)) * 100)}% of total`}
          icon={<Icons.GroupSessions />}
          color="#7c3aed"
          styles={styles}
        />
        <StatCard
          title="One-on-One"
          value={data.oneOnOneSessions}
          subtitle={`${Math.round((data.oneOnOneSessions / Math.max(data.totalSessions, 1)) * 100)}% of total`}
          icon={<Icons.OneOnOne />}
          color="#a855f7"
          styles={styles}
        />
        <StatCard
          title="Completed Sessions"
          value={data.schedules.filter(s => s.status === 'COMPLETED').length}
          subtitle="Successfully finished"
          icon={<Icons.Attendance />}
          color="#10b981"
          styles={styles}
        />
      </div>

      <div className={styles.chartsSection}>
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div className={styles.chartTitle}>
              <Icons.Book />
              Completed Sessions per Specialization
            </div>
          </div>
          <div className={styles.subjectsList}>
            {getTopSubjects().length > 0 ? (
              getTopSubjects().map((item, index) => (
                <div key={item.subject} className={styles.subjectItem}>
                  <div className={styles.subjectInfo}>
                    <span className={styles.subjectName}>{item.subject}</span>
                    <span className={styles.subjectCount}>{item.count} completed</span>
                  </div>
                  <ProgressBar 
                    percentage={getMaxSubjectCount() > 0 ? (item.count / getMaxSubjectCount()) * 100 : 0} 
                    color={['#4f46e5', '#7c3aed', '#a855f7', '#c084fc', '#d8b4fe'][index % 5]}
                    styles={styles}
                  />
                </div>
              ))
            ) : (
              <div className={styles.noData}>
                No subject data available
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <div className={styles.tableTitleSection}>
            <div className={styles.tableTitle}>
              <Icons.Clock />
              Recent Sessions
            </div>
            <div className={styles.tableInfo}>
              Showing {filteredAndSortedSessions.length} of {data.schedules.length} sessions
            </div>
          </div>

          <div className={styles.tableFilters}>
            <div className={styles.filterGroup}>
              <Icons.Filter />
              <select 
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className={styles.filterSelect}
                aria-label='Filter by status'
              >
                <option value="all">All Status</option>
                {uniqueValues.statuses.filter(s => s !== 'all').map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <select 
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className={styles.filterSelect}
                aria-label='Filter by type'
              >
                <option value="all">All Types</option>
                {uniqueValues.types.filter(t => t !== 'all').map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <select 
                value={filters.subject}
                onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
                className={styles.filterSelect}
                aria-label='Filter by subject'
              >
                <option value="all">All Specialization</option>
                {uniqueValues.subjects.filter(s => s !== 'all').map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className={styles.tableScrollContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th onClick={() => handleSort('date')} className={styles.sortableHeader}>
                  <div className={styles.headerContent}>
                    <Icons.Calendar />
                    DATE {getSortArrow('date')}
                  </div>
                </th>
                <th onClick={() => handleSort('time')} className={styles.sortableHeader}>
                  <div className={styles.headerContent}>
                    TIME {getSortArrow('time')}
                  </div>
                </th>
                <th onClick={() => handleSort('subject')} className={styles.sortableHeader}>
                  <div className={styles.headerContent}>
                    SPECIALIZATION {getSortArrow('subject')}
                  </div>
                </th>
                <th onClick={() => handleSort('mentor')} className={styles.sortableHeader}>
                  <div className={styles.headerContent}>
                    MENTOR {getSortArrow('mentor')}
                  </div>
                </th>
                <th onClick={() => handleSort('duration')} className={styles.sortableHeader}>
                  <div className={styles.headerContent}>
                    DURATION {getSortArrow('duration')}
                  </div>
                </th>
                <th>TYPE</th>
                <th>LOCATION</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedSessions.length > 0 ? (
                filteredAndSortedSessions.map(session => (
                  <tr key={session.id} className={styles.tableRow}>
                    <td>
                      <div className={styles.dateCell}>
                        {formatDate(session.date)}
                      </div>
                    </td>
                    <td>{session.time}</td>
                    <td className={styles.subjectCell}>
                      {session.subject}
                    </td>
                    <td>{session.mentor}</td>
                    <td>
                      <div className={styles.durationCell}>
                        {session.duration}
                      </div>
                    </td>
                    <td>{getSessionTypeBadge(session.type)}</td>
                    <td>{session.location}</td>
                    <td>{getStatusBadge(session.status)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className={styles.noSessions}>
                    <div className={styles.noSessionsContent}>
                      <Icons.Book />
                      No sessions match the current filters
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}