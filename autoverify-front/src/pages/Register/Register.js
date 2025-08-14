import style from "./Register.module.css"
import { useState } from "react";
import { useNavigate } from "react-router-dom"

function Register() {

    const navigate = useNavigate()

    async function createUser(user){
        try{
            const response = await fetch("http://localhost:8080/auth/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(user)
            });

            const data = await response.json();
            
            if(data.statusCode === "OK"){
                alert("Usuário cadastrado com sucesso 🥳!\nVocê será redirecionado para a página de login!")
                navigate('/login')
            } 

            if(data.statusCode === "BAD_REQUEST"){
                alert("Esse nome já está em uso 🫤");
            }

        } catch(error){
            alert(`Erro inesperado: ${error}`);
        }   
    }

    const nameRegex = "^[A-Za-z][A-Za-z0-9_]{4,20}$";

    const passRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,30}$";

    const [name, setName] = useState('')

    const [nameError, setNameError] = useState(false);

    const [pass, setPassword] = useState('')

    const [passError, setPassError] = useState(false);

    const [passConfirm, setPassConfirm] = useState('');

    const [confirmError, setConfirmError] = useState(false);

    function handleSubmit(e){
        e.preventDefault();

        if(nameError || passError || confirmError) return;

        const user = {
            userName: name,
            password: pass
        }

        createUser(user)
    }

    function handleFieldChange(field, setter, regex){
        setter(!field.match(regex));
    }

    function handlePassConfirm(value){
        setConfirmError(value !== pass);
    }

    return (
        <div className={style.register}>
            <form className={style.form}>
                <p className={style.title}>Crie a sua conta para utilizar o AutomatonVerify</p>
                
                <div className={style.user}>
                    <p>Insira um nome de usuário</p>
                    <input className={style.field} value={name} onChange={(e) => {
                        const value = e.target.value;
                        setName(value);
                        handleFieldChange(value, setNameError, nameRegex);}} type="text"></input>
                    {nameError && <p className={style.fieldError}>{"De 4 à 20 caracteres, números letras e '_'"}</p>}
                </div>

                <div className={style.pass}>
                    <p>Insira uma senha</p>
                    <input className={style.field} value={pass} onChange={(e) => {
                        const value = e.target.value;
                        setPassword(value);
                        handleFieldChange(value, setPassError, passRegex);}} type="password"></input>
                    {passError && <p className={style.fieldError}>{"Min de 8 caracs, alfanumericos e símbolos"}</p>}
                </div>

                <div className={style.passconfirm}>
                    <p>Confirme a sua senha</p>
                    <input className={style.field} value={passConfirm} onChange={(e) => {
                        const value = e.target.value;
                        setPassConfirm(value);
                        handlePassConfirm(value);}} type="password"></input>
                    {confirmError && <p className={style.fieldError}>{"As senhas não coincidem"}</p>}
                </div>

                <button type="submit" className={style.submit} onClick={handleSubmit} >Realizar cadastro</button>
            </form>
        </div>
    )
}

export default Register;