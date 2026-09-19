import React, { useEffect } from 'react';
import styles from './Header.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, login } from '../../redux/authSlice';
import { IconGridAutomata, IconPlus, IconUser, IconLogout } from '../Common/Icons';

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const name = useSelector((state) => state.auth.name);

  useEffect(() => {
    const savedName = localStorage.getItem('name');
    const token = localStorage.getItem('token');
    if (savedName && !name) {
      dispatch(login({ token: token, name: savedName }));
    }
  }, [name, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const isHomeActive = location.pathname === '/home';

  return (
    <header className={styles.header}>
      <div className={styles.navContainer}>
        {/* Brand / Logo */}
        <div
          className={styles.brand}
          onClick={() => navigate(name ? '/home' : '/')}
        >
          <div className={styles.brandIcon}>
            <IconGridAutomata size={20} />
          </div>
          <span className={styles.brandTitle}>
            Automaton<span className={styles.brandHighlight}>Verify</span>
          </span>
        </div>

        {/* Navigation Items */}
        <nav className={styles.navActions}>
          {!name ? (
            <div className={styles.guestGroup}>
              <button
                className={styles.textLink}
                onClick={() => navigate('/login')}
              >
                Entrar
              </button>
              <button
                className={styles.primaryBtn}
                onClick={() => navigate('/register')}
              >
                Criar Conta
              </button>
            </div>
          ) : (
            <div className={styles.authGroup}>
              <button
                className={`${styles.navLink} ${isHomeActive ? styles.activeLink : ''}`}
                onClick={() => navigate('/home')}
              >
                Explorar
              </button>

              <button
                className={styles.createBtn}
                onClick={() => navigate('/title/create')}
                title="Novo Título"
              >
                <IconPlus size={16} />
                <span className={styles.createBtnText}>Novo Título</span>
              </button>

              <div
                className={styles.userProfile}
                onClick={() => navigate(`/user/${name}`)}
                title="Meu Perfil"
              >
                <div className={styles.avatar}>
                  <IconUser size={15} />
                </div>
                <span className={styles.userName}>{name}</span>
              </div>

              <button
                className={styles.logoutBtn}
                onClick={handleLogout}
                title="Sair"
              >
                <IconLogout size={16} />
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;