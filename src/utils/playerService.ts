import { Player } from '@/types';
import playersData from '@/data/players.json';

const STORAGE_KEY = 'players_data';

// Initialize localStorage with default data if not already present
function initializeStorage() {
  if (typeof window === 'undefined') return;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(playersData));
  }
}

// Get all stored players from localStorage
function getStoredPlayers(): Player[] {
  if (typeof window === 'undefined') return playersData;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : playersData;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return playersData;
  }
}

// Save players to localStorage
function savePlayers(players: Player[]) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

export function getPlayers(): Player[] {
  initializeStorage();
  return getStoredPlayers();
}

export function createPlayer(player: Player): Player {
  initializeStorage();
  const players = getStoredPlayers();
  players.push(player);
  savePlayers(players);
  return player;
}

export function updatePlayer(id: string, player: Omit<Player, 'id'>): Player {
  initializeStorage();
  const players = getStoredPlayers();
  const playerIndex = players.findIndex((p) => p.id === id);
  
  if (playerIndex === -1) {
    throw new Error('Player not found');
  }

  const updatedPlayer: Player = {
    id,
    ...player,
    active: player.active !== undefined ? player.active : players[playerIndex].active,
  };

  players[playerIndex] = updatedPlayer;
  savePlayers(players);
  
  return updatedPlayer;
}

export function deactivatePlayer(id: string): void {
  initializeStorage();
  const players = getStoredPlayers();
  const playerIndex = players.findIndex((p) => p.id === id);
  
  if (playerIndex === -1) {
    throw new Error('Player not found');
  }

  players[playerIndex].active = false;
  savePlayers(players);
}
