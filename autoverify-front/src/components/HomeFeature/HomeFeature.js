import HomeTitle from "./HomeTitle";
import style from "./HomeFeature.module.css";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { expire } from "../../redux/expireSlice";

function HomeFeature({name}) {

    const dispatch = useDispatch();

    const [titles, setTitles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const titlesForFetch = name === "Novos títulos" ? "newests" : "topfavorites";

    useEffect(() => {
        
        const token = localStorage.getItem("token");
        
        fetch(`http://localhost:8080/title/${titlesForFetch}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            method: "GET"
        }).then((res) => {
            if(res.status === 403){
                dispatch(expire())
            }
            if(!res.ok) {
                throw new Error("Erro na requisição");
            } 
            return res.json();
        }).then((data) => {
            setTitles(data);
            setLoading(false);
        }).catch((err) => {
            setError(err);
            setLoading(false);
        });
    }, [dispatch, titlesForFetch])

    if(loading) return <p>Carregando...</p>;
    if(error) return <p>{`Erro ao carregar os títulos ${error}`}</p>

    return (
        <div className={style.homeFeature}>
            <p className={style.name}>{name}</p>
            <div className={style.box}>
                {titles && titles.map((t, i) => (
                    <HomeTitle key={t.id} id={t.id} author={t.author} name={t.titleName}/>
                ))}
            </div>
        </div>
    )
}

export default HomeFeature;