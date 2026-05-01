export interface Player {
  id: string; // UUID from Supabase
  playerId: string;
  name: string;
  alias: string;
  swordland: number;
  triAlliance: number;
  power: number;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Legion {
  none: Player[];
  legion1: Player[];
  legion2: Player[];
}

export interface AllianceLegion {
  none: Player[];
  legion1: Player[];
  legion2: Player[];
}
