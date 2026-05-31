"use client";

import { Player } from "@/types";
import styles from "./BuildingPreview.module.css";

type Legion = "legion1" | "legion2";

export interface BuildingAssignment {
  leader: Player | null;
  support: Player[];
  manual: boolean;
}

export interface LegionBuildingData {
  buildings: Record<string, BuildingAssignment>;
  substitutes: Player[];
}

interface Props {
  title: string;
  legion: Legion;
  legionData: LegionBuildingData;
  BUILDINGS: string[];
  moveSubstitute: (legion: Legion, player: Player, value: string) => void;
}

export default function BuildingPreview({
  title,
  legion,
  legionData,
  BUILDINGS,
}: Props) {
  const safe = legionData ?? { buildings: {}, substitutes: [] };

  const getTotal = (b: BuildingAssignment) =>
    (b?.leader ? 1 : 0) + (b?.support?.length ?? 0);

  return (
    <div className={styles.previewSection}>
      <h2 className={styles.playersHeader}>{title}</h2>

      <div className={styles.buildingsGrid}>
        {BUILDINGS.map((name) => {
          const building: BuildingAssignment = safe.buildings?.[name] ?? {
            leader: null,
            support: [],
            manual: false,
          };

          return (
            <div key={`${legion}-${name}`} className={styles.buildingCard}>
              <div className={styles.buildingHeader}>
                <h3 className={styles.columnTitle}>
                  {name} ({getTotal(building)})
                </h3>
              </div>

              <div className={styles.buildingContent}>
                {name !== "Undercellars" && (
                  <div className={styles.leaderSection}>
                    <span className={styles.leaderLabel}>Leader</span>
                    {building.leader ? (
                      <div className={styles.playerItem}>
                        {building.leader.name} ({building.leader.swordlandPower}
                        )
                      </div>
                    ) : (
                      <p className={styles.empty}>None</p>
                    )}
                  </div>
                )}

                <div className={styles.supportSection}>
                  <span className={styles.leaderLabel}>
                    {name === "Undercellars" ? "Players" : "Support"}
                  </span>

                  {building.support?.length ? (
                    building.support.map((p) => (
                      <div
                        key={`${legion}-${name}-${p.id}`}
                        className={styles.playerItem}
                      >
                        {p.name} ({p.swordlandPower})
                      </div>
                    ))
                  ) : (
                    <p className={styles.empty}>None</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* SUBSTITUTES */}
        <div className={styles.buildingCard}>
          <div className={styles.buildingHeader}>
            <h3 className={styles.columnTitle}>
              Substitutes ({safe.substitutes?.length ?? 0})
            </h3>
          </div>

          <div className={styles.buildingContent}>
            {safe.substitutes?.length ? (
              safe.substitutes.map((p) => (
                <div
                  key={`${legion}-sub-${p.id}`}
                  className={styles.playerItem}
                >
                  {p.name} ({p.swordlandPower})
                </div>
              ))
            ) : (
              <p className={styles.empty}>None</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
