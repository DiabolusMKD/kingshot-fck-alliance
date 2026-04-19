'use client';

import { useState, useEffect } from 'react';
import { Player, Legion } from '@/types';
import styles from './LegionManager.module.css';

interface LegionManagerProps {
  players: Player[];
  powerKey: 'swordland' | 'triAlliance';
  eventName: string;
  onSave: (legion1: Player[], legion2: Player[]) => void;
}

export default function LegionManager({
  players,
  powerKey,
  eventName,
  onSave,
}: LegionManagerProps) {
  const [legions, setLegions] = useState<Legion>({
    none: [],
    legion1: [],
    legion2: [],
  });

  const [generatedString, setGeneratedString] = useState('');

  useEffect(() => {
    setLegions({
      none: players,
      legion1: [],
      legion2: [],
    });
  }, [players]);

  const getPowerValue = (player: Player): number => {
    return powerKey === 'swordland' ? player.swordland : player.triAlliance;
  };

  const handlePlayerMove = (
    playerId: string,
    fromLegion: keyof Legion,
    toLegion: keyof Legion
  ) => {
    const player = legions[fromLegion].find((p) => p.id === playerId);
    if (!player) return;

    setLegions((prev) => ({
      ...prev,
      [fromLegion]: prev[fromLegion].filter((p) => p.id !== playerId),
      [toLegion]: [...prev[toLegion], player],
    }));
  };

  const handleGenerateString = () => {
    const legion1String = legions.legion1
      .map((p) => `${p.name}:${getPowerValue(p)}`)
      .join(' | ');
    const legion2String = legions.legion2
      .map((p) => `${p.name}:${getPowerValue(p)}`)
      .join(' | ');

    const fullString = `${eventName} - Legion 1: ${legion1String || 'None'}\n${eventName} - Legion 2: ${legion2String || 'None'}`;
    setGeneratedString(fullString);
  };

  const handleSave = () => {
    onSave(legions.legion1, legions.legion2);
  };

  return (
    <div className={styles.container}>
      <div className={styles.tablesWrapper}>
        {/* Main table - All Players */}
        <div className={styles.tableSection}>
          <h3 className={styles.tableTitle}>All Players</h3>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Power</th>
                  <th>Legion</th>
                </tr>
              </thead>
              <tbody>
                {legions.none.map((player) => (
                  <tr key={player.id}>
                    <td>{player.name}</td>
                    <td>{getPowerValue(player)}</td>
                    <td>
                      <select
                        value="none"
                        onChange={(e) =>
                          handlePlayerMove(player.id, 'none', e.target.value as keyof Legion)
                        }
                        className={styles.select}
                      >
                        <option value="none">None</option>
                        <option value="legion1">Legion 1</option>
                        <option value="legion2">Legion 2</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {legions.none.length === 0 && (
              <div className={styles.emptyMessage}>No unassigned players</div>
            )}
          </div>
        </div>

        {/* Side tables - Legions */}
        <div className={styles.legionsWrapper}>
          {/* Legion 1 */}
          <div className={styles.tableSection}>
            <h3 className={styles.tableTitle}>Legion 1</h3>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Power</th>
                    <th>Legion</th>
                  </tr>
                </thead>
                <tbody>
                  {legions.legion1.map((player) => (
                    <tr key={player.id}>
                      <td>{player.name}</td>
                      <td>{getPowerValue(player)}</td>
                      <td>
                        <select
                          value="legion1"
                          onChange={(e) =>
                            handlePlayerMove(player.id, 'legion1', e.target.value as keyof Legion)
                          }
                          className={styles.select}
                        >
                          <option value="none">None</option>
                          <option value="legion1">Legion 1</option>
                          <option value="legion2">Legion 2</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {legions.legion1.length === 0 && (
                <div className={styles.emptyMessage}>No players assigned</div>
              )}
            </div>
          </div>

          {/* Legion 2 */}
          <div className={styles.tableSection}>
            <h3 className={styles.tableTitle}>Legion 2</h3>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Power</th>
                    <th>Legion</th>
                  </tr>
                </thead>
                <tbody>
                  {legions.legion2.map((player) => (
                    <tr key={player.id}>
                      <td>{player.name}</td>
                      <td>{getPowerValue(player)}</td>
                      <td>
                        <select
                          value="legion2"
                          onChange={(e) =>
                            handlePlayerMove(player.id, 'legion2', e.target.value as keyof Legion)
                          }
                          className={styles.select}
                        >
                          <option value="none">None</option>
                          <option value="legion1">Legion 1</option>
                          <option value="legion2">Legion 2</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {legions.legion2.length === 0 && (
                <div className={styles.emptyMessage}>No players assigned</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button onClick={handleGenerateString} className={styles.generateButton}>
          Generate String
        </button>
        <button onClick={handleSave} className={styles.saveButton}>
          Save
        </button>
      </div>

      {/* Generated String TextArea */}
      <div className={styles.textAreaWrapper}>
        <label htmlFor="generatedString" className={styles.label}>
          Generated String
        </label>
        <textarea
          id="generatedString"
          value={generatedString}
          readOnly
          className={styles.textarea}
          placeholder="Generated string will appear here"
        />
      </div>
    </div>
  );
}
