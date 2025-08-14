import style from './Search.module.css';
import SearchBar from '../../components/Search/Search';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import TitleSearch from '../../components/Search/TitleSearch';
import { useDispatch } from 'react-redux';
import { expire } from '../../redux/expireSlice';

function Search() {

    const navigate = useNavigate();

    const dispatch = useDispatch()

    const [titles, setTitles] = useState([]);
    const [hasNext, setHasNext] = useState(false);
    const [loading, setLoading] = useState(true);

    const location = useLocation();

    const params = new URLSearchParams(location.search);

    const query = params.get('q');
    const page = params.get('p');

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch(`http://localhost:8080/title/search/name?query=${query}&page=${page}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((res) => {
            if(res.status === 403){
                dispatch(expire())
            }
            if(!res.ok && res.status !== 404){
                throw new Error("Erro ao buscar os títulos");
            }
            if(res.status === 404){
                return 404;
            }
            return res.json();
        }).then((data) => {
            if(data !== 404) {
                setTitles(data[0]);
                setHasNext(data[1]);
            } else {
                setTitles([]);
            }
        }).catch((err) => {
            alert('Erro ao buscar títulos')
        }).finally(() => {
            setLoading(false);
        })
    }, [query, page, dispatch])

    return (
        <div className={style.search}>

            <SearchBar/>

            <p className={style.query}>Mostrando resultados para: {query}</p>
            {loading ? <div className={style.loader}></div> : titles.length !== 0 ? 
                <>

                    {titles.map((item) => (
                        <TitleSearch id={item.id} name={item.titleName} author={item.author}/>
                    ))}
                </> : <p>Nenhum título encontrado</p>
            }

            <div className={style.navButtons}>
                {page > 0 && <p onClick={() => navigate(`/search?q=${query}&p=${parseInt(page) - 1}`)}>anterior</p>}
                {hasNext && <p onClick={() => navigate(`/search?q=${query}&p=${parseInt(page) + 1}`)}>próximo</p>}
            </div>

        </div>
    )
}

export default Search;