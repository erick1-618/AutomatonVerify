import React, { useState } from 'react';
import styles from './CreateTitle.module.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { expire } from '../../redux/expireSlice';
import { API_URL } from '../../services/api';
import { useToast } from '../../components/Common/Toast';
import { Dropzone } from '../../components/Common/Dropzone';
import { IconPlus, IconSpinner, IconFileCode } from '../../components/Common/Icons';

function CreateTitle() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    const token = localStorage.getItem('token');

    if (!name.trim()) {
      showToast('O nome do título é obrigatório.', 'error');
      return;
    }

    if (!desc.trim()) {
      showToast('Por favor, informe uma descrição para o título.', 'error');
      return;
    }

    if (!file) {
      showToast('Selecione o arquivo correspondente para gerar o hash inicial.', 'error');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      showToast('O arquivo excede o limite máximo permitido de 50MB.', 'error');
      return;
    }

    setLoading(true);

    const details = { titleName: name.trim(), titleDescription: desc.trim() };

    const formData = new FormData();
    formData.append('file', file);
    formData.append(
      'details',
      new Blob([JSON.stringify(details)], { type: 'application/json' })
    );

    fetch(`${API_URL}/title`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((res) => {
        if (res.status === 413) {
          throw new Error('Arquivo muito grande (máximo 50MB).');
        }
        if (res.status === 403) {
          dispatch(expire());
          throw new Error('Sessão expirada. Faça login novamente.');
        }
        if (!res.ok) {
          throw new Error('Não foi possível cadastrar o título.');
        }
        return res.json();
      })
      .then((data) => {
        showToast('Título publicado com sucesso!', 'success');
        navigate(`/title/${data.id}`);
      })
      .catch((err) => {
        showToast(err.message || 'Erro inesperado ao criar título.', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="page-container">
      <div className={styles.createWrapper}>
        <div className={styles.cardHeader}>
          <div className={styles.iconBadge}>
            <IconFileCode size={24} />
          </div>
          <h1 className={styles.heading}>Publicar Novo Título</h1>
          <p className={styles.subheading}>
            Registre a assinatura digital do seu software na base pública utilizando autômatos celulares
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.formCard}>
          {/* Title Name Field */}
          <div className={styles.fieldGroup}>
            <div className={styles.labelRow}>
              <label className={styles.label} htmlFor="title-name">
                Nome do Título / Software
              </label>
              <span className={styles.charCount}>{name.length}/100</span>
            </div>
            <input
              id="title-name"
              type="text"
              className={styles.input}
              placeholder="Ex: MinhaAplicacao-v1.0.0-linux-x64.tar.gz"
              value={name}
              maxLength={100}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Description Field */}
          <div className={styles.fieldGroup}>
            <div className={styles.labelRow}>
              <label className={styles.label} htmlFor="title-desc">
                Descrição e Notas de Auditoria
              </label>
              <span className={styles.charCount}>{desc.length}/1000</span>
            </div>
            <textarea
              id="title-desc"
              className={styles.textarea}
              rows={5}
              placeholder="Descreva a finalidade deste arquivo, versão de lançamento, ambiente de compilação ou quaisquer instruções relevantes para quem for verificar..."
              value={desc}
              maxLength={1000}
              onChange={(e) => setDesc(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* File Upload Zone */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              Arquivo de Referência (Máx. 50MB)
            </label>
            <Dropzone
              file={file}
              onFileSelect={setFile}
              label="Arraste o arquivo original aqui ou clique para selecionar"
              maxSizeMB={50}
            />
          </div>

          {/* Submit Action */}
          <div className={styles.actionsRow}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? (
                <>
                  <IconSpinner size={18} />
                  <span>Calculando assinatura e enviando...</span>
                </>
              ) : (
                <>
                  <IconPlus size={18} />
                  <span>Publicar Título</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTitle;