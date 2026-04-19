'use client';

import { useState, useEffect } from 'react';
import { Player } from '@/types';
import styles from './PlayerForm.module.css';

interface PlayerFormProps {
  player?: Player;
  onSubmit: (player: Omit<Player, 'id'> | Player) => void;
  onCancel: () => void;
}

export default function PlayerForm({ player, onSubmit, onCancel }: PlayerFormProps) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    swordland: 0,
    triAlliance: 0,
  });

  useEffect(() => {
    if (player) {
      setFormData(player);
    }
  }, [player]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'id' || name === 'name' ? value : parseInt(value, 10),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.id === '') {
      alert('Please fill in all fields');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="id" className={styles.label}>
          Player ID
        </label>
        <input
          type="text"
          id="id"
          name="id"
          value={formData.id}
          onChange={handleChange}
          className={styles.input}
          placeholder="e.g. P001"
          required
        />
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
          required
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
          required
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
          required
        />
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={onCancel} className={styles.cancelButton}>
          Cancel
        </button>
        <button type="submit" className={styles.submitButton}>
          {player ? 'Update Player' : 'Add Player'}
        </button>
      </div>
    </form>
  );
}
