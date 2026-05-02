'use client';

import { useState } from 'react';
import { Player } from '@/types';
import PlayerCard from './PlayerCard';
import styles from './PlayersCard.module.css';

interface PlayersCardProps {
  players: Player[];
  onEdit: (player: Player) => void;
  onDelete: (id: string) => void;
}

export default function PlayersCard({ players, onEdit, onDelete }: PlayersCardProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlayers = players.filter(
    (player) =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.aliasName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.searchWrapper}>
        <input
          type="text"
          placeholder="Search by player name or alias..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <button className={styles.clearButton} onClick={() => setSearchTerm('')} title="Clear search">
          ✕
        </button>
      </div>

      <div className={styles.grid}>
        {filteredPlayers.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {filteredPlayers.length === 0 && (
        <div className={styles.empty}>
          <p>{searchTerm ? 'No players match your search.' : 'No players found. Add a new player to get started!'}</p>
        </div>
      )}
    </div>
  );
}
