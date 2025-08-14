import styles from './Modal.module.css'

function Modal({ isOpen , accept, reject, message}) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <p>{message}</p>
        <div className={styles.actions}>
            <button onClick={reject.action}>{reject.message}</button>
            <button onClick={accept.action}>{accept.message}</button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
