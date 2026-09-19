import React from 'react';
import HomeFeature from '../../components/HomeFeature/HomeFeature';
import Search from '../../components/Search/Search';
import styles from './Home.module.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IconPlus } from '../../components/Common/Icons';

function Home() {
  const name = useSelector((state) => state.auth.name);
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className={styles.dashboard}>
        {/* Welcome Banner */}
        <div className={styles.welcomeBanner}>
          <div className={styles.welcomeText}>
            <h1 className={styles.greeting}>
              Bem-vindo de volta, <span className={styles.userName}>{name}</span>!
            </h1>
            <p className={styles.subgreeting}>
              Explore assinaturas públicas ou publique um novo título para validação de integridade.
            </p>
          </div>
          <button
            className={styles.newTitleBtn}
            onClick={() => navigate('/title/create')}
          >
            <IconPlus size={16} />
            <span>Publicar Título</span>
          </button>
        </div>

        {/* Global Search */}
        <div className={styles.searchSection}>
          <Search />
        </div>

        {/* Sections */}
        <div className={styles.featuresStack}>
          <HomeFeature name="Novos títulos" />
          <HomeFeature name="Top Favoritos" />
        </div>
      </div>
    </div>
  );
}

export default Home;