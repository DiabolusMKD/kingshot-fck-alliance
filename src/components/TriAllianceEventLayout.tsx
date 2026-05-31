"use client";

import { useState, useEffect } from "react";
import { Player, PlayerAssignment } from "@/types";
import styles from "./TriAllianceEventLayout.module.css";

interface TriAllianceEventLayoutProps {
  players: Player[];
  initialAssignments?: PlayerAssignment[];
  onSave: (assignments: PlayerAssignment[]) => Promise<void>;
  isSaving?: boolean;
}

interface LegionAssignments {
  legion1: Player[];
  legion2: Player[];
  substituteLegion1: Player[];
  substituteLegion2: Player[];
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
    substituteLegion1: [],
    substituteLegion2: [],
    unassigned: [],
  });

  const [generatedString, setGeneratedString] = useState("");
  const [generatedJson, setGeneratedJson] = useState("");
  const [jsonInput, setJsonInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Load initial assignments or default to unassigned
    if (initialAssignments.length > 0) {
      const newAssignments: LegionAssignments = {
        legion1: [],
        legion2: [],
        substituteLegion1: [],
        substituteLegion2: [],
        unassigned: [],
      };

      players.forEach((player) => {
        const assignment = initialAssignments.find(
          (a) => a.playerId === player.id,
        );
        if (!assignment) {
          newAssignments.unassigned.push(player);
        } else if (assignment.legion === "legion1") {
          newAssignments.legion1.push(player);
        } else if (assignment.legion === "legion2") {
          newAssignments.legion2.push(player);
        } else if (assignment.legion === "substituteLegion1") {
          newAssignments.substituteLegion1.push(player);
        } else if (assignment.legion === "substituteLegion2") {
          newAssignments.substituteLegion2.push(player);
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

  const movePlayer = (
    playerId: string,
    fromCategory: string,
    toCategory: string,
  ) => {
    const player = players.find((p) => p.id === playerId);
    if (!player) return;

    setAssignments((prev) => {
      const newAssignments = { ...prev };

      // Remove from source
      Object.keys(newAssignments).forEach((key) => {
        newAssignments[key as keyof LegionAssignments] = newAssignments[
          key as keyof LegionAssignments
        ].filter((p) => p.id !== playerId);
      });

      // Add to destination
      if (toCategory !== "unassigned") {
        newAssignments[toCategory as keyof LegionAssignments].push(player);
      } else {
        newAssignments.unassigned.push(player);
      }

      return newAssignments;
    });
  };

  const filterPlayers = (playerList: Player[]) => {
    return playerList.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.aliasName.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  };

  const handleGenerateString = () => {
    const splitLegion = (players: Player[]) => {
      // Sort strongest -> weakest
      const sortedPlayers = [...players].sort(
        (a, b) => Number(b.power) - Number(a.power),
      );

      const leftSide: Player[] = [];
      const rightSide: Player[] = [];

      // Alternate players between left/right
      sortedPlayers.forEach((player, index) => {
        if (index % 2 === 0) {
          leftSide.push(player);
        } else {
          rightSide.push(player);
        }
      });

      // Split side into offense/support
      const splitSide = (sidePlayers: Player[]) => {
        const offenseCount = Math.floor(sidePlayers.length / 2);
        // support automatically gets extra if odd

        return {
          offense: sidePlayers.slice(0, offenseCount),
          support: sidePlayers.slice(offenseCount),
        };
      };

      const left = splitSide(leftSide);
      const right = splitSide(rightSide);

      return {
        leftOffense: left.offense,
        leftSupport: left.support,
        rightOffense: right.offense,
        rightSupport: right.support,
      };
    };

    const formatPlayers = (players: Player[]) =>
      players.map((p) => p.name).join(", ") || "None";

    const legion1 = splitLegion(assignments.legion1);
    const legion2 = splitLegion(assignments.legion2);

    const fullString = `Legion 1 assignments:
LEFT OFFENSE: ${formatPlayers(legion1.leftOffense)}
RIGHT OFFENSE: ${formatPlayers(legion1.rightOffense)}
LEFT SUPPORT: ${formatPlayers(legion1.leftSupport)}
RIGHT SUPPORT: ${formatPlayers(legion1.rightSupport)}
Substitutes: ${formatPlayers(assignments.substituteLegion1)}

Legion 2 assignments:
LEFT OFFENSE: ${formatPlayers(legion2.leftOffense)}
RIGHT OFFENSE: ${formatPlayers(legion2.rightOffense)}
LEFT SUPPORT: ${formatPlayers(legion2.leftSupport)}
RIGHT SUPPORT: ${formatPlayers(legion2.rightSupport)}
Substitutes: ${formatPlayers(assignments.substituteLegion2)}`;

    setGeneratedString(fullString);

    // Generate JSON
    const jsonData = {
      legion1: {
        leftOffense: assignments.legion1.slice(0, Math.floor(assignments.legion1.length / 2)).map((p) => ({ id: p.id, name: p.name, power: p.power })),
        rightOffense: assignments.legion1.slice(Math.floor(assignments.legion1.length / 2), Math.floor(assignments.legion1.length / 2) * 2).map((p) => ({ id: p.id, name: p.name, power: p.power })),
        substitutes: assignments.substituteLegion1.map((p) => ({ id: p.id, name: p.name, power: p.power })),
      },
      legion2: {
        leftOffense: assignments.legion2.slice(0, Math.floor(assignments.legion2.length / 2)).map((p) => ({ id: p.id, name: p.name, power: p.power })),
        rightOffense: assignments.legion2.slice(Math.floor(assignments.legion2.length / 2), Math.floor(assignments.legion2.length / 2) * 2).map((p) => ({ id: p.id, name: p.name, power: p.power })),
        substitutes: assignments.substituteLegion2.map((p) => ({ id: p.id, name: p.name, power: p.power })),
      },
    };

    setGeneratedJson(JSON.stringify(jsonData, null, 2));
  };

  const handleReset = () => {
    setAssignments({
      legion1: [],
      legion2: [],
      substituteLegion1: [],
      substituteLegion2: [],
      unassigned: players,
    });

    setGeneratedString("");
    setGeneratedJson("");
    setJsonInput("");
    setSearchTerm("");
  };

  const handleJsonImport = () => {
    try {
      const parsed = JSON.parse(jsonInput);

      // Validate JSON structure
      if (!parsed.legion1 || !parsed.legion2) {
        alert("Invalid JSON format. Expected legion1 and legion2 fields.");
        return;
      }

      // Extract player IDs from the JSON and find matching players
      const extractPlayers = (legionData: any): string[] => {
        const playerIds: string[] = [];

        if (legionData.leftOffense) {
          playerIds.push(...legionData.leftOffense.map((p: any) => p.id));
        }
        if (legionData.rightOffense) {
          playerIds.push(...legionData.rightOffense.map((p: any) => p.id));
        }
        if (legionData.substitutes) {
          playerIds.push(...legionData.substitutes.map((p: any) => p.id));
        }

        return playerIds;
      };

      const legion1Ids = extractPlayers(parsed.legion1);
      const legion2Ids = extractPlayers(parsed.legion2);
      const allImportedIds = new Set([...legion1Ids, ...legion2Ids]);

      const newAssignments: LegionAssignments = {
        legion1: [],
        legion2: [],
        substituteLegion1: [],
        substituteLegion2: [],
        unassigned: [],
      };

      // Assign players based on imported data
      players.forEach((player) => {
        if (legion1Ids.includes(player.id)) {
          newAssignments.legion1.push(player);
        } else if (legion2Ids.includes(player.id)) {
          newAssignments.legion2.push(player);
        } else {
          newAssignments.unassigned.push(player);
        }
      });

      // Handle substitutes if present in the JSON
      if (parsed.legion1.substitutes && Array.isArray(parsed.legion1.substitutes)) {
        const substituteIds = parsed.legion1.substitutes.map((p: any) => p.id);
        newAssignments.substituteLegion1 = newAssignments.legion1.filter((p) =>
          substituteIds.includes(p.id),
        );
        newAssignments.legion1 = newAssignments.legion1.filter(
          (p) => !substituteIds.includes(p.id),
        );
      }

      if (parsed.legion2.substitutes && Array.isArray(parsed.legion2.substitutes)) {
        const substituteIds = parsed.legion2.substitutes.map((p: any) => p.id);
        newAssignments.substituteLegion2 = newAssignments.legion2.filter((p) =>
          substituteIds.includes(p.id),
        );
        newAssignments.legion2 = newAssignments.legion2.filter(
          (p) => !substituteIds.includes(p.id),
        );
      }

      setAssignments(newAssignments);
      setJsonInput("");
      alert("JSON imported successfully!");
    } catch (error) {
      alert("Invalid JSON format. Please check and try again.");
      console.error("JSON import error:", error);
    }
  };

  const handleSave = async () => {
    const allAssignments: PlayerAssignment[] = [];

    assignments.legion1.forEach((p) => {
      allAssignments.push({
        playerId: p.id,
        legion: "legion1",
        name: p.name,
        triAlliancePower: p.trialliancePower,
        power: p.power,
      });
    });

    assignments.legion2.forEach((p) => {
      allAssignments.push({
        playerId: p.id,
        legion: "legion2",
        name: p.name,
        triAlliancePower: p.trialliancePower,
        power: p.power,
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
              {player.name}{" "}
              <span className={styles.power}>({player.power})</span>
            </span>
            <select
              value={category}
              onChange={(e) => movePlayer(player.id, category, e.target.value)}
              className={styles.select}
            >
              <option value="unassigned">Unassigned</option>
              <option value="legion1">Legion 1</option>
              <option value="substituteLegion1">Substitute Legion 1</option>
              <option value="substituteLegion2">Substitute Legion 2</option>
            </select>
          </div>
        ))}
        {filterPlayers(playerList).length === 0 && (
          <p className={styles.empty}>No players</p>
        )}
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
              <th>Tri Alliance Power</th>
              <th>Power</th>
              <th>Assign</th>
            </tr>
          </thead>
          <tbody>
            {filterPlayers(assignments.unassigned).map((player) => (
              <tr key={player.id}>
                <td>{player.name}</td>
                <td>{player.trialliancePower}</td>
                <td>{player.power}</td>
                <td>
                  <select
                    value="unassigned"
                    onChange={(e) =>
                      movePlayer(player.id, "unassigned", e.target.value)
                    }
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
        <PlayerSelectBox
          title="Legion 1"
          players={assignments.legion1}
          category="legion1"
        />

        <PlayerSelectBox
          title="Substitute Legion 1"
          players={assignments.substituteLegion1}
          category="substituteLegion1"
        />

        <PlayerSelectBox
          title="Legion 2"
          players={assignments.legion2}
          category="legion2"
        />

        <PlayerSelectBox
          title="Substitute Legion 2"
          players={assignments.substituteLegion2}
          category="substituteLegion2"
        />
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button
          onClick={handleGenerateString}
          className={styles.generateButton}
        >
          Generate String
        </button>

        <button
          onClick={handleReset}
          className={styles.resetButton}
          type="button"
        >
          Reset
        </button>

        <button
          onClick={handleSave}
          className={styles.saveButton}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save"}
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

      {/* Generated JSON TextArea */}
      {generatedJson && (
        <div className={styles.textAreaWrapper}>
          <label htmlFor="generatedJson" className={styles.label}>
            Generated JSON
          </label>
          <textarea
            id="generatedJson"
            value={generatedJson}
            readOnly
            className={styles.textarea}
          />
        </div>
      )}

      {/* JSON Import Section */}
      <div className={styles.textAreaWrapper}>
        <label htmlFor="jsonInput" className={styles.label}>
          Import JSON (Paste JSON to load assignments)
        </label>
        <textarea
          id="jsonInput"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          className={styles.textarea}
          placeholder="Paste JSON here..."
        />
        <button
          onClick={handleJsonImport}
          className={styles.generateButton}
          disabled={!jsonInput.trim()}
        >
          Load JSON
        </button>
      </div>
    </div>
  );
}
