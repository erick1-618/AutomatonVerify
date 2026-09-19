import { useState } from 'react';
import lupe from '../../assets/icons/lupe.png'
import style from './Search.module.css'
import { useNavigate } from 'react-router-dom';

function Search(){

    const navigate = useNavigate();

    const [search, setSearch] = useState('');

    const [byName, setByName] = useState(true);

    function searchTitle(){

        const trimmed = search.trim();

        if(!trimmed) return;

        navigate(`/search?q=${search}&p=0`)
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') {
        e.preventDefault();
        searchTitle();
        }
    }

    return (
        <div className={style.search}>
            <p className={style.text}>Pesquisar títulos:</p>
            <div className={style.bar}>
                <input className={style.input} value={search} onKeyDown={handleKeyDown} onChange={(e) => {
                    setSearch(e.target.value)
                }} type="text"></input>
                <img className={style.logo} alt='Lupe' src={lupe} onClick={searchTitle}></img>
            </div>
        </div>
    )
}

export default Search;