import { Player } from '@/types';

export async function getPlayers(): Promise<Player[]> {
  const response = await fetch('/api/players', {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch players');
  }
  return response.json();
}

export async function updatePlayer(id: string, player: Omit<Player, 'id'>): Promise<Player> {
  const response = await fetch(`/api/players/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(player),
  });
  if (!response.ok) {
    throw new Error('Failed to update player');
  }
  return response.json();
}

export async function deactivatePlayer(id: string): Promise<void> {
  const response = await fetch(`/api/players/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to deactivate player');
  }
}

export async function createPlayer(player: Player): Promise<Player> {
  const response = await fetch('/api/players', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(player),
  });
  if (!response.ok) {
    throw new Error('Failed to create player');
  }
  return response.json();
}
