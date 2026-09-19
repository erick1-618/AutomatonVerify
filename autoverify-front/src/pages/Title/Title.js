import { useParams, useNavigate } from "react-router-dom";
import style from './Title.module.css';
import logo from '../../assets/icons/logotype.png';
import starE from '../../assets/icons/star_e.png';
import starF from '../../assets/icons/star_f.png';
import { useEffect, useState } from "react";
import loadingGif from '../../assets/loading.gif';
import { useDispatch } from "react-redux";
import { expire } from "../../redux/expireSlice";
import { API_URL } from "../../services/api";

function formatFileSize(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function Title() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [title, setTitle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [selectedFile, setSelectedFile] = useState(null);
    const [result, setResult] = useState(null);
    const [resultLoading, setResultLoading] = useState(false);
    const [resultError, setResultError] = useState(false);
    const [resultBoolean, setResultBoolean] = useState(false);
    const [fileError, setFileError] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }

        fetch(`${API_URL}/title/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            method: "GET"
        }).then((res) => {
            if (res.status === 403) {
                dispatch(expire());
                throw new Error("Sessão expirou");
            }
            return res.json();
        }).then(data => {
            setTitle(data);
            setLoading(false);
        }).catch((err) => {
            setLoading(false);
            setError(true);
        });
    }, [id, dispatch]);

    function handleFavorite() {
        const token = localStorage.getItem("token");
        const method = title.favorited ? "DELETE" : "POST";

        fetch(`${API_URL}/title/${id}/favorite`, {
            method: method,
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((res) => {
            if (res.status === 403) {
                dispatch(expire());
                throw new Error('Sessão expirou');
            }
            return res.json();
        }).then(data => {
            setTitle(data);
        }).catch((err) => {
        });
    }

    function handleFileChange(e) {
        const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
        setSelectedFile(file);
        setResult(null);
        setResultLoading(false);
        setResultError(false);
        setFileError('');
    }

    function handleCopyLink() {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }

    function handleSubmit() {
        const token = localStorage.getItem("token");

        if (!selectedFile) {
            setFileError("Por favor, selecione um arquivo para validação!");
            return;
        }

        setFileError('');
        setResultLoading(true);

        const formData = new FormData();
        formData.append('file', selectedFile);

        fetch(`${API_URL}/title/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData,
            method: "POST"
        }).then((res) => {
            if (res.status === 403) {
                dispatch(expire());
                throw new Error('Sessão expirou');
            }
            return res.json();
        }).then((data) => {
            const hashResult = data.message[0];
            const resultBool = hashResult === "true";
            setResult(hashResult);
            setResultBoolean(resultBool);
        }).catch((err) => {
            setResultError(true);
        }).finally(() => {
            setResultLoading(false);
        });
    }

    if (loading) return (
        <div className={style.centerMsg}>
            <img alt="Carregando..." src={loadingGif} className={style.loader} />
            <p>Carregando título...</p>
        </div>
    );

    if (error || !title) return (
        <div className={style.centerMsg}>
            <p>Erro ao carregar o título solicitado.</p>
            <button className={style.btnBack} onClick={() => navigate('/home')}>Voltar à página inicial</button>
        </div>
    );

    return (
        <div className={style.title}>
            <div className={style.wrapper}>
                <div className={style.box}>
                    <div className={style.topBrandRow}>
                        <img src={logo} alt="Logo" className={style.logo} />
                        <div className={style.info}>
                            <div className={style.titleLeft}>
                                <p className={style.titleHeading}>{title.titleName}</p>
                                <button 
                                    type="button" 
                                    className={style.shareBtn} 
                                    onClick={handleCopyLink}
                                    title="Copiar link para compartilhamento"
                                >
                                    {copied ? "✓ Copiado!" : "🔗 Copiar link"}
                                </button>
                            </div>
                            <p className={style.authorHeading} onClick={() => navigate(`/user/${title.author}`)}>
                                @{title.author}
                            </p>
                        </div>
                    </div>

                    <div className={style.extrainfo}>
                        <p>Criado em: {title.creationDate ? title.creationDate.substring(0, 10).replaceAll('-', '/') : ''}</p>
                        <div className={style.fav}>
                            <p>{title.favoriteCount}</p>
                            <img alt="star" src={title.favorited ? starF : starE} className={style.star} onClick={handleFavorite} />
                        </div>
                    </div>

                    <div className={style.description}>
                        <p className={style.descName}>Descrição</p>
                        <p className={style.descContent}>{title.titleDescription}</p>
                    </div>

                    <div className={style.integrity}>
                        <p className={style.integrityTitle}>Verifique a integridade</p>
                        
                        <div className={style.fileWrapper}>
                            <input 
                                id="file" 
                                className={style.file} 
                                type="file" 
                                onChange={handleFileChange}
                                disabled={resultLoading}
                            />
                        </div>

                        {selectedFile && (
                            <div className={style.selectedFileBadge}>
                                <span className={style.fileName}>📄 {selectedFile.name}</span>
                                <span className={style.fileSize}>({formatFileSize(selectedFile.size)})</span>
                            </div>
                        )}

                        {fileError && <p className={style.fileErrorMsg}>{fileError}</p>}

                        <button className={style.btn} onClick={handleSubmit} disabled={resultLoading}>
                            {resultLoading ? 'Verificando...' : 'Verificar'}
                        </button>
                    </div>

                    {resultLoading && (
                        <div className={style.loaderBox}>
                            <img alt='loading' src={loadingGif} className={style.loader} />
                            <p className={style.calculatingText}>Calculando hash por autômatos celulares...</p>
                        </div>
                    )}

                    {!resultLoading && result && (
                        resultBoolean ?
                        <p className={`${style.result} ${style.ok}`}>✓ Integridade Verificada</p>
                        : <p className={`${style.result} ${style.fail}`}>✗ Integridade Comprometida</p>
                    )}

                    {resultError && !resultLoading && (
                        <p className={`${style.result} ${style.fail}`}>Erro ao processar verificação</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Title;