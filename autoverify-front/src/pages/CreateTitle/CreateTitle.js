import style from './CreateTitle.module.css';
import logotype from '../../assets/icons/logotype.png'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import loadingGif from '../../assets/loading2.gif'
import { useDispatch } from 'react-redux';
import { expire } from '../../redux/expireSlice';
import { API_URL } from '../../services/api';

function CreateTitle() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    function handleSubmit() {

        const token = localStorage.getItem("token");        
        const fileInput = document.getElementById("file");
        const file = fileInput ? fileInput.files[0] : null;

        if(!name.trim() || !desc.trim()){
            setErrorMsg("Por favor, preencha o nome e a descrição do título.");
            return;
        }

        if(!file) {
            setErrorMsg("Por favor, selecione o arquivo para gerar o hash.");
            return;
        }

        if (file.size > 50 * 1024 * 1024) {
            setErrorMsg("Arquivo muito grande! Tamanho máximo permitido: 50MB");
            return;
        }

        setErrorMsg('');
        setLoading(true);

        const details = {titleName: name.trim(), titleDescription: desc.trim()};

        const formData = new FormData();
        formData.append("file", file);
        formData.append("details", new Blob(
            [JSON.stringify(details)],
            { type: "application/json" }
        ));

        fetch(`${API_URL}/title`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData
        }).then((res) => {
            if(res.status === 413){
                throw new Error("Tamanho máximo de arquivo excedido (50MB)");
            }
            if(res.status === 403){
                dispatch(expire())
                throw new Error("Sessão expirou. Faça login novamente.");
            }
            if(!res.ok){
                throw new Error("Erro ao criar o título");
            }
            return res.json();
        }).then((data) => {
            navigate(`/title/${data.id}`);
        }).catch((err) => {
            setErrorMsg(err.message || "Erro inesperado ao criar título");
            setLoading(false);
        });
    }

    return (
        <div className={style.createTitle}>
            <div className={style.wrapper}>
                <div className={style.box}>
                    <div className={style.headerRow}>
                        <img src={logotype} alt='Logo' className={style.logo}></img>
                        <p className={style.title}>Criar Título</p>
                    </div>

                    {errorMsg && <p className={style.errorMsg}>{errorMsg}</p>}

                    <div className={style.field}>
                        <label className={style.label}>Nome do título</label>
                        <input 
                            className={style.input} 
                            type="text" 
                            placeholder="Ex: MinhaAplicacao-v1.0"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setErrorMsg('');
                            }}
                            disabled={loading}
                        />
                    </div>

                    <div className={style.field}>
                        <label className={style.label}>Descrição</label>
                        <textarea 
                            className={style.textarea} 
                            rows={4}
                            placeholder="Descreva as propriedades do software ou observações..."
                            value={desc}
                            onChange={(e) => {
                                setDesc(e.target.value);
                                setErrorMsg('');
                            }}
                            disabled={loading}
                        />
                    </div>

                    <div className={style.field}>
                        <label className={style.label}>Arquivo (Máximo 50MB)</label>
                        <input 
                            id='file' 
                            className={style.file} 
                            type="file" 
                            disabled={loading}
                            onChange={() => setErrorMsg('')}
                        />
                    </div>

                    <div className={style.actionArea}>
                        {loading ? (
                            <div className={style.loaderBox}>
                                <img alt='loading' src={loadingGif} className={style.loader}></img>
                                <p className={style.loadingText}>Processando autômato e enviando...</p>
                            </div>
                        ) : (
                            <button className={style.button} onClick={handleSubmit}>Criar</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateTitle;