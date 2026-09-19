import React, { useState } from 'react';
import styles from './Register.module.css';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../../services/api';
import { useToast } from '../../components/Common/Toast';
import { IconUser, IconLock, IconSpinner, IconGridAutomata } from '../../components/Common/Icons';

function Register() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [confPass, setConfPass] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!user.trim() || !pass || !confPass) {
      showToast('Por favor, preencha todos os campos.', 'error');
      return;
    }

    if (user.trim().length < 3 || user.trim().length > 30) {
      showToast('O nome de usuário deve conter entre 3 e 30 caracteres.', 'error');
      return;
    }

    if (pass.length < 6) {
      showToast('A senha deve ter no mínimo 6 caracteres.', 'error');
      return;
    }

    if (pass !== confPass) {
      showToast('As senhas digitadas não coincidem.', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: user.trim(), password: pass }),
      });

      const data = await response.json();

      if (data.statusCode === 'OK' || response.ok) {
        showToast('Conta criada com sucesso! Faça login para continuar.', 'success');
        navigate('/login');
        return;
      }

      if (data.statusCode === 'BAD_REQUEST') {
        showToast('Este nome de usuário já está em uso. Escolha outro.', 'error');
        return;
      }

      showToast(data.message || 'Não foi possível cadastrar o usuário.', 'error');
    } catch (error) {
      showToast(`Erro ao conectar com o servidor: ${error.message || error}`, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.registerWrapper}>
      <div className={styles.registerCard}>
        <div className={styles.cardHeader}>
          <div className={styles.logoBadge}>
            <IconGridAutomata size={22} />
          </div>
          <h2 className={styles.title}>Crie sua conta</h2>
          <p className={styles.subtitle}>
            Comece a assinar e validar a integridade de seus softwares
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="reg-username">
              Nome de Usuário
            </label>
            <div className={styles.inputWrapper}>
              <div className={styles.fieldIcon}>
                <IconUser size={16} />
              </div>
              <input
                id="reg-username"
                type="text"
                className={styles.input}
                placeholder="Ex: erick_dev"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                autoComplete="username"
                disabled={loading}
              />
            </div>
            <span className={styles.helperText}>Mínimo de 3 caracteres</span>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="reg-password">
              Senha
            </label>
            <div className={styles.inputWrapper}>
              <div className={styles.fieldIcon}>
                <IconLock size={16} />
              </div>
              <input
                id="reg-password"
                type="password"
                className={styles.input}
                placeholder="Mínimo 6 caracteres"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                autoComplete="new-password"
                disabled={loading}
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="reg-conf-password">
              Confirmar Senha
            </label>
            <div className={styles.inputWrapper}>
              <div className={styles.fieldIcon}>
                <IconLock size={16} />
              </div>
              <input
                id="reg-conf-password"
                type="password"
                className={styles.input}
                placeholder="Digite a mesma senha"
                value={confPass}
                onChange={(e) => setConfPass(e.target.value)}
                autoComplete="new-password"
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
                <span>Criando conta...</span>
              </>
            ) : (
              'Cadastrar'
            )}
          </button>
        </form>

        <div className={styles.cardFooter}>
          <p className={styles.footerText}>
            Já possui uma conta?{' '}
            <Link to="/login" className={styles.link}>
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;