"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";
import styles from "./page.module.css";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.content}>
            <Image
              src="https://img.itch.zone/aW1nLzIwOTY0NTQ5LnBuZw==/original/TIvBF4.png"
              alt="FCK Alliance"
              className={styles.image}
              width={300}
              height={200}
            />
            <h1 className={styles.title}>Welcome to FCK Alliance</h1>
            <p className={styles.description}>
              Manage your players and organize events across Swordland and Tri
              Alliance
            </p>
            <div className={styles.ctas}>
              <Link href="/players" className={styles.ctaButton}>
                Players
              </Link>
              <Link href="/events" className={styles.ctaButton}>
                Events
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
