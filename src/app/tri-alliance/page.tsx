'use client';

import { useState, useEffect } from 'react';
import { Player, AllianceEvent, PlayerAssignment, EventStatus } from '@/types';
import Navigation from '@/components/Navigation';
import EventHero from '@/components/EventHero';
import TriAllianceEventLayout from '@/components/TriAllianceEventLayout';
import EventList from '@/components/EventList';
import { getPlayers } from '@/utils/playerService';
import {
  getAllianceEvents,
  createAllianceEvent,
  updateAllianceEvent,
  deleteAllianceEvent,
  serializeAssignments,
  deserializeAssignments,
} from '@/utils/eventService';
import styles from './page.module.css';

const ALLIANCE_ID = 1;
const EVENT_ID = 2; // Tri Alliance event ID

export default function TriAlliancePage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [events, setEvents] = useState<AllianceEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<AllianceEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [playersData, eventsData] = await Promise.all([
        getPlayers(ALLIANCE_ID, 844),
        getAllianceEvents(ALLIANCE_ID, EVENT_ID),
      ]);

      const sortedPlayers = playersData.sort((a, b) => b.trialliancePower - a.trialliancePower);
      setPlayers(sortedPlayers);
      setEvents(eventsData);
    } catch (error) {
      console.error('Failed to load data:', error);
      alert('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    setIsCreatingEvent(true);
    try {
      const newEvent = await createAllianceEvent({
        allianceId: ALLIANCE_ID,
        eventId: EVENT_ID,
        status: 'not-started' as EventStatus,
        startsAt: new Date().toISOString(),
      });
      setSelectedEvent(newEvent);
    } catch (error) {
      console.error('Failed to create event:', error);
      alert('Failed to create event');
    } finally {
      setIsCreatingEvent(false);
    }
  };

  const handleSaveAssignments = async (assignments: PlayerAssignment[]) => {
    if (!selectedEvent) return;

    setIsSaving(true);
    try {
      const serialized = serializeAssignments(assignments);
      await updateAllianceEvent(selectedEvent.id!, {
        assignments: serialized,
        updatedAt: new Date().toISOString(),
      });

      // Update local state
      setSelectedEvent((prev) => {
        if (!prev) return prev;
        return { ...prev, assignments: serialized };
      });

      // Refresh events list
      await loadData();
      alert('Event saved successfully!');
    } catch (error) {
      console.error('Failed to save event:', error);
      alert('Failed to save event');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      await deleteAllianceEvent(eventId);
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      if (selectedEvent?.id === eventId) {
        setSelectedEvent(null);
      }
    } catch (error) {
      console.error('Failed to delete event:', error);
      alert('Failed to delete event');
    }
  };

  const handleBackToList = () => {
    setSelectedEvent(null);
  };

  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.container}>
          {selectedEvent ? (
            // Event Editor View
            <>
              <div className={styles.header}>
                <button onClick={handleBackToList} className={styles.backButton}>
                  ← Back to Events
                </button>
              </div>
              <EventHero eventType="tri-alliance" />
              <TriAllianceEventLayout
                players={players}
                initialAssignments={deserializeAssignments(selectedEvent.assignments || null)}
                onSave={handleSaveAssignments}
                isSaving={isSaving}
              />
            </>
          ) : (
            // Events List View
            <>
              <div className={styles.header}>
                <h1 className={styles.title}>Tri Alliance Event Management</h1>
                <button
                  onClick={handleCreateEvent}
                  className={styles.createButton}
                  disabled={isCreatingEvent || isLoading}
                >
                  {isCreatingEvent ? 'Creating...' : '+ Create New Event'}
                </button>
              </div>

              {isLoading ? (
                <p>Loading...</p>
              ) : (
                <EventList
                  events={events}
                  onEventClick={setSelectedEvent}
                  onDeleteEvent={handleDeleteEvent}
                  isLoading={false}
                />
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
