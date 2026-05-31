"use client";

import { useEffect, useState } from "react";
import LegionTable from "./LegionTable";
import BuildingPreview from "./BuildingPreview";
import { Player, PlayerAssignment } from "@/types";
import styles from "./SwordlandEventLayout.module.css";

type Legion = "legion1" | "legion2";

interface LegionAssignments {
  legion1: Player[];
  legion2: Player[];
  unassigned: Player[];
}

interface BuildingAssignment {
  leader: Player | null;
  support: Player[];
  manual: boolean;
}

interface LegionBuildingData {
  buildings: Record<string, BuildingAssignment>;
  substitutes: Player[];
}

interface PreviewState {
  legion1: LegionBuildingData;
  legion2: LegionBuildingData;
}

const BUILDINGS = [
  "Sanctum 1",
  "Sanctum 2",
  "Bell Tower",
  "Stables",
  "Abbey 1",
  "Abbey 2",
  "Abbey 3",
  "Abbey 4",
  "Undercellars",
];

const emptyBuildings = (): Record<string, BuildingAssignment> =>
  Object.fromEntries(
    BUILDINGS.map((b) => [b, { leader: null, support: [], manual: false }]),
  );

export default function SwordlandEventLayout({
  players,
  initialAssignments = [],
  onSave,
  isSaving,
}: {
  players: Player[];
  initialAssignments?: PlayerAssignment[];
  onSave: (a: PlayerAssignment[]) => Promise<void>;
  isSaving?: boolean;
}) {
  const [assignments, setAssignments] = useState<LegionAssignments>({
    legion1: [],
    legion2: [],
    unassigned: [],
  });

  const [legionSubstitutes, setLegionSubstitutes] = useState<{
    legion1: Player[];
    legion2: Player[];
  }>({
    legion1: [],
    legion2: [],
  });

  const [search, setSearch] = useState("");
  const [jsonOut, setJsonOut] = useState("");
  const [textOut, setTextOut] = useState("");

  const [preview, setPreview] = useState<PreviewState>({
    legion1: { buildings: emptyBuildings(), substitutes: [] },
    legion2: { buildings: emptyBuildings(), substitutes: [] },
  });

  // ---------------- INIT ----------------
  useEffect(() => {
    const next: LegionAssignments = {
      legion1: [],
      legion2: [],
      unassigned: [],
    };

    players.forEach((p) => {
      const found = initialAssignments.find((a) => a.playerId === p.id);

      if (!found) next.unassigned.push(p);
      else next[found.legion as keyof LegionAssignments].push(p);
    });

    setAssignments(next);
  }, [players, initialAssignments]);

  // ---------------- MOVE ----------------
  const movePlayer = (id: string, from: string, to: string) => {
    const player = players.find((p) => p.id === id);
    if (!player) return;

    setAssignments((prev) => {
      const copy = {
        legion1: [...prev.legion1],
        legion2: [...prev.legion2],
        unassigned: [...prev.unassigned],
      };

      const fromKey = from as keyof LegionAssignments;
      const toKey = to as keyof LegionAssignments;

      copy[fromKey] = copy[fromKey].filter((p) => p.id !== id);
      copy[toKey].push(player);

      return copy;
    });
  };

  // ---------------- SUBSTITUTE ASSIGN ----------------
  const handleLegionSubstituteAssign = (legion: Legion, player: Player) => {
    setLegionSubstitutes((prev) => {
      const exists = prev[legion].some((p) => p.id === player.id);

      if (exists) {
        return prev;
      }

      return {
        ...prev,
        [legion]: [...prev[legion], player],
      };
    });
  };

  // ---------------- FILTER ----------------
  const filter = (list: Player[]) =>
    list.filter((p) =>
      (p.name + (p.aliasName ?? ""))
        .toLowerCase()
        .includes(search.toLowerCase()),
    );

  // ---------------- BUILD LOGIC ----------------
  const generateBuildings = (
    list: Player[],
    substitutes: Player[],
  ): LegionBuildingData => {
    const substituteIds = new Set(substitutes.map((p) => p.id));

    const sorted = [...list]
      .filter((p) => !substituteIds.has(p.id))
      .sort((a, b) => b.swordlandPower - a.swordlandPower);

    const buildings: Record<string, BuildingAssignment> = emptyBuildings();

    if (!sorted.length) {
      return { buildings, substitutes: [] };
    }

    const under = sorted.slice(-2);
    const rest = sorted.slice(0, -2);

    const [u1, u2] = under.sort((a, b) => b.swordlandPower - a.swordlandPower);

    buildings["Undercellars"].leader = u1 ?? null;
    if (u2) buildings["Undercellars"].support.push(u2);

    const leaders = rest.slice(0, 8);
    const leaderIds = new Set(leaders.map((p) => p.id));

    BUILDINGS.slice(0, 8).forEach((b, i) => {
      buildings[b].leader = leaders[i] ?? null;
    });

    const supportPool = rest.filter((p) => !leaderIds.has(p.id));

    let i = 0;
    for (const p of supportPool) {
      const b = BUILDINGS[i % 8];
      buildings[b].support.push(p);
      i++;
    }

    return {
      buildings,
      substitutes,
    };
  };

  // ---------------- GENERATE ----------------
  const handleGenerate = () => {
    const l1 = generateBuildings(
      assignments.legion1,
      legionSubstitutes.legion1,
    );

    const l2 = generateBuildings(
      assignments.legion2,
      legionSubstitutes.legion2,
    );

    const json = { legion1: l1, legion2: l2 };

    setJsonOut(JSON.stringify(json, null, 2));

    const format = (title: string, data: LegionBuildingData) => {
      const buildingText = BUILDINGS.map((b) => {
        const x = data.buildings[b];

        if (b === "Undercellars") {
          const players = [
            ...(x.leader ? [x.leader.name] : []),
            ...x.support.map((p) => p.name),
          ];

          return `${b}\n${players.join(", ") || "None"}`;
        }

        return `${b}
Leader: ${x.leader?.name ?? "None"}
Support: ${x.support.map((p) => p.name).join(", ") || "None"}`;
      }).join("\n\n");

      const substitutesText =
        data.substitutes.length > 0
          ? `\n\nSubstitutes\n${data.substitutes.map((p) => p.name).join(", ")}`
          : "";

      return `${title}

${buildingText}${substitutesText}`;
    };

    setTextOut(`${format("Legion 1", l1)}\n\n${format("Legion 2", l2)}`);

    setPreview({ legion1: l1, legion2: l2 });
  };

  // ---------------- SAVE ----------------
  const handleSave = async () => {
    const payload: PlayerAssignment[] = [
      ...assignments.legion1.map((p) => ({
        playerId: p.id,
        legion: "legion1" as const,
        name: p.name,
        power: p.swordlandPower,
      })),
      ...assignments.legion2.map((p) => ({
        playerId: p.id,
        legion: "legion2" as const,
        name: p.name,
        power: p.swordlandPower,
      })),
    ];

    await onSave(payload);
  };

  // ---------------- RESET ----------------
  const reset = () =>
    setAssignments({
      legion1: [],
      legion2: [],
      unassigned: players,
    });

  // ---------------- JSON UPLOAD ----------------
  const uploadJson = (value: string) => {
    try {
      const parsed = JSON.parse(value);

      if (!parsed.legion1 || !parsed.legion2) return;

      const extract = (data: LegionBuildingData) => {
        const all: Player[] = [];

        Object.values(data.buildings).forEach((b) => {
          if (b.leader) all.push(b.leader);
          all.push(...b.support);
        });

        return all;
      };

      setAssignments({
        legion1: extract(parsed.legion1),
        legion2: extract(parsed.legion2),
        unassigned: [],
      });

      setPreview(parsed);
    } catch {
      alert("Invalid JSON");
    }
  };

  return (
    <div className={styles.container}>
      {/* SEARCH */}
      <div className={styles.searchWrapper}>
        <input
          className={styles.searchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
        />
        {search && (
          <button className={styles.clearButton} onClick={() => setSearch("")}>
            ✕
          </button>
        )}
      </div>

      {/* UNASSIGNED */}
      <h2 className={styles.playersHeader}>
        Unassigned ({assignments.unassigned.length})
      </h2>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <tbody>
            {filter(assignments.unassigned).map((p) => (
              <tr key={`u-${p.id}`}>
                <td>{p.name}</td>
                <td>{p.swordlandPower}</td>
                <td>
                  <select
                    className={styles.tableSelect}
                    onChange={(e) =>
                      movePlayer(p.id, "unassigned", e.target.value as any)
                    }
                    defaultValue=""
                  >
                    <option value="">Move</option>
                    <option value="legion1">Legion 1</option>
                    <option value="legion2">Legion 2</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* LEGIONS */}
      <div className={styles.legionsContainer}>
        <LegionTable
          title={`Legion 1 (${assignments.legion1.length})`}
          players={assignments.legion1}
          legion="legion1"
          BUILDINGS={BUILDINGS}
          filterPlayers={filter}
          handleManualBuildingAssign={() => {}}
          handleLegionSubstituteAssign={handleLegionSubstituteAssign}
          movePlayer={movePlayer}
        />

        <LegionTable
          title={`Legion 2 (${assignments.legion2.length})`}
          players={assignments.legion2}
          legion="legion2"
          BUILDINGS={BUILDINGS}
          filterPlayers={filter}
          handleManualBuildingAssign={() => {}}
          handleLegionSubstituteAssign={handleLegionSubstituteAssign}
          movePlayer={movePlayer}
        />
      </div>

      {/* ACTIONS */}
      <div className={styles.actions}>
        <button className={styles.generateButton} onClick={handleGenerate}>
          Generate
        </button>

        <button className={styles.saveButton} onClick={handleSave}>
          Save
        </button>

        <button className={styles.resetButton} onClick={reset}>
          Reset
        </button>
      </div>

      {/* OUTPUTS */}
      {textOut && (
        <div className={styles.textAreaWrapper}>
          <label htmlFor="textOutput" className={styles.label}>
            Generated String
          </label>
          <textarea
            id="textOutput"
            className={styles.textarea}
            value={textOut}
            readOnly
          />
        </div>
      )}

      {jsonOut && (
        <div className={styles.textAreaWrapper}>
          <label htmlFor="jsonOutput" className={styles.label}>
            Generated JSON
          </label>
          <textarea
            id="jsonOutput"
            className={styles.textarea}
            value={jsonOut}
            readOnly
          />
        </div>
      )}

      {/* UPLOAD */}
      <div className={styles.textAreaWrapper}>
        <label htmlFor="jsonUpload" className={styles.label}>
          Import JSON (Paste JSON to load assignments)
        </label>
        <textarea
          id="jsonUpload"
          className={styles.textarea}
          placeholder="Paste JSON here..."
          onChange={(e) => uploadJson(e.target.value)}
        />
      </div>

      {/* PREVIEW */}
      <div className={styles.previewContainer}>
        <BuildingPreview
          title="Legion 1"
          legion="legion1"
          legionData={preview.legion1}
          BUILDINGS={BUILDINGS}
          moveSubstitute={handleLegionSubstituteAssign}
        />

        <BuildingPreview
          title="Legion 2"
          legion="legion2"
          legionData={preview.legion2}
          BUILDINGS={BUILDINGS}
          moveSubstitute={handleLegionSubstituteAssign}
        />
      </div>
    </div>
  );
}
