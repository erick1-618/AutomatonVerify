import React, { useEffect, useState } from 'react';
import HomeTitle from './HomeTitle';
import styles from './HomeFeature.module.css';
import { useDispatch } from 'react-redux';
import { expire } from '../../redux/expireSlice';
import { API_URL } from '../../services/api';
import { SkeletonCard } from '../Common/Skeleton';
import { IconGridAutomata, IconStar } from '../Common/Icons';

function HomeFeature({ name }) {
  const dispatch = useDispatch();

  const [titles, setTitles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isNewest = name === 'Novos títulos';
  const titlesForFetch = isNewest ? 'newests' : 'topfavorites';

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch(`${API_URL}/title/${titlesForFetch}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    })
      .then((res) => {
        if (res.status === 403) {
          dispatch(expire());
        }
        if (!res.ok) {
          throw new Error('Falha ao obter lista de títulos');
        }
        return res.json();
      })
      .then((data) => {
        setTitles(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Erro inesperado');
        setLoading(false);
      });
  }, [dispatch, titlesForFetch]);

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.titleGroup}>
          <div className={styles.iconTag}>
            {isNewest ? <IconGridAutomata size={16} /> : <IconStar size={16} filled={true} />}
          </div>
          <h3 className={styles.sectionTitle}>{name}</h3>
        </div>
      </div>

      {loading ? (
        <div className={styles.grid}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : error ? (
        <div className={styles.errorBox}>
          <p>Não foi possível carregar os títulos: {error}</p>
        </div>
      ) : titles.length === 0 ? (
        <div className={styles.emptyBox}>
          <p>Nenhum título disponível nesta categoria no momento.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {titles.map((t) => (
            <HomeTitle
              key={t.id}
              id={t.id}
              author={t.author}
              name={t.titleName}
              favoriteCount={t.favoriteCount}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default HomeFeature;