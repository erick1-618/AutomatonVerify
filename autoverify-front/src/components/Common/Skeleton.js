import React from 'react';
import styles from './Skeleton.module.css';

export function Skeleton({ width, height, borderRadius, className = '', style = {} }) {
  const customStyles = {
    width: width || '100%',
    height: height || '20px',
    borderRadius: borderRadius || 'var(--radius-md)',
    ...style,
  };

  return <div className={`${styles.skeleton} ${className}`} style={customStyles} />;
}

export function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      <Skeleton width="40%" height="16px" />
      <Skeleton width="80%" height="24px" style={{ marginTop: '12px' }} />
      <Skeleton width="60%" height="14px" style={{ marginTop: '8px' }} />
    </div>
  );
}

