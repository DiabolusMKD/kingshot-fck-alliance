'use client';

import { useState, useEffect } from 'react';
import { Player } from '@/types';
import Navigation from '@/components/Navigation';
import LegionManager from '@/components/LegionManager';
import { getPlayers } from '@/utils/playerService';
import styles from './page.module.css';

export default function SwordlandPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      setIsLoading(true);
      const allPlayers = await getPlayers(1, 844); // Fetch players for FCK alliance and kingdom 1
      const sortedPlayers = allPlayers.sort((a, b) => b.swordlandPower - a.swordlandPower);
      setPlayers(sortedPlayers);
    } catch (error) {
      console.error('Failed to load players:', error);
      alert('Failed to load players');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (legion1: Player[], legion2: Player[]) => {
    // Create the legion data structure
    const swordlandLegion1 = {
      players: legion1.map((p) => ({
        id: p.id,
        name: p.name,
        power: p.swordlandPower,
      })),
    };

    const swordlandLegion2 = {
      players: legion2.map((p) => ({
        id: p.id,
        name: p.name,
        power: p.swordlandPower,
      })),
    };

    // In a real app, this would save to the backend or download files
    console.log('Saving Swordland Legion 1:', swordlandLegion1);
    console.log('Saving Swordland Legion 2:', swordlandLegion2);

    // For now, we'll just alert the user
    alert(
      `Swordland configuration saved!\nLegion 1: ${legion1.length} players\nLegion 2: ${legion2.length} players`
    );

    // In the future, you could trigger a file download:
    // downloadJSON(swordlandLegion1, 'swordland-legion1.json');
    // downloadJSON(swordlandLegion2, 'swordland-legion2.json');
  };

  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Swordland Event Management</h1>
            <p className={styles.subtitle}>
              Organize players into legions for Swordland events
            </p>
          </div>

          {isLoading ? (
            <p>Loading players...</p>
          ) : (
            <LegionManager
              players={players}
              powerKey="swordlandPower"
              eventName="Swordland"
              onSave={handleSave}
            />
          )}
        </div>
      </main>
    </>
  );
}
