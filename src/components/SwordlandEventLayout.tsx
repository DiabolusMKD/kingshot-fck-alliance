'use client';

import { useState, useEffect } from 'react';
import { Player, PlayerAssignment } from '@/types';
import styles from './SwordlandEventLayout.module.css';

interface SwordlandEventLayoutProps {
  players: Player[];
  initialAssignments?: PlayerAssignment[];
  onSave: (assignments: PlayerAssignment[]) => Promise<void>;
  isSaving?: boolean;
}

const BUILDINGS = [
  'Sanctum 1',
  'Sanctum 2',
  'Bell Tower',
  'Stables',
  'Abbey 1',
  'Abbey 2',
  'Abbey 3',
  'Abbey 4',
  'Undercellars',
];

interface LegionAssignments {
  legion1: Player[];
  buildings: { [key: string]: Player[] };
  legion2: Player[];
  unassigned: Player[];
}

export default function SwordlandEventLayout({
  players,
  initialAssignments = [],
  onSave,
  isSaving = false,
}: SwordlandEventLayoutProps) {
  const [assignments, setAssignments] = useState<LegionAssignments>({
    legion1: [],
    buildings: BUILDINGS.reduce((acc, building) => ({ ...acc, [building]: [] }), {}),
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
        buildings: BUILDINGS.reduce((acc, building) => ({ ...acc, [building]: [] }), {}),
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
        } else if (BUILDINGS.includes(assignment.legion)) {
          newAssignments.buildings[assignment.legion].push(player);
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
      } else if (BUILDINGS.includes(fromCategory)) {
        newAssignments.buildings[fromCategory] = newAssignments.buildings[fromCategory].filter(
          (p) => p.id !== playerId
        );
      }

      // Add to destination
      if (toCategory === 'unassigned') {
        newAssignments.unassigned.push(player);
      } else if (toCategory === 'legion1') {
        newAssignments.legion1.push(player);
      } else if (toCategory === 'legion2') {
        newAssignments.legion2.push(player);
      } else if (BUILDINGS.includes(toCategory)) {
        newAssignments.buildings[toCategory].push(player);
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
      .map((p) => `${p.name}:${p.swordlandPower}`)
      .join(' | ');

    const buildingStrings = BUILDINGS.map((building) => {
      const buildingPlayers = assignments.buildings[building]
        .map((p) => `${p.name}:${p.swordlandPower}`)
        .join(' | ');
      return `${building}: ${buildingPlayers || 'None'}`;
    }).join('\n');

    const legion2String = assignments.legion2
      .map((p) => `${p.name}:${p.swordlandPower}`)
      .join(' | ');

    const fullString = `Swordland - Legion 1: ${legion1String || 'None'}\n${buildingStrings}\nSwordland - Legion 2: ${legion2String || 'None'}`;
    setGeneratedString(fullString);
  };

  const handleSave = async () => {
    const allAssignments: PlayerAssignment[] = [];

    assignments.legion1.forEach((p) => {
      allAssignments.push({
        playerId: p.id,
        legion: 'legion1',
        name: p.name,
        power: p.swordlandPower,
      });
    });

    BUILDINGS.forEach((building) => {
      assignments.buildings[building].forEach((p) => {
        allAssignments.push({
          playerId: p.id,
          legion: building,
          name: p.name,
          power: p.swordlandPower,
        });
      });
    });

    assignments.legion2.forEach((p) => {
      allAssignments.push({
        playerId: p.id,
        legion: 'legion2',
        name: p.name,
        power: p.swordlandPower,
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
              {player.name} <span className={styles.power}>({player.swordlandPower})</span>
            </span>
            <select
              value={category}
              onChange={(e) => movePlayer(player.id, category, e.target.value)}
              className={styles.select}
            >
              <option value="unassigned">Unassigned</option>
              <option value="legion1">Legion 1</option>
              <option value="legion2">Legion 2</option>
              {BUILDINGS.map((building) => (
                <option key={building} value={building}>
                  {building}
                </option>
              ))}
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
                <td>{player.swordlandPower}</td>
                <td>
                  <select
                    value="unassigned"
                    onChange={(e) => movePlayer(player.id, 'unassigned', e.target.value)}
                    className={styles.tableSelect}
                  >
                    <option value="unassigned">Unassigned</option>
                    <option value="legion1">Legion 1</option>
                    <option value="legion2">Legion 2</option>
                    {BUILDINGS.map((building) => (
                      <option key={building} value={building}>
                        {building}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className={styles.legionsHeader}>Legion Assignments</h2>

      {/* Three Column Layout */}
      <div className={styles.legionsContainer}>
        <PlayerSelectBox title="Legion 1" players={assignments.legion1} category="legion1" />

        <div className={styles.buildingsColumn}>
          <h3 className={styles.columnTitle}>Buildings</h3>
          <div className={styles.buildingsList}>
            {BUILDINGS.map((building) => (
              <PlayerSelectBox
                key={building}
                title={building}
                players={assignments.buildings[building]}
                category={building}
              />
            ))}
          </div>
        </div>

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
