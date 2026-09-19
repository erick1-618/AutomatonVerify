import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TitleSearch.module.css';
import { IconFileCode, IconUser, IconArrowRight } from '../Common/Icons';

function TitleSearch({ id, name, author }) {
  const navigate = useNavigate();

  return (
    <div
      className={styles.resultItem}
      onClick={() => navigate(`/title/${id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/title/${id}`)}
    >
      <div className={styles.leftGroup}>
        <div className={styles.iconWrapper}>
          <IconFileCode size={20} />
        </div>
        <div className={styles.info}>
          <span className={styles.titleName}>{name}</span>
          <div
            className={styles.authorTag}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/user/${author}`);
            }}
          >
            <IconUser size={12} />
            <span>{author}</span>
          </div>
        </div>
      </div>

      <div className={styles.actionArrow}>
        <IconArrowRight size={16} />
      </div>
    </div>
  );
}

export default TitleSearch;