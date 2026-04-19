'use client';

import Link from 'next/link';
import Navigation from '@/components/Navigation';
import styles from './page.module.css';

export default function EventsPage() {
  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Events</h1>

          <div className={styles.eventsGrid}>
            <Link href="/swordland" className={styles.eventCard}>
              <div className={styles.cardContent}>
                <h2 className={styles.cardTitle}>Swordland</h2>
                <p className={styles.cardDescription}>
                  Manage legions and organize players for Swordland events
                </p>
              </div>
              <div className={styles.cardIcon}>⚔️</div>
            </Link>

            <Link href="/tri-alliance" className={styles.eventCard}>
              <div className={styles.cardContent}>
                <h2 className={styles.cardTitle}>Tri Alliance</h2>
                <p className={styles.cardDescription}>
                  Coordinate alliances and plan strategies for Tri Alliance events
                </p>
              </div>
              <div className={styles.cardIcon}>🛡️</div>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
