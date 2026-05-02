export interface Player {
  id: string; // UUID from Supabase
  playerId: string;
  name: string;
  aliasName: string;
  swordlandPower: number;
  trialliancePower: number;
  power: number;
  allianceId?: string | null; // Set to NULL when removing from alliance
  level?: number;
  levelRendered?: string;
  levelRenderedDetailed?: string;
  levelImage?: string;
  profilePhoto?: string;
  marchSize?: number;
  numberOfMarches?: number;
  kingdomId: number;
  created_at?: string;
  updated_at?: string;
}

export interface Legion {
  none: Player[];
  legion1: Player[];
  legion2: Player[];
  substituteLegion1: Player[];
  substituteLegion2: Player[];
}

export interface AllianceLegion {
  none: Player[];
  legion1: Player[];
  legion2: Player[];
}
