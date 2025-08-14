import { useParams } from "react-router-dom";
import style from './Title.module.css';
import logo from '../../assets/icons/logotype.png';
import starE from '../../assets/icons/star_e.png'
import starF from '../../assets/icons/star_f.png'
import { useEffect, useState } from "react";
import loadingGif from '../../assets/loading.gif'
import { useDispatch } from "react-redux";
import { expire } from "../../redux/expireSlice";

function Title(){

    const {id} = useParams();

    const dispatch = useDispatch()

    const [title, setTitle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [result, setResult] = useState(null);
    const [resultLoading, setResultLoading] = useState(false);
    const [resultError, setResultError] = useState(false);
    const [resultBoolean, setResultBoolean] = useState(false);

    useEffect(() => {

        const token = localStorage.getItem("token")

        fetch(`http://localhost:8080/title/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            method: "GET"
        }).then((res) => {
            if(res.status === 403){
                dispatch(expire())
                throw new Error("Seção expirou")
            }
            return res.json()})
        .then(data => {
            setTitle(data);
            setLoading(false);
        }).catch((err) => {
            setLoading(false);
            setError(true);
        })
    }, [id, dispatch])

    function handleFavorite() {

        const token = localStorage.getItem("token");

        const method = title.favorited ? "DELETE" : "POST";

        fetch(`http://localhost:8080/title/${id}/favorite`, {
                method: method,
                headers: {
                    Authorization: `Bearer ${token}`
                }
        }).then((res) => {
            if(res.status === 403){
                dispatch(expire())
                throw new Error('Seção expirou')
            } 
           return res.json()})
        .then(data => {
            setTitle(data);
        }).catch((err) => {
        })
    }

    function handleSubmit(){
        
        const token = localStorage.getItem("token");
        const file = document.getElementById("file").files[0];
        
        if(!file){
            alert("Selecione um arquivo para validação ❗");
            return;
        }

        setResultLoading(true);

        const formData = new FormData();

        formData.append('file', file);

        fetch(`http://localhost:8080/title/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData,
            method: "POST"
        })
        .then((res) => {
            if(res.status === 403){
                dispatch(expire())
                throw new Error('Seção expirou')
            }
            return res.json()})
        .then((data) => {
            const hashResult = data.message[0];
            const resultBool = hashResult === "true";
            setResult(hashResult);
            setResultBoolean(resultBool)
        }).catch((err) => {
            setResultError(true);
        }).finally(() => {
            setResultLoading(false)
        })
    }

    if(loading) return <p>Carregando...</p>
    if(error) return <p style={{flex: 1, alignItems: "center"}}>Erro ao carregar título</p>

    return (
        
        <div className={style.title}>
            <img src={logo} alt="Logo" className={style.logo}></img>
            <div className={style.wrapper}>   
                <div className={style.box}>
                    <div className={style.info}>
                        <p>{title.titleName}</p>
                        <p>/{title.author}</p>
                    </div>
                    <div className={style.extrainfo}>
                        <p>Criado em: {title.creationDate.substring(0, 10).replaceAll('-', '/')}</p>
                        <div className={style.fav}>
                            <p>{title.favoriteCount}</p>
                            <img alt="star" src={title.favorited ? starF : starE} className={style.star} onClick={handleFavorite}></img>
                        </div>
                    </div>
                    <div className={style.description}>
                        <p className={style.descName}>Descrição</p>
                        <p className={style.descContent}>{title.titleDescription}</p>
                    </div>
                    <div className={style.integrity}>
                        <p>Verifique a integridade</p>
                        <input id="file" className={style.file} type="file" onChange={() => {
                            setResult(null);
                            setResultLoading(false);
                            setResultError(false);
                        }} ></input>
                        <button className={style.btn} onClick={handleSubmit}>Verificar</button>
                    </div>
                    {   resultLoading ? <img alt='loading' src={loadingGif} className={style.loader}></img> : 
                        result ? 
                        resultBoolean ?
                        <p className={`${style.result} ${style.ok}`}>Integridade Verificada</p>
                        : <p className={`${style.result} ${style.fail}`}>Integridade Comprometida</p> :
                        resultError && <p></p>
                    }
                </div>
            </div>
        </div>
    )
}

export default Title;