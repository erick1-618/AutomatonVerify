import React, { useEffect, useState } from 'react';
import styles from './Search.module.css';
import SearchBar from '../../components/Search/Search';
import TitleSearch from '../../components/Search/TitleSearch';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { expire } from '../../redux/expireSlice';
import { API_URL } from '../../services/api';
import { useToast } from '../../components/Common/Toast';
import { Skeleton } from '../../components/Common/Skeleton';
import { IconSearch } from '../../components/Common/Icons';

function Search() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { showToast } = useToast();

  const [titles, setTitles] = useState([]);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);

  const params = new URLSearchParams(location.search);
  const query = params.get('q') || '';
  const page = parseInt(params.get('p') || '0', 10);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoading(true);

    fetch(`${API_URL}/title/search/name?query=${encodeURIComponent(query)}&page=${page}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 403) {
          dispatch(expire());
        }
        if (!res.ok && res.status !== 404) {
          throw new Error('Erro ao buscar títulos');
        }
        if (res.status === 404) {
          return 404;
        }
        return res.json();
      })
      .then((data) => {
        if (data !== 404 && Array.isArray(data)) {
          setTitles(data[0] || []);
          setHasNext(Boolean(data[1]));
        } else {
          setTitles([]);
          setHasNext(false);
        }
      })
      .catch((err) => {
        showToast(err.message || 'Erro ao buscar títulos', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [query, page, dispatch, showToast]);

  return (
    <div className="page-container">
      <div className={styles.searchPage}>
        {/* Search Header */}
        <div className={styles.topBar}>
          <SearchBar initialValue={query} />
        </div>

        <div className={styles.metaRow}>
          <p className={styles.resultCount}>
            Resultados da busca por: <span className={styles.highlightQuery}>"{query}"</span>
          </p>
          <span className={styles.pageIndicator}>Página {page + 1}</span>
        </div>

        {/* Results List */}
        <div className={styles.resultsContainer}>
          {loading ? (
            <div className={styles.skeletons}>
              <Skeleton height="72px" borderRadius="var(--radius-lg)" />
              <Skeleton height="72px" borderRadius="var(--radius-lg)" />
              <Skeleton height="72px" borderRadius="var(--radius-lg)" />
            </div>
          ) : titles.length > 0 ? (
            <div className={styles.list}>
              {titles.map((item) => (
                <TitleSearch
                  key={item.id}
                  id={item.id}
                  name={item.titleName}
                  author={item.author}
                />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <IconSearch size={28} />
              </div>
              <h3 className={styles.emptyTitle}>Nenhum título encontrado</h3>
              <p className={styles.emptyText}>
                Não encontramos nenhum registro correspondente a "{query}". Tente buscar por outros termos ou verifique a ortografia.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {(page > 0 || hasNext) && (
          <div className={styles.pagination}>
            <button
              className={styles.pageBtn}
              disabled={page <= 0}
              onClick={() => navigate(`/search?q=${encodeURIComponent(query)}&p=${page - 1}`)}
            >
              ← Página Anterior
            </button>
            <button
              className={styles.pageBtn}
              disabled={!hasNext}
              onClick={() => navigate(`/search?q=${encodeURIComponent(query)}&p=${page + 1}`)}
            >
              Próxima Página →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;