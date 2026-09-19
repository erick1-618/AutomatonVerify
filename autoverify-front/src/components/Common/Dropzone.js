import React, { useRef, useState } from 'react';
import styles from './Dropzone.module.css';
import { IconUploadCloud, IconFileCode, IconX } from './Icons';

export function Dropzone({ file, onFileSelect, maxSizeMB = 50, label = "Arraste e solte o arquivo aqui ou clique para selecionar" }) {
  const inputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSelect(e.target.files[0]);
    }
  };

  const validateAndSelect = (selectedFile) => {
    onFileSelect(selectedFile);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div
      className={`${styles.dropzone} ${isDragOver ? styles.dragOver : ''} ${file ? styles.hasFile : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !file && inputRef.current?.click()}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleChange}
        style={{ display: 'none' }}
        id="dropzone-file-input"
      />

      {file ? (
        <div className={styles.filePreview}>
          <div className={styles.fileIcon}>
            <IconFileCode size={28} />
          </div>
          <div className={styles.fileDetails}>
            <span className={styles.fileName}>{file.name}</span>
            <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
          </div>
          <button
            type="button"
            className={styles.removeBtn}
            onClick={(e) => {
              e.stopPropagation();
              onFileSelect(null);
              if (inputRef.current) inputRef.current.value = '';
            }}
            title="Remover arquivo"
          >
            <IconX size={16} />
          </button>
        </div>
      ) : (
        <div className={styles.uploadPrompt}>
          <div className={styles.cloudIcon}>
            <IconUploadCloud size={36} />
          </div>
          <p className={styles.primaryText}>{label}</p>
          <p className={styles.secondaryText}>
            Suporta qualquer tipo de arquivo (binário, texto, código) até {maxSizeMB}MB
          </p>
        </div>
      )}
    </div>
  );
}

