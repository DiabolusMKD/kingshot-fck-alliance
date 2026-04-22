'use client';

import { useState, useEffect } from 'react';
import { Player } from '@/types';
import Navigation from '@/components/Navigation';
import PlayersTable from '@/components/PlayersTable';
import PlayerForm from '@/components/PlayerForm';
import Dialog from '@/components/Dialog';
import { getPlayers, createPlayer, updatePlayer, deactivatePlayer } from '@/utils/playerService';
import styles from './page.module.css';

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = () => {
    try {
      setIsLoading(true);
      const allPlayers = getPlayers();
      // Filter to only show active players
      const activePlayers = allPlayers.filter((p) => p.active);
      setPlayers(activePlayers);
    } catch (error) {
      console.error('Failed to load players:', error);
      alert('Failed to load players');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPlayer = () => {
    setSelectedPlayer(undefined);
    setIsDialogOpen(true);
  };

  const handleEditPlayer = (player: Player) => {
    setSelectedPlayer(player);
    setIsDialogOpen(true);
  };

  const handleDeletePlayer = (playerId: string) => {
    if (confirm('Are you sure you want to deactivate this player?')) {
      try {
        deactivatePlayer(playerId);
        setPlayers((prev) => prev.filter((p) => p.id !== playerId));
      } catch (error) {
        console.error('Failed to deactivate player:', error);
        alert('Failed to deactivate player');
      }
    }
  };

  const handleFormSubmit = (formData: Player | Omit<Player, 'id'>) => {
    try {
      if (selectedPlayer) {
        // Update existing player
        updatePlayer(selectedPlayer.id, formData as Omit<Player, 'id'>);
        setPlayers((prev) =>
          prev.map((p) =>
            p.id === selectedPlayer.id
              ? { ...(formData as Omit<Player, 'id'>), id: selectedPlayer.id, active: true }
              : p
          )
        );
      } else {
        // Add new player
        const id =players.length > 0 ? (parseInt(players[players.length - 1].id) + 1).toString() : '1';
        const formDataWithId = { ...formData, id } as Player;
        const newPlayer = createPlayer(formDataWithId);
        setPlayers((prev) => [...prev, newPlayer]);
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to save player:', error);
      alert('Failed to save player');
    }
  };

  const handleFormCancel = () => {
    setIsDialogOpen(false);
    setSelectedPlayer(undefined);
  };

  if (isLoading) {
    return (
      <>
        <Navigation />
        <main className={styles.main}>
          <div className={styles.container}>
            <p>Loading players...</p>
          </div>
        </main>
      </>
    );
  }

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
