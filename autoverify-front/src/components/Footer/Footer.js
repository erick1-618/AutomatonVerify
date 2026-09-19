import React from 'react';
import styles from './Footer.module.css';
import { IconLinkedin, IconMail, IconGridAutomata } from '../Common/Icons';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.leftGroup}>
          <div className={styles.brandBadge}>
            <IconGridAutomata size={16} />
            <span>AutomatonVerify</span>
          </div>
          <p className={styles.tagline}>
            Verificação e integridade criptográfica de software baseada em autômatos celulares.
          </p>
          <span className={styles.copyright}>
            © {new Date().getFullYear()} Erick Andrade. Projeto de Pesquisa e Desenvolvimento.
          </span>
        </div>

        <div className={styles.rightGroup}>
          <p className={styles.contactTitle}>Contato do Autor</p>
          <div className={styles.contactLinks}>
            <a
              href="https://linkedin.com/in/erick-andrade-3024a5333/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactItem}
              title="LinkedIn"
            >
              <IconLinkedin size={16} />
              <span>LinkedIn</span>
            </a>
            <a
              href="mailto:erickcefetbcc@gmail.com"
              className={styles.contactItem}
              title="E-mail"
            >
              <IconMail size={16} />
              <span>erickcefetbcc@gmail.com</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;