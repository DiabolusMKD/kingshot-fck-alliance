export interface Player {
  id: string;
  name: string;
  alias: string;
  swordland: number;
  triAlliance: number;
  power: number;
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
