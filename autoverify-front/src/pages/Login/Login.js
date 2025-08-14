import style from './Login.module.css';
import logo from '../../assets/icons/logotype.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {useDispatch} from 'react-redux'
import {login} from '../../redux/authSlice'
import { getUserName } from '../../utils/utilitaries';

function Login() {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const [user, setUser] = useState('');

    const [pass, setPass] = useState('');

    async function submit(){
        const loginCredentials = {userName: user, password: pass};

        try{
            const response = await fetch('http://localhost:8080/auth/login', {
                body: JSON.stringify(loginCredentials),
                method: "POST",
                headers: {"Content-Type": "application/json"}
            });

            if(response.status === 403){
                alert("Nome de usuário ou senha inválidos 🙁!");
                setUser(''); setPass('');
                return;
            }

            if(!response.ok){
                alert("Não foi possível realizar o seu login 🙁!");
                return;
            }            
        
            const data = await response.json();

            const name = getUserName(data.token);

            dispatch(login({token: data.token, name}));

            navigate('/home');
            
        }catch(error){
            alert(`Erro inesperado 🚫: ${error}`);
        }   
    }

    function handleSubmit(e){
        e.preventDefault();
        if(user === "" || pass === ""){
            alert("Preencha todos os campos de login");
            return;
        }
        submit();
    }

    return (
        <div className={style.login}>
            <form className={style.form}>
                <p className={style.title}>Bem vindo de volta!</p>
                
                <img src={logo} alt='Logo' className={style.logo}></img>

                <div className={style.user}>
                    <p>Nome de usuário</p>
                    <input className={style.field} value={user} onChange={(e) =>{
                        const value = e.target.value;
                        setUser(value);
                    }} type="text"></input>
                </div>

                <div className={style.pass}>
                    <p>Senha</p>
                    <input className={style.field} value={pass} onChange={(e) => {
                        const value = e.target.value;
                        setPass(value);
                    }} type="password"></input>
                </div>
                <button className={style.submit} onClick={handleSubmit} type="submit">Fazer Login</button>
            </form>
        </div>
    )
}

export default Login;