import React from 'react';
import styles from '../Products/Products.module.scss';
import { NavigationIconProps, NavigationItemProps } from '../types';


const NavigationItem: React.FC<NavigationItemProps> = ({ 
  label, 
  isActive,
  onClick 
}) => (
  <button 
    className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
    onClick={onClick}
    aria-pressed={isActive}
  >
    {label}
  </button>
);

const NavigationIcon: React.FC<NavigationIconProps> = ({ 
  src, 
  alt,
  onClick 
}) => (
  <button 
    className={styles.navIconButton}
    onClick={onClick}
    aria-label={alt}
  >
    <img 
      loading="lazy" 
      src={src} 
      alt="" 
      className={styles.navIcon} 
    />
  </button>
);

export const Navigation: React.FC<{
  onCategoryChange: (category: string) => void;
  activeCategory: string;
}> = ({ onCategoryChange, activeCategory }) => {
  const navItems = [
    { label: 'ღვინო', id: 'wine' },
    { label: 'ჭაჭა', id: 'chacha' },
    { label: 'ქვევრის ღვინო', id: 'qvevri' },
    { label: 'ბრენდი', id: 'brandy' }
  ];

  const icons = Array(10).fill(null).map((_, index) => ({
    src: '/berikoni.png',
    
    alt: `Filter option ${index + 1}`
  }));

  return (
    <nav className={styles.navigation} >
      <div className={styles.navItems} >
        {navItems.map(item => (
          <NavigationItem
            key={item.id}
            label={item.label}
            isActive={activeCategory === item.id}
            onClick={() => onCategoryChange(item.id)}
          />
        ))}
      </div>
      <div 
        className={styles.navIcons}
        role="toolbar"
        aria-label="Wine filters"
        
      >
        {icons.map((icon, index) => (
          <NavigationIcon
            key={index}
            {...icon}
            onClick={() => {}}
          />
        ))}
      </div>
      
    </nav>
  );
};