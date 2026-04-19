export interface Player {
  id: string;
  name: string;
  swordland: number;
  triAlliance: number;
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
