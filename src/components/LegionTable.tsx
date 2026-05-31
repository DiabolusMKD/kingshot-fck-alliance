"use client";

import { Player } from "@/types";
import styles from "./LegionTable.module.css";

type Legion = "legion1" | "legion2";

interface LegionTableProps {
  title: string;
  players: Player[];
  legion: Legion;
  BUILDINGS: string[];
  filterPlayers: (players: Player[]) => Player[];

  handleManualBuildingAssign: (
    legion: Legion,
    player: Player,
    building: string,
  ) => void;

  handleLegionSubstituteAssign: (legion: Legion, player: Player) => void;

  movePlayer: (
    playerId: string,
    fromCategory: string,
    toCategory: string,
  ) => void;
}

export default function LegionTable({
  title,
  players,
  legion,
  BUILDINGS,
  filterPlayers,
  handleManualBuildingAssign,
  handleLegionSubstituteAssign,
  movePlayer,
}: LegionTableProps) {
  const filtered = filterPlayers(players);

  return (
    <div className={styles.legionTable}>
      <h3 className={styles.columnTitle}>{title}</h3>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Player</th>
              <th>Power</th>
              <th>Building</th>
              <th>Substitute</th>
              <th>Move</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((player) => (
              <tr key={`${legion}-${player.id}`}>
                <td>{player.name}</td>
                <td>{player.swordlandPower}</td>

                <td>
                  <select
                    className={styles.tableSelect}
                    defaultValue=""
                    onChange={(e) => {
                      const value = e.target.value;
                      if (!value) return;

                      handleManualBuildingAssign(legion, player, value);
                      e.target.value = "";
                    }}
                  >
                    <option value="" disabled>
                      Select Building
                    </option>

                    {BUILDINGS.map((b) => (
                      <option key={`${legion}-${b}`} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </td>

                <td>
                  <button
                    type="button"
                    className={styles.generateButton}
                    onClick={() => handleLegionSubstituteAssign(legion, player)}
                  >
                    Add
                  </button>
                </td>

                <td>
                  <button
                    type="button"
                    className={styles.unassignButton}
                    onClick={() => movePlayer(player.id, legion, "unassigned")}
                  >
                    Unassign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
