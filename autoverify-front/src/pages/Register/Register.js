import style from "./Register.module.css"
import logo from "../../assets/icons/logotype.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { API_URL } from "../../services/api";

function Register() {

    const navigate = useNavigate()

    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [confPass, setConfPass] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [showConfPass, setShowConfPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    async function createUser(userData){
        setLoading(true);
        setErrorMsg('');
        try{
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(userData)
            });

            const data = await response.json();
            
            if(data.statusCode === "OK" || response.ok){
                setSuccessMsg("Usuário cadastrado com sucesso! Redirecionando para login...");
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
                return;
            } 

            if(data.statusCode === "BAD_REQUEST"){
                setErrorMsg("Esse nome de usuário já está em uso.");
                setLoading(false);
                return;
            }

            setErrorMsg(data.message || "Não foi possível cadastrar o usuário.");
            setLoading(false);

        } catch(error){
            setErrorMsg(`Erro de conexão: ${error.message || error}`);
            setLoading(false);
        }   
    }

    function submit(e){
        if (e) e.preventDefault();

        if(!user.trim() || !pass || !confPass){
            setErrorMsg("Preencha todos os campos obrigatórios.");
            return;
        }

        if(user.trim().length < 3 || user.trim().length > 30){
            setErrorMsg("O nome de usuário deve conter entre 3 e 30 caracteres.");
            return;
        }

        if(pass.length < 6){
            setErrorMsg("A senha deve possuir no mínimo 6 caracteres.");
            return;
        }

        if(pass !== confPass){
            setErrorMsg("As senhas digitadas não coincidem.");
            return;
        }

        createUser({userName: user.trim(), password: pass});
    }

    return (
        <div className={style.register}>
            <form className={style.box} onSubmit={submit}>
                <img className={style.logo} alt="Logo" src={logo} />
                <p className={style.title}>Cadastro</p>

                {errorMsg && <p className={style.errorMsg}>{errorMsg}</p>}
                {successMsg && <p className={style.successMsg}>{successMsg}</p>}

                <div className={style.fields}>
                    <p className={style.label}>Usuário</p>
                    <input 
                        className={style.input} 
                        type="text" 
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
                    <div className={style.passwordWrapper}>
                        <input 
                            className={style.passwordInput} 
                            type={showPass ? "text" : "password"} 
                            value={pass}
                            onChange={(e) => {
                                setPass(e.target.value);
                                setErrorMsg('');
                            }}
                            disabled={loading}
                        />
                        <button 
                            type="button" 
                            className={style.passwordToggle} 
                            onClick={() => setShowPass(!showPass)}
                            title={showPass ? "Ocultar senha" : "Ver senha"}
                        >
                            {showPass ? "👁️‍🗨️" : "👁️"}
                        </button>
                    </div>
                </div>

                <div className={style.fields}>
                    <p className={style.label}>Confirmar Senha</p>
                    <div className={style.passwordWrapper}>
                        <input 
                            className={style.passwordInput} 
                            type={showConfPass ? "text" : "password"} 
                            value={confPass}
                            onChange={(e) => {
                                setConfPass(e.target.value);
                                setErrorMsg('');
                            }}
                            disabled={loading}
                        />
                        <button 
                            type="button" 
                            className={style.passwordToggle} 
                            onClick={() => setShowConfPass(!showConfPass)}
                            title={showConfPass ? "Ocultar senha" : "Ver senha"}
                        >
                            {showConfPass ? "👁️‍🗨️" : "👁️"}
                        </button>
                    </div>
                </div>

                <button className={style.btn} type="submit" disabled={loading}>
                    {loading ? 'Cadastrando...' : 'Cadastrar'}
                </button>

                <p className={style.loginLink}>
                    Já tem uma conta? <span onClick={() => navigate('/login')}>Faça login</span>
                </p>
            </form>
        </div>
    )
}

export default Register;