'use client';

import { supabase } from './supabaseClient';
import {
  AllianceEvent,
  EventAssignments,
  PlayerAssignment,
  EventStatus,
  EventType,
} from '@/types';

/**
 * Create a new alliance event
 */
export async function createAllianceEvent(event: Omit<AllianceEvent, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const { data, error } = await supabase
      .from('alliance_event')
      .insert([event])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating alliance event:', error);
    throw error;
  }
}

/**
 * Get alliance events by alliance ID and event ID
 */
export async function getAllianceEvents(allianceId: number, eventId: number) {
  try {
    const { data, error } = await supabase
      .from('alliance_event')
      .select('*')
      .eq('allianceId', allianceId)
      .eq('eventId', eventId)
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching alliance events:', error);
    throw error;
  }
}

/**
 * Get a single alliance event by ID
 */
export async function getAllianceEventById(id: number) {
  try {
    const { data, error } = await supabase
      .from('alliance_event')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error('Error fetching alliance event:', error);
    throw error;
  }
}

/**
 * Update alliance event
 */
export async function updateAllianceEvent(
  id: number,
  updates: Partial<AllianceEvent>
) {
  try {
    const { data, error } = await supabase
      .from('alliance_event')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating alliance event:', error);
    throw error;
  }
}

/**
 * Delete alliance event
 */
export async function deleteAllianceEvent(id: number) {
  try {
    const { error } = await supabase
      .from('alliance_event')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting alliance event:', error);
    throw error;
  }
}

/**
 * Save assignments as JSON string
 */
export function serializeAssignments(assignments: PlayerAssignment[]): string {
  return JSON.stringify(assignments);
}

/**
 * Parse assignments from JSON string
 */
export function deserializeAssignments(assignmentsJson: string | null): PlayerAssignment[] {
  if (!assignmentsJson) return [];
  try {
    return JSON.parse(assignmentsJson);
  } catch (error) {
    console.error('Error parsing assignments:', error);
    return [];
  }
}

/**
 * Add or update players in an event
 */
export async function addPlayersToEvent(
  allianceEventId: number,
  playerIds: number[]
) {
  try {
    const eventPlayers = playerIds.map((playerId) => ({
      playerId,
      alliance_event_id: allianceEventId,
      didShowUp: false,
    }));

    const { data, error } = await supabase
      .from('event_player')
      .upsert(eventPlayers, { onConflict: 'alliance_event_id,playerId' })
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding players to event:', error);
    throw error;
  }
}

/**
 * Get players in an event
 */
export async function getEventPlayers(allianceEventId: number) {
  try {
    const { data, error } = await supabase
      .from('event_player')
      .select('*')
      .eq('alliance_event_id', allianceEventId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching event players:', error);
    throw error;
  }
}

/**
 * Update event player (didShowUp, score, notes)
 */
export async function updateEventPlayer(
  id: number,
  updates: { didShowUp?: boolean; score?: number; notes?: string }
) {
  try {
    const { data, error } = await supabase
      .from('event_player')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating event player:', error);
    throw error;
  }
}

/**
 * Remove player from event
 */
export async function removePlayerFromEvent(id: number) {
  try {
    const { error } = await supabase
      .from('event_player')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error removing player from event:', error);
    throw error;
  }
}
