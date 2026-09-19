import style from './Search.module.css';
import SearchBar from '../../components/Search/Search';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import TitleSearch from '../../components/Search/TitleSearch';
import { useDispatch } from 'react-redux';
import { expire } from '../../redux/expireSlice';
import { API_URL } from '../../services/api';

function Search() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [titles, setTitles] = useState([]);
    const [hasNext, setHasNext] = useState(false);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    const location = useLocation();
    const params = new URLSearchParams(location.search);

    const query = params.get('q') || '';
    const page = parseInt(params.get('p') || '0', 10);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setLoading(true);
        setErrorMsg('');

        fetch(`${API_URL}/title/search/name?query=${encodeURIComponent(query)}&page=${page}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((res) => {
            if (res.status === 403) {
                dispatch(expire());
                return;
            }
            if (!res.ok && res.status !== 404) {
                throw new Error("Erro ao buscar os títulos");
            }
            if (res.status === 404) {
                return 404;
            }
            return res.json();
        }).then((data) => {
            if (data && data !== 404) {
                setTitles(data[0] || []);
                setHasNext(Boolean(data[1]));
            } else {
                setTitles([]);
                setHasNext(false);
            }
        }).catch((err) => {
            setErrorMsg("Não foi possível carregar os resultados da busca.");
        }).finally(() => {
            setLoading(false);
        });
    }, [query, page, dispatch]);

    return (
        <div className={style.search}>
            <SearchBar />

            <div className={style.content}>
                <p className={style.query}>
                    Resultados para: <span>"{query}"</span>
                </p>

                {errorMsg && <p className={style.errorMsg}>{errorMsg}</p>}

                {loading ? (
                    <div className={style.loader}></div>
                ) : titles.length > 0 ? (
                    <div className={style.list}>
                        {titles.map((item) => (
                            <TitleSearch 
                                key={item.id} 
                                id={item.id} 
                                name={item.titleName} 
                                author={item.author} 
                            />
                        ))}
                    </div>
                ) : (
                    !errorMsg && <p className={style.empty}>Nenhum título encontrado com este termo.</p>
                )}

                <div className={style.navButtons}>
                    {page > 0 && (
                        <button 
                            className={style.pageBtn} 
                            onClick={() => navigate(`/search?q=${encodeURIComponent(query)}&p=${page - 1}`)}
                        >
                            &larr; Anterior
                        </button>
                    )}
                    {hasNext && (
                        <button 
                            className={style.pageBtn} 
                            onClick={() => navigate(`/search?q=${encodeURIComponent(query)}&p=${page + 1}`)}
                        >
                            Próximo &rarr;
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Search;