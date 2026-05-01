import { Player } from '@/types';

const SESSION_STORAGE_KEY = 'kingshot_players_session';

/**
 * Get players from session storage
 */
export function getSessionPlayers(): Player[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading from session storage:', error);
    return [];
  }
}

/**
 * Save players to session storage
 */
export function setSessionPlayers(players: Player[]): void {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(players));
  } catch (error) {
    console.error('Error saving to session storage:', error);
  }
}

/**
 * Add or update a single player in session storage
 */
export function upsertSessionPlayer(player: Player): void {
  const players = getSessionPlayers();
  const index = players.findIndex((p) => p.id === player.id);

  if (index >= 0) {
    players[index] = player;
  } else {
    players.push(player);
  }

  setSessionPlayers(players);
}

/**
 * Remove a player from session storage
 */
export function removeSessionPlayer(playerId: string): void {
  const players = getSessionPlayers();
  setSessionPlayers(players.filter((p) => p.id !== playerId));
}

/**
 * Clear all players from session storage
 */
export function clearSessionPlayers(): void {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing session storage:', error);
  }
}
