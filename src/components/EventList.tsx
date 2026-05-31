'use client';

import { AllianceEvent, EventStatus } from '@/types';
import styles from './EventList.module.css';

interface EventListProps {
  events: AllianceEvent[];
  onEventClick: (event: AllianceEvent) => void;
  onDeleteEvent: (id: number) => Promise<void>;
  isLoading?: boolean;
}

export default function EventList({
  events,
  onEventClick,
  onDeleteEvent,
  isLoading = false,
}: EventListProps) {
  const getStatusColor = (status: EventStatus) => {
    switch (status) {
      case 'not-started':
        return styles.statusNotStarted;
      case 'ongoing':
        return styles.statusOngoing;
      case 'completed':
        return styles.statusCompleted;
      default:
        return '';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No date set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Separate upcoming and past events
  const now = new Date();
  const upcomingEvents = events.filter((event) => {
    if (!event.startsAt) return false;
    return new Date(event.startsAt) > now;
  });

  const pastEvents = events.filter((event) => {
    if (!event.startsAt) return true; // No date events go to past
    return new Date(event.startsAt) <= now;
  });

  if (isLoading) {
    return <div className={styles.loading}>Loading events...</div>;
  }

  if (events.length === 0) {
    return <div className={styles.empty}>No events created yet. Create your first event!</div>;
  }

  const renderEventCards = (eventList: AllianceEvent[]) => (
    <div className={styles.eventsGrid}>
      {eventList.map((event) => (
        <div key={event.id} className={styles.eventCard}>
          <div className={styles.cardHeader}>
            <div className={styles.dateInfo}>
              <span className={styles.date}>{formatDate(event.startsAt)}</span>
              <span className={`${styles.status} ${getStatusColor(event.status)}`}>
                {event.status}
              </span>
            </div>
            <button
              onClick={() => onDeleteEvent(event.id!)}
              className={styles.deleteBtn}
              title="Delete event"
            >
              ✕
            </button>
          </div>

          <div className={styles.cardBody}>
            {event.rules && (
              <div className={styles.field}>
                <label>Rules:</label>
                <p>{event.rules}</p>
              </div>
            )}

            {event.notes && (
              <div className={styles.field}>
                <label>Notes:</label>
                <p>{event.notes}</p>
              </div>
            )}

            <div className={styles.field}>
              <label>Assignments:</label>
              <p>{event.assignments ? 'Configured' : 'Not configured'}</p>
            </div>
          </div>

          <div className={styles.cardFooter}>
            <button
              onClick={() => onEventClick(event)}
              className={styles.editBtn}
            >
              Edit Event
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.container}>
      {upcomingEvents.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.title}>Upcoming Events</h2>
          {renderEventCards(upcomingEvents)}
        </div>
      )}

      {pastEvents.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.title}>Past Events</h2>
          {renderEventCards(pastEvents)}
        </div>
      )}
    </div>
  );
}
