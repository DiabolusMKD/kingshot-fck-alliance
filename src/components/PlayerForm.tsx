'use client';

import { useState, useEffect } from 'react';
import { Player } from '@/types';
import styles from './PlayerForm.module.css';

interface PlayerFormProps {
  player?: Player;
  nextPlayerId: number;
  onSubmit: (player: Omit<Player, 'id'> | Player) => void;
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

export default function PlayerForm({ player, nextPlayerId, onSubmit, onCancel }: PlayerFormProps) {
  const [formData, setFormData] = useState(EMPTY_FORM_DATA);
  const isEditMode = !!player;

  useEffect(() => {
    if (player) {
      // Edit mode: populate with existing player data
      const { id, ...playerDataWithoutId } = player;
      setFormData(playerDataWithoutId);
    } else {
      // Add mode: clear all fields
      setFormData(EMPTY_FORM_DATA);
    }
  }, [player]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericFields = ['playerId', 'swordland', 'triAlliance', 'power'];
    
    setFormData((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) && value ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Please enter a player name');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="playerId" className={styles.label}>
          In-Game Player ID
        </label>
        <input
          type="text"
          id="playerId"
          name="playerId"
          value={formData.playerId}
          onChange={handleChange}
          className={styles.input}
          placeholder="e.g. 123123123 or P001"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>
          Name <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={styles.input}
          placeholder="Player name"
          required
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
        />
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={onCancel} className={styles.cancelButton}>
          Cancel
        </button>
        <button type="submit" className={styles.submitButton}>
          {isEditMode ? 'Update Player' : 'Add Player'}
        </button>
      </div>
    </form>
  );
}
