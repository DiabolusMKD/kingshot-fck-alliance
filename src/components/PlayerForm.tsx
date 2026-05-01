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
  alias: '',
  swordland: 0,
  triAlliance: 0,
  power: 0,
  active: true,
};

export default function PlayerForm({ player, onSubmit, onCancel }: PlayerFormProps) {
  const [formData, setFormData] = useState(EMPTY_FORM_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditMode = !!player;

  useEffect(() => {
    if (player) {
      // Edit mode: populate with existing player data
      const { id, created_at, updated_at, ...playerDataWithoutId } = player;
      setFormData(playerDataWithoutId);
      setError(null);
    } else {
      // Add mode: only playerId field
      setFormData({ ...EMPTY_FORM_DATA, playerId: '' });
      setError(null);
    }
  }, [player]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericFields = ['swordland', 'triAlliance', 'power'];

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
      setFormData((prev) => ({
        ...prev,
        ...playerData,
      }));
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
      // In add mode, we need to fetch from the API first
      if (!formData.name) {
        await handleRefetch();
        return;
      }
    }

    onSubmit(formData);
  };

  if (isEditMode) {
    // Edit mode: show all fields with refetch button
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
            readOnly
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="alias" className={styles.label}>
            Alias
          </label>
          <input
            type="text"
            id="alias"
            name="alias"
            value={formData.alias}
            onChange={handleChange}
            className={styles.input}
            placeholder="Player alias"
            readOnly
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
            readOnly
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="swordland" className={styles.label}>
            Swordland Power
          </label>
          <input
            type="number"
            id="swordland"
            name="swordland"
            value={formData.swordland}
            onChange={handleChange}
            className={styles.input}
            placeholder="0"
            min="0"
            readOnly
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="triAlliance" className={styles.label}>
            Tri Alliance Power
          </label>
          <input
            type="number"
            id="triAlliance"
            name="triAlliance"
            value={formData.triAlliance}
            onChange={handleChange}
            className={styles.input}
            placeholder="0"
            min="0"
            readOnly
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

  // Add mode: only playerId field
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
