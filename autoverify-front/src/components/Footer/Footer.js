import styles from "./Footer.module.css";
import mailIcon from "../../assets/icons/mail.png";
import linkedinIcon from "../../assets/icons/linkedin.png";

function Footer() {
    return (
       <footer className={styles.footer}>
            <div className={styles.leftGroup}>
                <p>by Erick Andrade</p>
                <p>Projeto de estudos</p>
            </div>

            <div className={styles.rightGroup}>
                <p>Entre em contato:</p>
                <div className={styles.ctt}>
                    <img src={linkedinIcon} alt="Linkedin" className={styles.icon}></img>
                    <p>linkedin.com/in/erick-andrade-3024a5333/</p>
                </div>
                <div className={styles.ctt}>
                    <img className={styles.icon} alt="Mail" src={mailIcon}></img>
                    <p>erickcefetbcc@gmail.com</p>
                </div>
            </div>
       </footer>
    )
}

export default Footer;