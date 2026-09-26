import style from "./Register.module.css";
import logo from "../../assets/icons/logotype.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../services/api";

function Register() {
    const navigate = useNavigate();

    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [confPass, setConfPass] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [showConfPass, setShowConfPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    async function createUser(userData) {
        setLoading(true);
        setErrorMsg('');
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (data.statusCode === "OK" || response.ok) {
                setSuccessMsg("Usuário cadastrado com sucesso! Redirecionando para login...");
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
                return;
            }

            const rawMsg = Array.isArray(data.message) ? data.message[0] : (data.message || '');

            if (rawMsg.toLowerCase().includes("already exists")) {
                setErrorMsg("Esse nome de usuário já está em uso.");
            } else if (rawMsg.toLowerCase().includes("password")) {
                setErrorMsg("A senha deve conter no mínimo 8 caracteres, com letra maiúscula, minúscula, número e caractere especial (@$!%*?&).");
            } else if (rawMsg.toLowerCase().includes("name")) {
                setErrorMsg("O nome de usuário deve iniciar com letra e ter pelo menos 5 caracteres (apenas letras, números e _).");
            } else {
                setErrorMsg(rawMsg || "Não foi possível cadastrar o usuário.");
            }
            setLoading(false);

        } catch (error) {
            setErrorMsg(`Erro de conexão: ${error.message || error}`);
            setLoading(false);
        }
    }

    function submit(e) {
        if (e) e.preventDefault();

        if (!user.trim() || !pass || !confPass) {
            setErrorMsg("Preencha todos os campos obrigatórios.");
            return;
        }

        const usernameRegex = /^[A-Za-z][A-Za-z0-9_]{4,29}$/;
        if (!usernameRegex.test(user.trim())) {
            setErrorMsg("O nome de usuário deve iniciar com letra, ter no mínimo 5 caracteres e conter apenas letras, números e sublinhado (_).");
            return;
        }

        if (pass.length < 8) {
            setErrorMsg("A senha deve possuir no mínimo 8 caracteres.");
            return;
        }

        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passRegex.test(pass)) {
            setErrorMsg("A senha precisa ter letra maiúscula, minúscula, número e caractere especial (@$!%*?&).");
            return;
        }

        if (pass !== confPass) {
            setErrorMsg("As senhas digitadas não coincidem.");
            return;
        }

        createUser({ userName: user.trim(), password: pass });
    }

    return (
        <div className={style.register}>
            <form className={style.box} onSubmit={submit}>
                <img className={style.logo} alt="Logo" src={logo} />
                <p className={style.title}>Cadastro</p>

                {errorMsg && <p className={style.errorMsg}>{errorMsg}</p>}
                {successMsg && <p className={style.successMsg}>{successMsg}</p>}

                <div className={style.fields}>
                    <p className={style.label}>Usuário (mínimo 5 letras/números)</p>
                    <input 
                        className={style.input} 
                        type="text" 
                        value={user}
                        placeholder="Ex: nome_123"
                        onChange={(e) => {
                            setUser(e.target.value);
                            setErrorMsg('');
                        }}
                        disabled={loading}
                    />
                </div>

                <div className={style.fields}>
                    <p className={style.label}>Senha (mín. 8 chars, 1 maiusc., 1 num., 1 símb.)</p>
                    <div className={style.passwordWrapper}>
                        <input 
                            className={style.passwordInput} 
                            type={showPass ? "text" : "password"} 
                            value={pass}
                            placeholder="Ex: Senha@123"
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
                            placeholder="Repita sua senha"
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
    );
}

export default Register;