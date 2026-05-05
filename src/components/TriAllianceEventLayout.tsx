'use client';

import { useState, useEffect } from 'react';
import { Player, PlayerAssignment } from '@/types';
import styles from './TriAllianceEventLayout.module.css';

interface TriAllianceEventLayoutProps {
  players: Player[];
  initialAssignments?: PlayerAssignment[];
  onSave: (assignments: PlayerAssignment[]) => Promise<void>;
  isSaving?: boolean;
}

interface LegionAssignments {
  legion1: Player[];
  legion2: Player[];
  unassigned: Player[];
}

export default function TriAllianceEventLayout({
  players,
  initialAssignments = [],
  onSave,
  isSaving = false,
}: TriAllianceEventLayoutProps) {
  const [assignments, setAssignments] = useState<LegionAssignments>({
    legion1: [],
    legion2: [],
    unassigned: [],
  });

  const [generatedString, setGeneratedString] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load initial assignments or default to unassigned
    if (initialAssignments.length > 0) {
      const newAssignments: LegionAssignments = {
        legion1: [],
        legion2: [],
        unassigned: [],
      };

      players.forEach((player) => {
        const assignment = initialAssignments.find((a) => a.playerId === player.id);
        if (!assignment) {
          newAssignments.unassigned.push(player);
        } else if (assignment.legion === 'legion1') {
          newAssignments.legion1.push(player);
        } else if (assignment.legion === 'legion2') {
          newAssignments.legion2.push(player);
        }
      });
      setAssignments(newAssignments);
    } else {
      setAssignments((prev) => ({
        ...prev,
        unassigned: players,
      }));
    }
  }, [players, initialAssignments]);

  const movePlayer = (playerId: string, fromCategory: string, toCategory: string) => {
    const player = players.find((p) => p.id === playerId);
    if (!player) return;

    setAssignments((prev) => {
      const newAssignments = { ...prev };

      // Remove from source
      if (fromCategory === 'unassigned') {
        newAssignments.unassigned = newAssignments.unassigned.filter((p) => p.id !== playerId);
      } else if (fromCategory === 'legion1') {
        newAssignments.legion1 = newAssignments.legion1.filter((p) => p.id !== playerId);
      } else if (fromCategory === 'legion2') {
        newAssignments.legion2 = newAssignments.legion2.filter((p) => p.id !== playerId);
      }

      // Add to destination
      if (toCategory === 'unassigned') {
        newAssignments.unassigned.push(player);
      } else if (toCategory === 'legion1') {
        newAssignments.legion1.push(player);
      } else if (toCategory === 'legion2') {
        newAssignments.legion2.push(player);
      }

      return newAssignments;
    });
  };

  const filterPlayers = (playerList: Player[]) => {
    return playerList.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.aliasName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleGenerateString = () => {
    const legion1String = assignments.legion1
      .map((p) => `${p.name}:${p.trialliancePower}`)
      .join(' | ');

    const legion2String = assignments.legion2
      .map((p) => `${p.name}:${p.trialliancePower}`)
      .join(' | ');

    const fullString = `Tri Alliance - Legion 1: ${legion1String || 'None'}\nTri Alliance - Legion 2: ${legion2String || 'None'}`;
    setGeneratedString(fullString);
  };

  const handleSave = async () => {
    const allAssignments: PlayerAssignment[] = [];

    assignments.legion1.forEach((p) => {
      allAssignments.push({
        playerId: p.id,
        legion: 'legion1',
        name: p.name,
        power: p.trialliancePower,
      });
    });

    assignments.legion2.forEach((p) => {
      allAssignments.push({
        playerId: p.id,
        legion: 'legion2',
        name: p.name,
        power: p.trialliancePower,
      });
    });

    await onSave(allAssignments);
  };

  const PlayerSelectBox = ({
    title,
    players: playerList,
    category,
  }: {
    title: string;
    players: Player[];
    category: string;
  }) => (
    <div className={styles.column}>
      <h3 className={styles.columnTitle}>{title}</h3>
      <div className={styles.playerList}>
        {filterPlayers(playerList).map((player) => (
          <div key={player.id} className={styles.playerItem}>
            <span className={styles.playerName}>
              {player.name} <span className={styles.power}>({player.trialliancePower})</span>
            </span>
            <select
              value={category}
              onChange={(e) => movePlayer(player.id, category, e.target.value)}
              className={styles.select}
            >
              <option value="unassigned">Unassigned</option>
              <option value="legion1">Legion 1</option>
              <option value="legion2">Legion 2</option>
            </select>
          </div>
        ))}
        {filterPlayers(playerList).length === 0 && <p className={styles.empty}>No players</p>}
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.searchWrapper}>
        <input
          type="text"
          placeholder="Search by player name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <h2 className={styles.playersHeader}>Players</h2>

      {/* Players Assignment Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Power</th>
              <th>Assign</th>
            </tr>
          </thead>
          <tbody>
            {filterPlayers(assignments.unassigned).map((player) => (
              <tr key={player.id}>
                <td>{player.name}</td>
                <td>{player.trialliancePower}</td>
                <td>
                  <select
                    value="unassigned"
                    onChange={(e) => movePlayer(player.id, 'unassigned', e.target.value)}
                    className={styles.tableSelect}
                  >
                    <option value="unassigned">Unassigned</option>
                    <option value="legion1">Legion 1</option>
                    <option value="legion2">Legion 2</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className={styles.legionsHeader}>Legion Assignments</h2>

      {/* Two Column Layout */}
      <div className={styles.legionsContainer}>
        <PlayerSelectBox title="Legion 1" players={assignments.legion1} category="legion1" />
        <PlayerSelectBox title="Legion 2" players={assignments.legion2} category="legion2" />
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button onClick={handleGenerateString} className={styles.generateButton}>
          Generate String
        </button>
        <button onClick={handleSave} className={styles.saveButton} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Generated String TextArea */}
      {generatedString && (
        <div className={styles.textAreaWrapper}>
          <label htmlFor="generatedString" className={styles.label}>
            Generated String
          </label>
          <textarea
            id="generatedString"
            value={generatedString}
            readOnly
            className={styles.textarea}
          />
        </div>
      )}
    </div>
  );
}
