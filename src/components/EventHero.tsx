'use client';

import { useState } from 'react';
import { EventType } from '@/types';
import styles from './EventHero.module.css';

interface EventHeroProps {
  eventType: EventType;
}

const HERO_IMAGES = {
  swordland:
    'https://static.wikia.nocookie.net/kingshot/images/4/47/SwordlandShowdown.png/revision/latest/scale-to-width-down/1000?cb=20250321085018',
  'tri-alliance':
    'https://cacle.kingshotguide.org/guideImage/tri-alliance-clash-kingshot/tri-alliance-clash-map-by-daryl-scaled.webp',
};

const EVENT_TITLES = {
  swordland: 'Swordland Showdown',
  'tri-alliance': 'Tri Alliance Clash',
};

export default function EventHero({ eventType }: EventHeroProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const imageUrl = HERO_IMAGES[eventType];
  const title = EVENT_TITLES[eventType];

  const handleImageClick = () => {
    setIsFullscreen(true);
  };

  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseFullscreen();
    }
  };

  return (
    <>
      <div className={styles.hero}>
        <div className={styles.imageContainer} onClick={handleImageClick}>
          <img src={imageUrl} alt={title} className={styles.image} />
          <div className={styles.overlay}></div>
          <h1 className={styles.title}>{title}</h1>
        </div>
      </div>

      {isFullscreen && (
        <div className={styles.fullscreenModal} onClick={handleBackdropClick}>
          <div className={styles.fullscreenContent}>
            <button
              className={styles.closeButton}
              onClick={handleCloseFullscreen}
              aria-label="Close fullscreen"
            >
              ✕
            </button>
            <img src={imageUrl} alt={title} className={styles.fullscreenImage} />
          </div>
        </div>
      )}
    </>
  );
}
