import React, { useState } from 'react';
import styles from './Search.module.css';
import { useNavigate } from 'react-router-dom';
import { IconSearch } from '../Common/Icons';

function Search({ initialValue = '', onSearch }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState(initialValue);

  function executeSearch() {
    const trimmed = search.trim();
    if (!trimmed) return;

    if (onSearch) {
      onSearch(trimmed);
    } else {
      navigate(`/search?q=${encodeURIComponent(trimmed)}&p=0`);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeSearch();
    }
  }

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchBar}>
        <div className={styles.searchIcon}>
          <IconSearch size={18} />
        </div>
        <input
          className={styles.input}
          value={search}
          onKeyDown={handleKeyDown}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Pesquisar por nome do título ou software..."
          aria-label="Pesquisar títulos"
        />
        {search.trim() && (
          <button
            type="button"
            className={styles.searchActionBtn}
            onClick={executeSearch}
          >
            Buscar
          </button>
        )}
        <div className={styles.kbdShortcut} title="Pressione Enter para buscar">
          ↵
        </div>
      </div>
    </div>
  );
}

export default Search;