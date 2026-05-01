export interface KingshotPlayerData {
  playerId: string;
  name: string;
  alias: string;
  swordland: number;
  triAlliance: number;
  power: number;
}

const KINGSHOT_API_URL = process.env.NEXT_PUBLIC_KINGSHOT_API_URL || 'https://kingshot.net/api';

/**
 * Fetch player data from Kingshot API
 */
export async function fetchPlayerFromKingshot(playerId: string): Promise<KingshotPlayerData> {
  try {
    const response = await fetch(`${KINGSHOT_API_URL}/player-info?playerId=${playerId}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Handle different possible API response formats
    if (data.error) {
      throw new Error(data.error);
    }

    // Assuming the API returns player data directly or in a data field
    const playerData = data.data || data;

    return {
      playerId: playerData.playerId || playerId,
      name: playerData.name || '',
      alias: playerData.alias || '',
      swordland: playerData.swordland || 0,
      triAlliance: playerData.triAlliance || 0,
      power: playerData.power || 0,
    };
  } catch (error) {
    console.error(`Failed to fetch player ${playerId}:`, error);
    throw error;
  }
}
