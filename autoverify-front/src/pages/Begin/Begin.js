import Logo from "../../assets/logo.png"
import style from "./Begin.module.css"
import { useNavigate } from 'react-router-dom'

function Home() {

    const navigate = useNavigate()

    return (
        <div className={style.begin}>
            <img src={Logo} alt="Logo" className={style.logo}></img>
            <div className={style.call}>
                <p>Garanta a autenticidade de seus arquivos com o poder dos autômatos celulares.</p>
                <button className={style.button} onClick={() => navigate("/register")}>Começe agora</button>
            </div>
        </div>
    );
}

export default Home;