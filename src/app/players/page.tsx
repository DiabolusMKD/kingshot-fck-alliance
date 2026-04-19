'use client';

import { useState, useEffect } from 'react';
import { Player } from '@/types';
import Navigation from '@/components/Navigation';
import PlayersTable from '@/components/PlayersTable';
import PlayerForm from '@/components/PlayerForm';
import Dialog from '@/components/Dialog';
import playersData from '@/data/players.json';
import styles from './page.module.css';

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | undefined>();

  useEffect(() => {
    setPlayers(playersData);
  }, []);

  const handleAddPlayer = () => {
    setSelectedPlayer(undefined);
    setIsDialogOpen(true);
  };

  const handleEditPlayer = (player: Player) => {
    setSelectedPlayer(player);
    setIsDialogOpen(true);
  };

  const handleDeletePlayer = (playerId: string) => {
    if (confirm('Are you sure you want to delete this player?')) {
      setPlayers((prev) => prev.filter((p) => p.id !== playerId));
    }
  };

  const handleFormSubmit = (formData: Player | Omit<Player, 'id'>) => {
    if (selectedPlayer) {
      // Update existing player
      setPlayers((prev) =>
        prev.map((p) => (p.id === selectedPlayer.id ? (formData as Player) : p))
      );
    } else {
      // Add new player
      const newPlayer: Player = {
        ...(formData as Omit<Player, 'id'>),
        id: (formData as any).id,
      };
      setPlayers((prev) => [...prev, newPlayer]);
    }
    setIsDialogOpen(false);
  };

  const handleFormCancel = () => {
    setIsDialogOpen(false);
    setSelectedPlayer(undefined);
  };

  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Players Management</h1>
            <button onClick={handleAddPlayer} className={styles.addButton}>
              + Add Player
            </button>
          </div>

          <PlayersTable
            players={players}
            onEdit={handleEditPlayer}
            onDelete={handleDeletePlayer}
          />
        </div>
      </main>

      <Dialog
        isOpen={isDialogOpen}
        title={selectedPlayer ? 'Edit Player' : 'Add New Player'}
        onClose={handleFormCancel}
      >
        <PlayerForm
          player={selectedPlayer}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      </Dialog>
    </>
  );
}
