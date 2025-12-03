'use client';

import { useState, useEffect, useMemo, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from 'react';
import styles from './analytics.module.css';
import api from '@/lib/axios';
import { toast } from 'react-toastify';
import { Icons } from '@/components/atoms/Icons';
import StatCard from '@/components/molecules/StatCard';
import ProgressBar from '@/components/atoms/ProgressBar';
import { 
  MentorAnalyticsData, 
  SessionAnalyticsProps,
  Schedule 
} from '@/interfaces/analytics';
import { formatDate, calculateAttendanceRate } from '@/utils/analyticsHelpers';

export default function MentorSessionAnalyticsComponent({ 
  analyticsData, 
  userData, 
  onDataRefresh 
}: SessionAnalyticsProps) {
  const [data, setData] = useState<MentorAnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');
  const [isLoading, setIsLoading] = useState(false);
  const [sortKey, setSortKey] = useState<keyof Schedule | ''>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    learningStyle: 'all',
    subject: 'all'
  });

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/mentor/session/analytics', { 
        withCredentials: true 
      });

      if (response.status === 200 && response.data?.data) {
        const apiData = response.data.data;
        
        const mappedData: MentorAnalyticsData = {
          aveRating: typeof apiData.aveRating === 'number' ? apiData.aveRating : 0,
          totalSessions: typeof apiData.totalSessions === 'number' ? apiData.totalSessions : 0,
          groupSessions: typeof apiData.groupSessions === 'number' ? apiData.groupSessions : 0,
          oneOnOneSessions: typeof apiData.oneOnOneSessions === 'number' ? apiData.oneOnOneSessions : 0,
          topSubjects: Array.isArray(apiData.topSubjects) ? apiData.topSubjects.map((s: any) => ({
            subject: s.subject || '',
            count: typeof s.count === 'number' ? s.count : 0
          })) : [],
          topStyles: Array.isArray(apiData.topStyles) ? apiData.topStyles.map((s: any) => ({
            style: s.style || '',
            count: typeof s.count === 'number' ? s.count : 0
          })) : [],
          schedules: Array.isArray(apiData.schedules) ? apiData.schedules.map((s: any) => ({
            id: s.id || '',
            date: s.date || '',
            subject: s.subject || '',
            learners: Array.isArray(s.learners) ? s.learners : [],
            duration: s.duration || 'N/A',
            type: s.type || 'N/A',
            learningStyle: Array.isArray(s.learningStyle) ? s.learningStyle : [],
            status: s.status || 'SCHEDULED'
          })) : []
        };

        setData(mappedData);
      } else {
        toast.error('Failed to load analytics data');
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast.error('Error fetching analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (analyticsData) {
      setData(analyticsData as MentorAnalyticsData);
    } else {
      fetchAnalyticsData();
    }
  }, [analyticsData]);

  const handleRefresh = async () => {
    await fetchAnalyticsData();
    if (onDataRefresh) {
      onDataRefresh();
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
      if (filters.status !== 'all' && session.status !== filters.status) return false;
      if (filters.type !== 'all' && session.type !== filters.type) return false;
      if (filters.learningStyle !== 'all' && !session.learningStyle.includes(filters.learningStyle)) return false;
      if (filters.subject !== 'all' && session.subject !== filters.subject) return false;
      return true;
    });

    if (!sortKey) return filtered;

    return filtered.sort((a, b) => {
      let A: any = a[sortKey];
      let B: any = b[sortKey];
      
      if (sortKey === 'date') {
        A = new Date(a.date).getTime();
        B = new Date(b.date).getTime();
      }
      if (sortKey === 'duration') {
        A = parseInt(a.duration) || 0;
        B = parseInt(b.duration) || 0;
      }
      if (sortKey === 'learners') {
        A = a.learners.join(', ');
        B = b.learners.join(', ');
      }
      if (sortKey === 'learningStyle') {
        A = a.learningStyle.join(', ');
        B = b.learningStyle.join(', ');
      }
      
      if (A < B) return sortOrder === 'asc' ? -1 : 1;
      if (A > B) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data?.schedules, filters, sortKey, sortOrder]);

  const uniqueValues = useMemo(() => {
    const sessions = data?.schedules || [];
    const allStyles = sessions.flatMap(s => s.learningStyle);
    return {
      statuses: ['all', ...new Set(sessions.map(s => s.status))],
      types: ['all', ...new Set(sessions.map(s => s.type))],
      learningStyles: ['all', ...new Set(allStyles)],
      subjects: ['all', ...new Set(sessions.map(s => s.subject))]
    };
  }, [data?.schedules]);

  const attendanceRate = useMemo(() => {
    return calculateAttendanceRate(data?.schedules || []);
  }, [data]);

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

  const getTopSubjects = () => data?.topSubjects || [];
  const getTopLearningStyles = () => data?.topStyles || [];
  const getMaxSubjectCount = () => Math.max(...getTopSubjects().map(s => s.count), 1);
  const getMaxLearningStyleCount = () => Math.max(...getTopLearningStyles().map(s => s.count), 1);

  if (!data && isLoading) {
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
          {data?.aveRating && (
            <div className={styles.averageRating}>
              <span className={styles.ratingLabel}>Average Rating:</span>
              <span className={styles.ratingValue}>{data.aveRating.toFixed(2)} ⭐</span>
            </div>
          )}
        </div>

        <div className={styles.analyticsControls}>
          <div className={styles.customSelect}>
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className={styles.timeRangeSelect}
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
          >
            <Icons.Refresh />
            {isLoading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <StatCard
          title="Total Sessions"
          value={data?.totalSessions || 0}
          subtitle="All time"
          icon={<Icons.TotalSessions />}
          color="#4f46e5"
          styles={styles}
        />
        <StatCard
          title="Group Sessions"
          value={data?.groupSessions || 0}
          subtitle={`${Math.round(((data?.groupSessions || 0) / (data?.totalSessions || 1)) * 100)}% of total`}
          icon={<Icons.GroupSessions />}
          color="#7c3aed"
          styles={styles}
        />
        <StatCard
          title="One-on-One"
          value={data?.oneOnOneSessions || 0}
          subtitle={`${Math.round(((data?.oneOnOneSessions || 0) / (data?.totalSessions || 1)) * 100)}% of total`}
          icon={<Icons.OneOnOne />}
          color="#a855f7"
          styles={styles}
        />
        <StatCard
          title="Completion Rate"
          value={`${attendanceRate}%`}
          subtitle="Completed sessions"
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
              Top Specialization
            </div>
          </div>
          <div className={styles.subjectsList}>
            {getTopSubjects().length > 0 ? (
              getTopSubjects().map((item, index) => (
                <div key={item.subject} className={styles.subjectItem}>
                  <div className={styles.subjectInfo}>
                    <span className={styles.subjectName}>{item.subject}</span>
                    <span className={styles.subjectCount}>{item.count} sessions</span>
                  </div>
                  <ProgressBar 
                    percentage={(item.count / getMaxSubjectCount()) * 100} 
                    color={['#4f46e5', '#7c3aed', '#a855f7', '#c084fc', '#d8b4fe'][index % 5]}
                    styles={styles}
                  />
                </div>
              ))
            ) : (
              <div className={styles.noData}>
                No Specialization data available
              </div>
            )}
          </div>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div className={styles.chartTitle}>
              <Icons.Graduation />
              Top Learning Styles
            </div>
          </div>
          <div className={styles.learningStylesList}>
            {getTopLearningStyles().length > 0 ? (
              getTopLearningStyles().map((item, index) => (
                <div key={item.style} className={styles.learningStyleItem}>
                  <div className={styles.learningStyleInfo}>
                    <span className={styles.learningStyleName}>{item.style}</span>
                    <span className={styles.learningStyleCount}>{item.count} occurrences</span>
                  </div>
                  <ProgressBar 
                    percentage={(item.count / getMaxLearningStyleCount()) * 100} 
                    color={['#10b981', '#059669', '#047857', '#065f46', '#064e3b'][index % 5]}
                    styles={styles}
                  />
                </div>
              ))
            ) : (
              <div className={styles.noData}>
                No learning style data available
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
              Showing {filteredAndSortedSessions.length} of {data?.schedules?.length || 0} sessions
            </div>
          </div>

          <div className={styles.tableFilters}>
            <div className={styles.filterGroup}>
              <Icons.Filter />
              <select 
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className={styles.filterSelect}
              >
                {uniqueValues.statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Status' : status}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <select 
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className={styles.filterSelect}
              >
                {uniqueValues.types.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <select 
                value={filters.learningStyle}
                onChange={(e) => setFilters(prev => ({ ...prev, learningStyle: e.target.value }))}
                className={styles.filterSelect}
              >
                {uniqueValues.learningStyles.map(style => (
                  <option key={style} value={style}>
                    {style === 'all' ? 'All Styles' : style}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <select 
                value={filters.subject}
                onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
                className={styles.filterSelect}
              >
                {uniqueValues.subjects.map(subject => (
                  <option key={subject} value={subject}>
                    {subject === 'all' ? 'All Subjects' : subject}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className={styles.tableScrollContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th 
                  onClick={() => handleSort('date')} 
                  className={styles.sortableHeader}
                >
                  <div className={styles.headerContent}>
                    <Icons.Calendar />
                    DATE {getSortArrow('date')}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('subject')} 
                  className={styles.sortableHeader}
                >
                  <div className={styles.headerContent}>
                    SPECIALIZATION {getSortArrow('subject')}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('learners')} 
                  className={styles.sortableHeader}
                >
                  <div className={styles.headerContent}>
                    LEARNERS {getSortArrow('learners')}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('duration')} 
                  className={styles.sortableHeader}
                >
                  <div className={styles.headerContent}>
                    DURATION {getSortArrow('duration')}
                  </div>
                </th>
                <th>TYPE</th>
                <th>LEARNING STYLES</th>
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
                    <td className={styles.subjectCell}>
                      {session.subject}
                    </td>
                    <td>
                      <div className={styles.learnersCell}>
                        {session.learners.join(', ')}
                      </div>
                    </td>
                    <td>
                      <div className={styles.durationCell}>
                        {session.duration}
                      </div>
                    </td>
                    <td>{getSessionTypeBadge(session.type)}</td>
                    <td>
                      <div className={styles.stylesCell}>
                        {session.learningStyle.map((style: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, idx: Key | null | undefined) => (
                          <span key={idx} className={styles.learningStyleBadge}>
                            {style}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>{getStatusBadge(session.status)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className={styles.noSessions}>
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