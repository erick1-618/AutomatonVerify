import React from 'react';
import styles from './Begin.module.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  IconGridAutomata,
  IconShieldCheck,
  IconFileCode,
  IconArrowRight,
  IconCheck,
} from '../../components/Common/Icons';

function Begin() {
  const navigate = useNavigate();
  const name = useSelector((state) => state.auth.name);

  return (
    <div className={styles.beginPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.badge}>
          <IconGridAutomata size={14} />
          <span>Autômatos Celulares para Funções Hash</span>
        </div>

        <h1 className={styles.heroTitle}>
          Verificação de integridade e assinatura de software{' '}
          <span className={styles.titleGradient}>matematicamente robusta.</span>
        </h1>

        <p className={styles.heroDescription}>
          Armazene assinaturas digitais determinísticas para seus arquivos e binários.
          Permita que qualquer desenvolvedor, auditor ou usuário confirme que um software
          permaneceu intacto e sem alterações maliciosas.
        </p>

        <div className={styles.heroActions}>
          <button
            className={styles.ctaButton}
            onClick={() => navigate(name ? '/home' : '/register')}
          >
            <span>{name ? 'Acessar Plataforma' : 'Criar Conta Gratuita'}</span>
            <IconArrowRight size={16} />
          </button>

          {!name && (
            <button
              className={styles.secondaryButton}
              onClick={() => navigate('/login')}
            >
              Já possuo cadastro
            </button>
          )}
        </div>
      </section>

      {/* Pillars Grid */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Como funciona a tecnologia</h2>
          <p className={styles.sectionSubtitle}>
            Segurança determinística sem depender de algoritmos lentos ou opacos
          </p>
        </div>

        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.cardIcon}>
              <IconGridAutomata size={22} />
            </div>
            <h3 className={styles.cardTitle}>Autômatos Celulares</h3>
            <p className={styles.cardDescription}>
              Regras locais e evolução iterativa produzem dispersão caótica e alta sensibilidade, garantindo que qualquer alteração de bit mude drasticamente o resultado.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.cardIcon}>
              <IconShieldCheck size={22} />
            </div>
            <h3 className={styles.cardTitle}>Verificação Não Invasiva</h3>
            <p className={styles.cardDescription}>
              Seus arquivos originais são processados de forma privada. Apenas a assinatura calculada é persistida para validação pública e rápida.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.cardIcon}>
              <IconFileCode size={22} />
            </div>
            <h3 className={styles.cardTitle}>Auditoria para Qualquer Software</h3>
            <p className={styles.cardDescription}>
              Ideal para pacotes de código-fonte, executáveis, drivers, releases e documentações de engenharia com suporte para arquivos de até 50MB.
            </p>
          </div>
        </div>
      </section>

      {/* Steps Flow */}
      <section className={styles.stepsSection}>
        <div className={styles.stepsCard}>
          <div className={styles.stepItem}>
            <div className={styles.stepNumber}>1</div>
            <div>
              <h4 className={styles.stepHeading}>Publique o Título</h4>
              <p className={styles.stepText}>Suba a versão oficial do seu arquivo para gerar o hash inicial.</p>
            </div>
          </div>
          <div className={styles.stepDivider} />
          <div className={styles.stepItem}>
            <div className={styles.stepNumber}>2</div>
            <div>
              <h4 className={styles.stepHeading}>Compartilhe com a Comunidade</h4>
              <p className={styles.stepText}>Qualquer interessado pode localizar seu título na busca pública.</p>
            </div>
          </div>
          <div className={styles.stepDivider} />
          <div className={styles.stepItem}>
            <div className={styles.stepNumber}>3</div>
            <div>
              <h4 className={styles.stepHeading}>Validação em 1 Clique</h4>
              <p className={styles.stepText}>O usuário envia o arquivo baixado e confere se a integridade está preservada.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Begin;