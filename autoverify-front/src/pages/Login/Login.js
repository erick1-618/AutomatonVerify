import React, { useState } from 'react';
import styles from './Login.module.css';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/authSlice';
import { getUserName } from '../../utils/utilitaries';
import { API_URL } from '../../services/api';
import { useToast } from '../../components/Common/Toast';
import { IconUser, IconLock, IconSpinner, IconGridAutomata } from '../../components/Common/Icons';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!user.trim() || !pass.trim()) {
      showToast('Por favor, preencha o usuário e a senha.', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        body: JSON.stringify({ userName: user.trim(), password: pass }),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 403 || response.status === 401) {
        showToast('Usuário ou senha inválidos.', 'error');
        setLoading(false);
        return;
      }

      if (!response.ok) {
        showToast('Não foi possível realizar o login. Tente novamente mais tarde.', 'error');
        setLoading(false);
        return;
      }

      const data = await response.json();
      const name = getUserName(data.token);

      dispatch(login({ token: data.token, name }));
      showToast(`Bem-vindo de volta, ${name}!`, 'success');
      navigate('/home');
    } catch (error) {
      showToast(`Erro de conexão com o servidor: ${error.message || error}`, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginCard}>
        <div className={styles.cardHeader}>
          <div className={styles.logoBadge}>
            <IconGridAutomata size={22} />
          </div>
          <h2 className={styles.title}>Entrar na sua conta</h2>
          <p className={styles.subtitle}>
            Acesse o AutomatonVerify para gerenciar e validar seus títulos
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="username">
              Nome de Usuário
            </label>
            <div className={styles.inputWrapper}>
              <div className={styles.fieldIcon}>
                <IconUser size={16} />
              </div>
              <input
                id="username"
                type="text"
                className={styles.input}
                placeholder="Seu nome de usuário"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                autoComplete="username"
                disabled={loading}
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="password">
              Senha
            </label>
            <div className={styles.inputWrapper}>
              <div className={styles.fieldIcon}>
                <IconLock size={16} />
              </div>
              <input
                id="password"
                type="password"
                className={styles.input}
                placeholder="••••••••"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                autoComplete="current-password"
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? (
              <>
                <IconSpinner size={16} />
                <span>Autenticando...</span>
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        <div className={styles.cardFooter}>
          <p className={styles.footerText}>
            Não possui uma conta?{' '}
            <Link to="/register" className={styles.link}>
              Cadastre-se gratuitamente
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;