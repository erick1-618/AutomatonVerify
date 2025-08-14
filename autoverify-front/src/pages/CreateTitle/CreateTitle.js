import style from './CreateTitle.module.css';
import createImg from '../../assets/icons/create.png'
import logotype from '../../assets/icons/logotype.png'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import loadingGif from '../../assets/loading2.gif'
import { useDispatch } from 'react-redux';
import { expire } from '../../redux/expireSlice';

function CreateTitle() {

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    function handleSubmit() {

        const token = localStorage.getItem("token");        

        const file = document.getElementById("file").files[0];

        if (file.size > 50 * 1024 * 1024) { // maior que 5MB
            alert("Arquivo muito grande! Máximo de 50MB");
            return;
        }

        if(name === '' || desc === ''){
            alert("Preencha todos os campos obrigatórios");
            return;
        }

        if(!file) {
            alert("Selecione o arquivo para criar o seu título");
            return
        }

        setLoading(true)

        const details = {titleName: name, titleDescription: desc};

        const formData = new FormData();
        formData.append("file", file);
        formData.append("details", new Blob(
            [JSON.stringify(details)],
            { type: "application/json" }
        ));

        fetch("http://localhost:8080/title", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData
        }).then((res) => {
            if(res.status === 413){
                throw new Error("Tamanho máximo: 50MB")
            }
            if(res.status === 403){
                dispatch(expire())
            }
            setResult(res.status);
        }).catch(err => alert(err.message)).finally(() => {
            setLoading(false)
        });
    }

    if(result) return ( 
        <div className={style.itemWrapper}>
            {result === 200 ?
            <>
                <div className={style.msgWrapper}>
                    <p className={style.msg}>Título criado com sucesso!</p>
                    <img alt='logo' className={style.logotype} src={logotype}></img>
                </div>
            </>
            : 
            <p className={style.result}>Já existe um título com este conteúdo!</p>
            }
        <button onClick={() => navigate('/home')} className={style.backBtn}>Voltar para a página inicial</button>
        </div>
    )

    if(loading) return (
        <div className={style.itemWrapper}>
            <p className={style.boxName}>Criando título...</p>
            <img alt='loading' src={loadingGif} className={style.loader}></img>
        </div>)

    return (
        <div className={style.page}>
            <img className={style.logo} alt="logo" src={createImg}></img>
            <div className={style.wrapper}>
                <div className={style.box}>

                    <p className={style.boxName}>Criação de Títulos</p>

                    <div className={style.field}>
                        <p className={style.fieldName}>Nome (Máximo de 50 caracteres)</p>
                        <textarea value={name} onChange={(e) => {
                            const value = e.target.value;
                            if(value.length < 50) setName(value);
                        }} className={style.fieldContent}></textarea>
                    </div>

                    <div className={style.field}>
                        <p className={style.fieldName}>Decrição (Máximo de 400 caracteres)</p>
                        <textarea value={desc} onChange={(e) => {
                            const value = e.target.value;
                            if(value.length < 400) setDesc(value);
                        }} className={style.desc}></textarea>
                    </div>

                    <input id='file' type='file' className={style.file}></input>

                    <button onClick={handleSubmit} className={style.btn}>Criar título</button>
                </div>
            </div>
        </div>
    )
}

export default CreateTitle;