'use client';

import { useState, useEffect } from 'react';
import { Player } from '@/types';
import Navigation from '@/components/Navigation';
import PlayersTable from '@/components/PlayersTable';
import PlayersCard from '@/components/PlayersCard';
import PlayerForm from '@/components/PlayerForm';
import Dialog from '@/components/Dialog';
import { getPlayers, createPlayer, updatePlayer, removePlayerFromAlliance } from '@/utils/playerService';
import { fetchPlayerFromKingshot } from '@/utils/kingshotApi';
import { getSessionPlayers, setSessionPlayers, upsertSessionPlayer, removeSessionPlayer } from '@/utils/sessionStorageService';
import styles from './page.module.css';

const allianceId = 1; // FCK alliance ID
const kingdomId = 844; // Kingdom ID to filter players by

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      setIsLoading(true);
      const allPlayers = await getPlayers(allianceId, kingdomId); // Fetch players for FCK alliance and specified kingdom
      // Filter to only show active players and sort by power descending
      const activePlayers = allPlayers.sort((a, b) => b.power - a.power);
      setPlayers(activePlayers);
      // Sync with session storage
      setSessionPlayers(activePlayers);
    } catch (error) {
      console.error('Failed to load players:', error);
      // Try to use session storage as fallback
      const sessionPlayers = getSessionPlayers();
      if (sessionPlayers.length > 0) {
        setPlayers(sessionPlayers);
      } else {
        alert('Failed to load players. Please ensure Supabase credentials are set in .env.local');
      }
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

  const handleDeletePlayer = async (playerId: string) => {
    if (confirm('Are you sure you want to remove this player from the alliance?')) {
      try {
        await removePlayerFromAlliance(playerId);
        setPlayers((prev) => prev.filter((p) => p.id !== playerId));
        removeSessionPlayer(playerId);
      } catch (error) {
        console.error('Failed to remove player from alliance:', error);
        alert('Failed to remove player from alliance');
      }
    }
  };

  const handleFormSubmit = async (formData: Omit<Player, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsLoading(true);

      if (selectedPlayer) {
        // Update existing player
        const updatedPlayer = await updatePlayer(selectedPlayer.id, formData);
        setPlayers((prev) =>
          prev.map((p) =>
            p.id === selectedPlayer.id ? updatedPlayer : p
          )
        );
        upsertSessionPlayer(updatedPlayer);
      } else {
        // Add new player - fetch from API first if we only have playerId
        let playerData = formData;
        playerData.allianceId = `${allianceId}`; // Ensure allianceId is set for new players

        if (!formData.name) {
          try {
            const kingshotData = await fetchPlayerFromKingshot(formData.playerId);
            playerData = {
              ...formData,
              ...kingshotData,
            };
          } catch (err) {
            console.error('Failed to fetch player from API:', err);
            alert('Failed to fetch player data from API. Please try again.');
            return;
          }
        }

        const newPlayer = await createPlayer(playerData);
        setPlayers((prev) => [...prev, newPlayer].sort((a, b) => b.power - a.power));
        upsertSessionPlayer(newPlayer);
      }

      setIsDialogOpen(false);
      setSelectedPlayer(undefined);
    } catch (error) {
      console.error('Failed to save player:', error);
      alert(error instanceof Error ? error.message : 'Failed to save player');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormCancel = () => {
    setIsDialogOpen(false);
    setSelectedPlayer(undefined);
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Player ID', 'Name', 'Alias', 'Swordland', 'Tri Alliance', 'Power'],
      ...players.map((p) => [
        p.playerId,
        p.name,
        p.aliasName,
        p.swordlandPower,
        p.trialliancePower,
        p.power
      ])
    ];
    const csvString = csvContent.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'players.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <div className={styles.headerActions}>
              <div className={styles.viewSwitcher}>
                <button
                  className={`${styles.viewButton} ${viewMode === 'table' ? styles.active : ''}`}
                  onClick={() => setViewMode('table')}
                  title="Table view"
                >
                  ⊞ Table
                </button>
                <button
                  className={`${styles.viewButton} ${viewMode === 'card' ? styles.active : ''}`}
                  onClick={() => setViewMode('card')}
                  title="Card view"
                >
                  ≣ Card
                </button>
              </div>
              <button onClick={handleAddPlayer} className={styles.addButton}>
                + Add Player
              </button>
            </div>
          </div>

          {viewMode === 'table' ? (
            <PlayersTable
              players={players}
              onEdit={handleEditPlayer}
              onDelete={handleDeletePlayer}
            />
          ) : (
            <PlayersCard
              players={players}
              onEdit={handleEditPlayer}
              onDelete={handleDeletePlayer}
            />
          )}

          <button className={styles.exportButton} onClick={exportToCSV}>
            Export to CSV
          </button>
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
