'use client';

import { useState, useEffect } from 'react';
import { Player } from '@/types';
import Navigation from '@/components/Navigation';
import LegionManager from '@/components/LegionManager';
import playersData from '@/data/players.json';
import styles from './page.module.css';

export default function TriAlliancePage() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    setPlayers(playersData);
  }, []);

  const handleSave = async (legion1: Player[], legion2: Player[]) => {
    // Create the legion data structure
    const triAllianceLegion1 = {
      players: legion1.map((p) => ({
        id: p.id,
        name: p.name,
        power: p.triAlliance,
      })),
    };

    const triAllianceLegion2 = {
      players: legion2.map((p) => ({
        id: p.id,
        name: p.name,
        power: p.triAlliance,
      })),
    };

    // In a real app, this would save to the backend or download files
    console.log('Saving Tri Alliance Legion 1:', triAllianceLegion1);
    console.log('Saving Tri Alliance Legion 2:', triAllianceLegion2);

    // For now, we'll just alert the user
    alert(
      `Tri Alliance configuration saved!\nLegion 1: ${legion1.length} players\nLegion 2: ${legion2.length} players`
    );

    // In the future, you could trigger a file download:
    // downloadJSON(triAllianceLegion1, 'tri-alliance-legion1.json');
    // downloadJSON(triAllianceLegion2, 'tri-alliance-legion2.json');
  };

  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Tri Alliance Event Management</h1>
            <p className={styles.subtitle}>
              Organize players into alliances for Tri Alliance events
            </p>
          </div>

          <LegionManager
            players={players}
            powerKey="triAlliance"
            eventName="Tri Alliance"
            onSave={handleSave}
          />
        </div>
      </main>
    </>
  );
}
