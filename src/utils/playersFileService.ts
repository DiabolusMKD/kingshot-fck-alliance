import fs from 'fs';
import path from 'path';
import { Player } from '@/types';

export const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'players.json');

export function readPlayersData(): Player[] {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading players data:', error);
    return [];
  }
}

export function writePlayersData(data: Player[]): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing players data:', error);
    throw error;
  }
}

export function findPlayerById(players: Player[], id: string): number {
  return players.findIndex((p) => p.id === id);
}

export function createPlayerObject(body: any): Player {
  return {
    id: body.id,
    playerId: body.playerId,
    name: body.name,
    alias: body.alias,
    swordland: body.swordland,
    triAlliance: body.triAlliance,
    power: body.power,
    active: true,
  };
}

export function updatePlayerObject(
  id: string,
  body: any,
  currentPlayer: Player
): Player {
  return {
    id,
    playerId: body.playerId,
    name: body.name,
    alias: body.alias,
    swordland: body.swordland,
    triAlliance: body.triAlliance,
    power: body.power,
    active: body.active !== undefined ? body.active : currentPlayer.active,
  };
}
