import React, { createContext, useContext, useState, useCallback } from 'react';
import styles from './Toast.module.css';
import { IconCheck, IconX, IconShieldAlert } from './Icons';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className={styles.toastContainer} aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`${styles.toast} ${styles[toast.type] || styles.info}`}
          >
            <div className={styles.iconWrapper}>
              {toast.type === 'success' && <IconCheck size={16} />}
              {toast.type === 'error' && <IconShieldAlert size={16} />}
              {toast.type === 'info' && <IconCheck size={16} />}
            </div>
            <div className={styles.message}>{toast.message}</div>
            <button
              className={styles.closeBtn}
              onClick={() => removeToast(toast.id)}
              aria-label="Fechar notificação"
            >
              <IconX size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback gracioso caso chamado fora do provider
    return {
      showToast: (msg) => console.log(msg)
    };
  }
  return context;
}

