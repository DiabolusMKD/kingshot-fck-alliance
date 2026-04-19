'use client';

import { useState, useEffect } from 'react';
import { Player } from '@/types';
import Navigation from '@/components/Navigation';
import LegionManager from '@/components/LegionManager';
import playersData from '@/data/players.json';
import styles from './page.module.css';

export default function SwordlandPage() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    setPlayers(playersData);
  }, []);

  const handleSave = async (legion1: Player[], legion2: Player[]) => {
    // Create the legion data structure
    const swordlandLegion1 = {
      players: legion1.map((p) => ({
        id: p.id,
        name: p.name,
        power: p.swordland,
      })),
    };

    const swordlandLegion2 = {
      players: legion2.map((p) => ({
        id: p.id,
        name: p.name,
        power: p.swordland,
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

          <LegionManager
            players={players}
            powerKey="swordland"
            eventName="Swordland"
            onSave={handleSave}
          />
        </div>
      </main>
    </>
  );
}
