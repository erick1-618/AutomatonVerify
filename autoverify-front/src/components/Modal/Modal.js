import React, { useEffect } from 'react';
import styles from './Modal.module.css';
import { IconShieldAlert, IconX } from '../Common/Icons';

function Modal({ isOpen, accept, reject, message, title = "Confirmação", isDanger = false }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && reject) {
        reject.action();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, reject]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={() => reject && reject.action()}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.header}>
          <div className={`${styles.iconContainer} ${isDanger ? styles.dangerIcon : ''}`}>
            <IconShieldAlert size={20} />
          </div>
          <h3 className={styles.title}>{title}</h3>
          {reject && (
            <button className={styles.closeBtn} onClick={reject.action} aria-label="Fechar">
              <IconX size={16} />
            </button>
          )}
        </div>

        <p className={styles.message}>{message}</p>

        <div className={styles.actions}>
          {reject && (
            <button className={styles.rejectBtn} onClick={reject.action}>
              {reject.message}
            </button>
          )}
          {accept && (
            <button
              className={`${styles.acceptBtn} ${isDanger ? styles.dangerAccept : ''}`}
              onClick={accept.action}
            >
              {accept.message}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Modal;
