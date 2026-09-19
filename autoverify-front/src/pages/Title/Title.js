import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './Title.module.css';
import { useDispatch } from 'react-redux';
import { expire } from '../../redux/expireSlice';
import { API_URL } from '../../services/api';
import { useToast } from '../../components/Common/Toast';
import { Dropzone } from '../../components/Common/Dropzone';
import { Skeleton } from '../../components/Common/Skeleton';
import {
  IconFileCode,
  IconUser,
  IconStar,
  IconShieldCheck,
  IconShieldAlert,
  IconSpinner,
} from '../../components/Common/Icons';

function Title() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const [title, setTitle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // File and Verification states
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null); // 'true' | 'false' | null
  const [resultLoading, setResultLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch(`${API_URL}/title/${id}`, {
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
          throw new Error('Falha ao obter detalhes do título');
        }
        return res.json();
      })
      .then((data) => {
        setTitle(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(true);
        showToast(err.message || 'Erro ao carregar título', 'error');
      });
  }, [id, dispatch, showToast]);

  function handleFavorite() {
    const token = localStorage.getItem('token');
    if (!title) return;

    const method = title.favorited ? 'DELETE' : 'POST';

    fetch(`${API_URL}/title/${id}/favorite`, {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 403) {
          dispatch(expire());
          throw new Error('Sessão expirada');
        }
        return res.json();
      })
      .then((data) => {
        setTitle(data);
        showToast(
          data.favorited ? 'Adicionado aos favoritos!' : 'Removido dos favoritos.',
          'info'
        );
      })
      .catch((err) => {
        showToast('Erro ao atualizar favorito', 'error');
      });
  }

  function handleVerify() {
    const token = localStorage.getItem('token');

    if (!selectedFile) {
      showToast('Selecione ou arraste um arquivo para verificar.', 'error');
      return;
    }

    if (selectedFile.size > 50 * 1024 * 1024) {
      showToast('O arquivo excede o limite máximo permitido de 50MB.', 'error');
      return;
    }

    setResultLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    fetch(`${API_URL}/title/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      method: 'POST',
    })
      .then((res) => {
        if (res.status === 403) {
          dispatch(expire());
          throw new Error('Sessão expirada');
        }
        if (!res.ok) {
          throw new Error('Falha ao processar arquivo para verificação');
        }
        return res.json();
      })
      .then((data) => {
        const hashResult = data.message && data.message[0];
        setResult(hashResult === 'true' ? 'true' : 'false');
      })
      .catch((err) => {
        showToast(err.message || 'Erro durante a verificação', 'error');
      })
      .finally(() => {
        setResultLoading(false);
      });
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className={styles.loadingContainer}>
          <Skeleton height="32px" width="50%" />
          <Skeleton height="20px" width="30%" style={{ marginTop: '12px' }} />
          <Skeleton height="200px" style={{ marginTop: '32px' }} />
          <Skeleton height="160px" style={{ marginTop: '24px' }} />
        </div>
      </div>
    );
  }

  if (error || !title) {
    return (
      <div className="page-container">
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>
            <IconShieldAlert size={36} />
          </div>
          <h2>Título não encontrado</h2>
          <p>O título solicitado não existe ou você não possui permissão para visualizá-lo.</p>
          <button className={styles.backBtn} onClick={() => navigate('/home')}>
            ← Voltar para a Home
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = title.creationDate
    ? title.creationDate.substring(0, 10).split('-').reverse().join('/')
    : 'Data desconhecida';

  return (
    <div className="page-container">
      <div className={styles.titlePage}>
        {/* Navigation back */}
        <button className={styles.breadcrumbBtn} onClick={() => navigate(-1)}>
          ← Voltar
        </button>

        {/* Main Card */}
        <div className={styles.detailsCard}>
          {/* Header Info */}
          <div className={styles.cardTop}>
            <div className={styles.titleHeaderGroup}>
              <div className={styles.typeBadge}>
                <IconFileCode size={20} />
              </div>
              <div>
                <h1 className={styles.titleHeading}>{title.titleName}</h1>
                <div className={styles.metaRow}>
                  <div
                    className={styles.authorTag}
                    onClick={() => navigate(`/user/${title.author}`)}
                    title={`Ver perfil de ${title.author}`}
                  >
                    <IconUser size={13} />
                    <span>{title.author}</span>
                  </div>
                  <span className={styles.bullet}>•</span>
                  <span className={styles.dateTag}>Criado em {formattedDate}</span>
                </div>
              </div>
            </div>

            {/* Favorite Action */}
            <button
              className={`${styles.favBtn} ${title.favorited ? styles.isFavorited : ''}`}
              onClick={handleFavorite}
              title={title.favorited ? 'Remover dos favoritos' : 'Favoritar título'}
            >
              <IconStar size={16} filled={title.favorited} />
              <span className={styles.favCount}>{title.favoriteCount || 0}</span>
            </button>
          </div>

          {/* Description Section */}
          <div className={styles.descriptionSection}>
            <h3 className={styles.sectionLabel}>Descrição e Especificações</h3>
            <div className={styles.descriptionContent}>
              <p>{title.titleDescription || 'Nenhuma descrição detalhada fornecida.'}</p>
            </div>
          </div>

          {/* Integrity Verification Zone */}
          <div className={styles.verificationSection}>
            <div className={styles.verifyHeader}>
              <h3 className={styles.verifyTitle}>Auditoria de Integridade</h3>
              <p className={styles.verifySubtitle}>
                Submeta o arquivo para confrontar sua estrutura contra o hash gerado pelo autômato celular.
              </p>
            </div>

            <div className={styles.dropzoneWrapper}>
              <Dropzone
                file={selectedFile}
                onFileSelect={(file) => {
                  setSelectedFile(file);
                  setResult(null);
                }}
                label="Selecione o arquivo correspondente para auditar a integridade"
              />
            </div>

            {selectedFile && (
              <div className={styles.actionRow}>
                <button
                  className={styles.verifyActionBtn}
                  onClick={handleVerify}
                  disabled={resultLoading}
                >
                  {resultLoading ? (
                    <>
                      <IconSpinner size={18} />
                      <span>Processando hash por autômatos celulares...</span>
                    </>
                  ) : (
                    <>
                      <IconShieldCheck size={18} />
                      <span>Verificar Integridade</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Result Banners */}
            {result && (
              <div
                className={`${styles.resultBanner} ${
                  result === 'true' ? styles.resultSuccess : styles.resultFailed
                }`}
              >
                <div className={styles.resultIcon}>
                  {result === 'true' ? (
                    <IconShieldCheck size={28} />
                  ) : (
                    <IconShieldAlert size={28} />
                  )}
                </div>
                <div className={styles.resultTextGroup}>
                  <h4 className={styles.resultTitle}>
                    {result === 'true'
                      ? 'Integridade Verificada com Sucesso'
                      : 'Integridade Comprometida ou Divergente'}
                  </h4>
                  <p className={styles.resultDescription}>
                    {result === 'true'
                      ? 'O arquivo fornecido coincide rigorosamente com a assinatura criptográfica registrada. Nenhuma alteração de bit ou corrupção foi detectada.'
                      : 'Atenção: o hash calculado a partir do arquivo submetido não corresponde à assinatura registrada. O arquivo pode ter sido modificado, corrompido ou não ser a versão original.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Title;