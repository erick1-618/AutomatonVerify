import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HomeTitle.module.css';
import { IconFileCode, IconUser, IconStar, IconArrowRight } from '../Common/Icons';

function HomeTitle({ author, name, id, favoriteCount = 0 }) {
  const navigate = useNavigate();

  return (
    <div
      className={styles.titleCard}
      onClick={() => navigate(`/title/${id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/title/${id}`)}
    >
      <div className={styles.cardHeader}>
        <div className={styles.iconWrapper}>
          <IconFileCode size={20} />
        </div>
        {favoriteCount > 0 && (
          <div className={styles.favoriteBadge}>
            <IconStar size={13} filled={true} />
            <span>{favoriteCount}</span>
          </div>
        )}
      </div>

      <div className={styles.cardBody}>
        <h4 className={styles.titleName} title={name}>
          {name}
        </h4>

        <div
          className={styles.authorChip}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/user/${author}`);
          }}
          title={`Ver títulos de ${author}`}
        >
          <IconUser size={12} />
          <span>{author}</span>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <span className={styles.actionText}>Verificar integridade</span>
        <IconArrowRight size={14} className={styles.actionArrow} />
      </div>
    </div>
  );
}

export default HomeTitle;