import { Player } from '@/types';
import playersData from '@/data/players.json';

export async function getPlayers(): Promise<Player[]> {
  return playersData;
}

export async function updatePlayer(id: string, player: Omit<Player, 'id'>): Promise<void> {
  // For now, this is a mock function as we're working with static JSON
  // In a real app, this would update the database
  console.log('Updating player:', id, player);
}

export async function deletePlayer(id: string): Promise<void> {
  // Mock function for demo
  console.log('Deleting player:', id);
}

export async function createPlayer(player: Omit<Player, 'id'>): Promise<Player> {
  // Mock function - generate a simple ID
  const newId = `P${String(Math.random()).slice(2, 6)}`;
  return { ...player, id: newId };
}
