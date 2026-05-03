'use client';

import { useState, useEffect } from 'react';
import { Player } from '@/types';
import { fetchPlayerFromKingshot } from '@/utils/kingshotApi';
import styles from './PlayerForm.module.css';

interface PlayerFormProps {
  player?: Player;
  onSubmit: (player: Omit<Player, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

const EMPTY_FORM_DATA = {
  playerId: '',
  name: '',
  aliasName: '',
  swordlandPower: 0,
  trialliancePower: 0,
  power: 0,
  profilePhoto: '',
  allianceId: '',
  kingdomId: 0,
};

type FormData = {
  playerId: string;
  name: string;
  aliasName: string;
  swordlandPower: number;
  trialliancePower: number;
  power: number;
  profilePhoto: string;
  allianceId: string | null;
  kingdomId: number;
};

export default function PlayerForm({ player, onSubmit, onCancel }: PlayerFormProps) {
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM_DATA as FormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchedFromAPI, setFetchedFromAPI] = useState(false);
  const isEditMode = !!player;

  useEffect(() => {
    if (player) {
      // Edit mode: populate with existing player data
      const { id, created_at, updated_at, ...playerDataWithoutId } = player;
      setFormData((prev) => ({
        ...prev,
        ...playerDataWithoutId,
        playerId: playerDataWithoutId.playerId || '',
        name: playerDataWithoutId.name || '',
        aliasName: playerDataWithoutId.aliasName || '',
        swordlandPower: playerDataWithoutId.swordlandPower ?? 0,
        trialliancePower: playerDataWithoutId.trialliancePower ?? 0,
        power: playerDataWithoutId.power ?? 0,
        profilePhoto: playerDataWithoutId.profilePhoto || '',
        allianceId: playerDataWithoutId.allianceId || '',
        kingdomId: playerDataWithoutId.kingdomId ?? 0,
      }));
      setFetchedFromAPI(false);
      setError(null);
    } else {
      setFormData(EMPTY_FORM_DATA as FormData);
      setFetchedFromAPI(false);
      setError(null);
    }
  }, [player]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericFields = ['swordlandPower', 'trialliancePower', 'power', 'kingdomId'];

    setFormData((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) && value ? Number(value) : value,
    }));
    setError(null);
  };

  const handleRefetch = async () => {
    if (!formData.playerId) {
      setError('Please enter a Player ID');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const playerData = await fetchPlayerFromKingshot(formData.playerId);
      setFormData((prev) => {
        if (!playerData) {
          return prev;
        }

        if (playerData.kingdom) {
          prev.kingdomId = playerData.kingdom;
          delete (playerData as any).kingdom;
        }

        const merged: any = { ...prev, ...playerData };

        // Prevent overwriting existing numeric stats with missing/zero values from API
        const stats: Array<keyof FormData> = ['power', 'swordlandPower', 'trialliancePower'];
        stats.forEach((k) => {
          const val = (playerData as any)[k];
          if (val === undefined || val === null || val === 0) {
            merged[k] = prev[k];
          } else {
            merged[k] = val;
          }
        });

        // profilePhoto: use API value if present, otherwise keep previous
        if (!playerData.profilePhoto) merged.profilePhoto = prev.profilePhoto;

        // preserve allianceId and prefer existing kingdomId if set
        merged.allianceId = prev.allianceId;
        merged.kingdomId = prev.kingdomId || 0;

        return merged as FormData;
      });
      setFetchedFromAPI(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch player data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.playerId) {
      setError('Please enter a Player ID');
      return;
    }

    if (!isEditMode) {
      if (!formData.name) {
        await handleRefetch();
        return;
      }
    }

    onSubmit(formData);
  };

  if (isEditMode) {
    return (
      <form className={styles.form} onSubmit={handleSubmit}>
        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.formGroup}>
          <label htmlFor="playerId" className={styles.label}>
            In-Game Player ID
          </label>
          <div className={styles.inputWithButton}>
            <input
              type="text"
              id="playerId"
              name="playerId"
              value={formData.playerId}
              onChange={handleChange}
              className={styles.input}
              placeholder="e.g. 123123123"
            />
            <button
              type="button"
              onClick={handleRefetch}
              disabled={isLoading || !formData.playerId}
              className={styles.refetchButton}
            >
              {isLoading ? 'Fetching...' : 'Refetch'}
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={styles.input}
            placeholder="Player name"
            readOnly={fetchedFromAPI}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="aliasName" className={styles.label}>
            Alias
          </label>
          <input
            type="text"
            id="aliasName"
            name="aliasName"
            value={formData.aliasName}
            onChange={handleChange}
            className={styles.input}
            placeholder="Player alias"
            readOnly={fetchedFromAPI}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="power" className={styles.label}>
            Power
          </label>
          <input
            type="number"
            id="power"
            name="power"
            value={formData.power}
            onChange={handleChange}
            className={styles.input}
            placeholder="0"
            min="0"
            readOnly={fetchedFromAPI}
          />
          {fetchedFromAPI && <small className={styles.readOnlyHint}>Read-only (from API)</small>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="swordlandPower" className={styles.label}>
            Swordland Power
          </label>
          <input
            type="number"
            id="swordlandPower"
            name="swordlandPower"
            value={formData.swordlandPower}
            onChange={handleChange}
            className={styles.input}
            placeholder="0"
            min="0"
            readOnly={fetchedFromAPI}
          />
          {fetchedFromAPI && <small className={styles.readOnlyHint}>Read-only (from API)</small>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="trialliancePower" className={styles.label}>
            Tri Alliance Power
          </label>
          <input
            type="number"
            id="trialliancePower"
            name="trialliancePower"
            value={formData.trialliancePower}
            onChange={handleChange}
            className={styles.input}
            placeholder="0"
            min="0"
            readOnly={fetchedFromAPI}
          />
          {fetchedFromAPI && <small className={styles.readOnlyHint}>Read-only (from API)</small>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="allianceId" className={styles.label}>
            Alliance ID
          </label>
          <input
            type="text"
            id="allianceId"
            name="allianceId"
            value={formData.allianceId || ''}
            onChange={handleChange}
            className={styles.input}
            placeholder="e.g., FCK"
            readOnly={fetchedFromAPI}
          />
          {fetchedFromAPI && <small className={styles.readOnlyHint}>Read-only (from API)</small>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="kingdomId" className={styles.label}>
            Kingdom ID
          </label>
          <input
            type="number"
            id="kingdomId"
            name="kingdomId"
            value={formData.kingdomId}
            onChange={handleChange}
            className={styles.input}
            placeholder="0"
            min="0"
          />
        </div>

        <div className={styles.actions}>
          <button type="button" onClick={onCancel} className={styles.cancelButton}>
            Cancel
          </button>
          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Player'}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.formGroup}>
        <label htmlFor="playerId" className={styles.label}>
          In-Game Player ID <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          id="playerId"
          name="playerId"
          value={formData.playerId}
          onChange={handleChange}
          className={styles.input}
          placeholder="e.g. 123123123"
          required
        />
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={onCancel} className={styles.cancelButton}>
          Cancel
        </button>
        <button type="submit" className={styles.submitButton} disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Player'}
        </button>
      </div>
    </form>
  );
}
