'use client';

import { useState } from 'react';
import { Player } from '@/types';
import styles from './PlayersTable.module.css';
import { formatNumbers } from '@/utils/formatNumbers';

interface PlayersTableProps {
  players: Player[];
  onEdit: (player: Player) => void;
  onDelete: (id: string) => void;
}

export default function PlayersTable({ players, onEdit, onDelete }: PlayersTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlayers = players.filter(
    (player) =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.alias.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => b.power - a.power); // Sort by power descending

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
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>No.</th>
              <th>Player ID</th>
              <th>Name</th>
              <th>Alias</th>
              <th>Swordland</th>
              <th>Tri Alliance</th>
              <th>Power</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlayers.map((player) => (
              <tr key={player.id}>
                <td>{filteredPlayers.indexOf(player) + 1}</td>
                <td>{player.playerId}</td>
                <td>{player.name}</td>
                <td>{player.alias}</td>
                <td>{formatNumbers(player.swordland)}</td>
                <td>{formatNumbers(player.triAlliance)}</td>
                <td>{formatNumbers(player.power)}</td>
                <td>
                  <div className={styles.actions}>
                    <button
                      onClick={() => onEdit(player)}
                      className={styles.editButton}
                      title="Edit player"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => onDelete(player.id)}
                      className={styles.deleteButton}
                      title="Deactivate player"
                    >
                      ✕
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredPlayers.length === 0 && (
          <div className={styles.empty}>
            <p>{searchTerm ? 'No players match your search.' : 'No players found. Add a new player to get started!'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
