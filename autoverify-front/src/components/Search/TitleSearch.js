import { useNavigate } from 'react-router-dom';
import style from './TitleSearch.module.css'
import { useState } from 'react';

function TitleSearch({id, name, author}){

    const navigate = useNavigate();

    return (
        <div className={style.titleSearch}>
            <p onClick={() => navigate(`/title/${id}`)}>{name}</p>
            <p onClick={() => navigate(`/user/${author}`)}>/{author}</p>
        </div>
    )
}

export default TitleSearch;