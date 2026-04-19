'use client';

import { Player } from '@/types';
import styles from './PlayersTable.module.css';

interface PlayersTableProps {
  players: Player[];
  onEdit: (player: Player) => void;
  onDelete: (playerId: string) => void;
}

export default function PlayersTable({ players, onEdit, onDelete }: PlayersTableProps) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Player ID</th>
            <th>Name</th>
            <th>Swordland</th>
            <th>Tri Alliance</th>
            <th>Power</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.id}>
              <td>{player.id}</td>
              <td>{player.name}</td>
              <td>{player.swordland}</td>
              <td>{player.triAlliance}</td>
              <td>{Math.max(player.swordland, player.triAlliance)}</td>
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
                    title="Delete player"
                  >
                    ✕
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {players.length === 0 && (
        <div className={styles.empty}>
          <p>No players found. Add a new player to get started!</p>
        </div>
      )}
    </div>
  );
}
