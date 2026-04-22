'use server';

import { Player } from '@/types';
import { readPlayersData, writePlayersData, findPlayerById, updatePlayerObject } from './playersFileService';

export async function getPlayers(): Promise<Player[]> {
  try {
    return readPlayersData();
  } catch (error) {
    console.error('Failed to get players:', error);
    throw new Error('Failed to fetch players');
  }
}

export async function createPlayer(player: Player): Promise<Player> {
  try {
    const players = readPlayersData();
    players.push(player);
    writePlayersData(players);
    return player;
  } catch (error) {
    console.error('Failed to create player:', error);
    throw new Error('Failed to create player');
  }
}

export async function updatePlayer(id: string, player: Omit<Player, 'id'>): Promise<Player> {
  try {
    const players = readPlayersData();
    const playerIndex = findPlayerById(players, id);
    
    if (playerIndex === -1) {
      throw new Error('Player not found');
    }

    const updatedPlayer = updatePlayerObject(id, player, players[playerIndex]);
    players[playerIndex] = updatedPlayer;
    writePlayersData(players);
    
    return updatedPlayer;
  } catch (error) {
    console.error('Failed to update player:', error);
    throw error;
  }
}

export async function deactivatePlayer(id: string): Promise<void> {
  try {
    const players = readPlayersData();
    const playerIndex = findPlayerById(players, id);
    
    if (playerIndex === -1) {
      throw new Error('Player not found');
    }

    players[playerIndex].active = false;
    writePlayersData(players);
  } catch (error) {
    console.error('Failed to deactivate player:', error);
    throw error;
  }
}
