import style from './Login.module.css';
import logo from '../../assets/icons/logotype.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/authSlice';
import { getUserName } from '../../utils/utilitaries';
import { API_URL } from '../../services/api';

function Login() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    async function submit(e){
        if (e) e.preventDefault();

        if(!user.trim() || !pass){
            setErrorMsg("Preencha usuário e senha.");
            return;
        }

        setErrorMsg('');
        setLoading(true);

        const loginCredentials = {userName: user.trim(), password: pass};

        try{
            const response = await fetch(`${API_URL}/auth/login`, {
                body: JSON.stringify(loginCredentials),
                method: "POST",
                headers: {"Content-Type": "application/json"}
            });

            if(response.status === 403 || response.status === 401){
                setErrorMsg("Nome de usuário ou senha inválidos.");
                setPass('');
                setLoading(false);
                return;
            }

            if(!response.ok){
                setErrorMsg("Não foi possível realizar o seu login.");
                setLoading(false);
                return;
            }            
        
            const data = await response.json();
            const name = getUserName(data.token);

            dispatch(login({token: data.token, name}));
            navigate('/home')

        }catch(error){
            setErrorMsg(`Erro de conexão: ${error.message || error}`);
            setLoading(false);
        }
    }

    return (
        <div className={style.login}>
            <form className={style.box} onSubmit={submit}>
                <img className={style.logo} alt="Logo" src={logo} />
                <p className={style.title}>Entrar</p>

                {errorMsg && <p className={style.errorMsg}>{errorMsg}</p>}

                <div className={style.fields}>
                    <p className={style.label}>Usuário</p>
                    <input 
                        className={style.input} 
                        type='text' 
                        value={user} 
                        onChange={(e) => {
                            setUser(e.target.value);
                            setErrorMsg('');
                        }}
                        disabled={loading}
                    />
                </div>

                <div className={style.fields}>
                    <p className={style.label}>Senha</p>
                    <input 
                        className={style.input} 
                        type='password' 
                        value={pass} 
                        onChange={(e) => {
                            setPass(e.target.value);
                            setErrorMsg('');
                        }}
                        disabled={loading}
                    />
                </div>

                <button className={style.btn} type="submit" disabled={loading}>
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>

                <p className={style.register}>
                    Não possui uma conta? <span onClick={() => navigate('/register')}>Cadastre-se</span>
                </p>
            </form>
        </div>
    )
}

export default Login;