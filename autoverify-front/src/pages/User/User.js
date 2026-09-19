import React, { useEffect, useState, useCallback } from 'react';
import styles from './User.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Modal from '../../components/Modal/Modal';
import { logout } from '../../redux/authSlice';
import { expire } from '../../redux/expireSlice';
import { API_URL } from '../../services/api';
import { useToast } from '../../components/Common/Toast';
import { Skeleton } from '../../components/Common/Skeleton';
import {
  IconUser,
  IconStar,
  IconTrash,
  IconFileCode,
  IconArrowRight,
} from '../../components/Common/Icons';

function User() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { name } = useParams();
  const { showToast } = useToast();

  const myName = localStorage.getItem('name');
  const myPage = myName === name;

  // my === true -> Meus Títulos; my === false -> Favoritos
  const [my, setMy] = useState(true);
  const [titles, setTitles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trigger, setTrigger] = useState(1);

  // Modals state
  const [deleteTitleModal, setDeleteTitleModal] = useState({ isOpen: false, title: null });
  const [deleteAccountModal, setDeleteAccountModal] = useState(false);

  const fetchTitles = useCallback(() => {
    const token = localStorage.getItem('token');
    setLoading(true);

    const path = myPage
      ? my
        ? `user/name/${name}`
        : 'favorites'
      : `user/name/${name}`;

    fetch(`${API_URL}/title/${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    })
      .then((res) => {
        if (res.status === 403) {
          dispatch(expire());
          throw new Error('Sessão expirada');
        }
        if (!res.ok) {
          return [];
        }
        return res.json();
      })
      .then((data) => {
        setTitles(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        showToast(err.message || 'Erro ao carregar títulos.', 'error');
        setTitles([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [myPage, my, name, dispatch, showToast]);

  useEffect(() => {
    fetchTitles();
  }, [fetchTitles, trigger]);

  function handleUnfavorite(id, titleName) {
    const token = localStorage.getItem('token');

    fetch(`${API_URL}/title/${id}/favorite`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 403) dispatch(expire());
        if (!res.ok) throw new Error();
        showToast(`"${titleName}" removido dos favoritos.`, 'info');
      })
      .catch(() => {
        showToast('Erro ao desfavoritar título.', 'error');
      })
      .finally(() => {
        setTrigger((prev) => -prev);
      });
  }

  function handleDeleteTitleConfirm() {
    const token = localStorage.getItem('token');
    const selected = deleteTitleModal.title;
    if (!selected) return;

    fetch(`${API_URL}/title/${selected.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 403) dispatch(expire());
        if (!res.ok) throw new Error();
        showToast(`Título "${selected.titleName}" excluído com sucesso.`, 'success');
      })
      .catch(() => {
        showToast('Não foi possível excluir o título.', 'error');
      })
      .finally(() => {
        setDeleteTitleModal({ isOpen: false, title: null });
        setTrigger((prev) => -prev);
      });
  }

  function handleDeleteAccountConfirm() {
    const token = localStorage.getItem('token');

    fetch(`${API_URL}/us`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 403) dispatch(expire());
        if (!res.ok) throw new Error();
        dispatch(logout());
        showToast('Sua conta foi excluída permanentemente.', 'info');
        navigate('/');
      })
      .catch(() => {
        showToast('Erro ao excluir conta.', 'error');
      })
      .finally(() => {
        setDeleteAccountModal(false);
      });
  }

  return (
    <div className="page-container">
      <div className={styles.profileWrapper}>
        {/* User Card Header */}
        <div className={styles.profileHeader}>
          <div className={styles.avatarLarge}>
            <IconUser size={32} />
          </div>
          <div className={styles.profileMeta}>
            <h1 className={styles.profileName}>{name}</h1>
            <p className={styles.profileBadge}>
              {myPage ? 'Sua Conta de Desenvolvedor' : 'Perfil Público'}
            </p>
          </div>
        </div>

        {/* Navigation Tabs (if it's the current user) */}
        {myPage ? (
          <div className={styles.tabsRow}>
            <button
              className={`${styles.tabBtn} ${my ? styles.activeTab : ''}`}
              onClick={() => setMy(true)}
            >
              <span>Meus Títulos</span>
            </button>

            <button
              className={`${styles.tabBtn} ${!my ? styles.activeTab : ''}`}
              onClick={() => setMy(false)}
            >
              <IconStar size={15} />
              <span>Títulos Favoritados</span>
            </button>
          </div>
        ) : (
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionHeading}>Títulos Publicados por {name}</h3>
          </div>
        )}

        {/* Titles List */}
        <div className={styles.listContainer}>
          {loading ? (
            <div className={styles.skeletons}>
              <Skeleton height="76px" borderRadius="var(--radius-lg)" />
              <Skeleton height="76px" borderRadius="var(--radius-lg)" />
              <Skeleton height="76px" borderRadius="var(--radius-lg)" />
            </div>
          ) : titles.length > 0 ? (
            <div className={styles.titlesList}>
              {titles.map((item) => (
                <div key={item.id} className={styles.titleCard}>
                  <div
                    className={styles.titleInfo}
                    onClick={() => navigate(`/title/${item.id}`)}
                  >
                    <div className={styles.titleIconWrapper}>
                      <IconFileCode size={20} />
                    </div>
                    <div className={styles.titleText}>
                      <h4 className={styles.titleHeading}>{item.titleName}</h4>
                      <p className={styles.titleSub}>
                        Autor: <span className={styles.authorHighlight}>{item.author}</span>
                        {item.favoriteCount !== undefined && (
                          <span className={styles.favBadge}>
                            <IconStar size={12} filled={true} /> {item.favoriteCount}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className={styles.cardActions}>
                    {myPage && (
                      <>
                        {my ? (
                          <button
                            className={styles.deleteTitleBtn}
                            onClick={() =>
                              setDeleteTitleModal({ isOpen: true, title: item })
                            }
                            title="Excluir título"
                          >
                            <IconTrash size={16} />
                          </button>
                        ) : (
                          <button
                            className={styles.unfavBtn}
                            onClick={() => handleUnfavorite(item.id, item.titleName)}
                            title="Remover dos favoritos"
                          >
                            <IconStar size={16} filled={true} />
                          </button>
                        )}
                      </>
                    )}
                    <button
                      className={styles.viewDetailsBtn}
                      onClick={() => navigate(`/title/${item.id}`)}
                      title="Auditar integridade"
                    >
                      <IconArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>
                {myPage
                  ? my
                    ? 'Você ainda não publicou nenhum título.'
                    : 'Você ainda não possui títulos marcados como favoritos.'
                  : `Nenhum título público encontrado para ${name}.`}
              </p>
              {myPage && my && (
                <button
                  className={styles.createFirstBtn}
                  onClick={() => navigate('/title/create')}
                >
                  Publicar meu primeiro título
                </button>
              )}
            </div>
          )}
        </div>

        {/* Danger Zone for logged in user */}
        {myPage && (
          <div className={styles.dangerZone}>
            <div className={styles.dangerInfo}>
              <h4 className={styles.dangerHeading}>Excluir Conta</h4>
              <p className={styles.dangerText}>
                Esta ação excluirá permanentemente sua conta e removerá todos os seus títulos registrados.
              </p>
            </div>
            <button
              className={styles.deleteAccountBtn}
              onClick={() => setDeleteAccountModal(true)}
            >
              Excluir Minha Conta
            </button>
          </div>
        )}

        {/* Modal: Delete Title */}
        <Modal
          isOpen={deleteTitleModal.isOpen}
          title="Excluir Título"
          message={`Tem certeza que deseja excluir o título "${deleteTitleModal.title?.titleName}"? Essa ação não pode ser desfeita.`}
          isDanger={true}
          accept={{
            action: handleDeleteTitleConfirm,
            message: 'Sim, Excluir',
          }}
          reject={{
            action: () => setDeleteTitleModal({ isOpen: false, title: null }),
            message: 'Cancelar',
          }}
        />

        {/* Modal: Delete Account */}
        <Modal
          isOpen={deleteAccountModal}
          title="Excluir Conta Permanentemente"
          message="Tem certeza absoluta que deseja excluir sua conta? Todos os seus títulos e hashes serão permanentemente apagados."
          isDanger={true}
          accept={{
            action: handleDeleteAccountConfirm,
            message: 'Sim, Excluir Minha Conta',
          }}
          reject={{
            action: () => setDeleteAccountModal(false),
            message: 'Cancelar',
          }}
        />
      </div>
    </div>
  );
}

export default User;