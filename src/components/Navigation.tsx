'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navigation.module.css';

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className={styles.navigation}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          FCK Alliance
        </Link>
        <ul className={styles.links}>
          <li>
            <Link
              href="/"
              className={`${styles.link} ${isActive('/') ? styles.active : ''}`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/players"
              className={`${styles.link} ${isActive('/players') ? styles.active : ''}`}
            >
              Players
            </Link>
          </li>
          <li>
            <Link
              href="/events"
              className={`${styles.link} ${isActive('/events') ? styles.active : ''}`}
            >
              Events
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
