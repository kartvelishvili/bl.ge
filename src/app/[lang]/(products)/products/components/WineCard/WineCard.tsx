import React from 'react';
import styles from '../Products/Products.module.scss';
import { WineCardProps } from '../types';
import Image from "next/image";


export const WineCard: React.FC<WineCardProps> = ({ 
  imageSrc, 
  title, 
  subtitle, 
  onClick,
}) => {
  return (
    <button 
      className={styles.wineCard}
      onClick={onClick}
    >
      <Image
          width={179}
          height={20}
        src={imageSrc}
        alt={`${title} wine bottle`}
        className={styles.wineImage}
        draggable={false}
        style={{ height: 'auto' }}
      />
      <div className={styles.wineInfo}>
        <div className={styles.wineTitle}>{title}</div>
        {subtitle && (
          <div className={styles.wineSubtitle}>{subtitle}</div>
        )}
      </div>
    </button>
  );
};