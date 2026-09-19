import { useNavigate } from 'react-router-dom';
import style from './TitleSearch.module.css';

function TitleSearch({ id, name, author }) {
    const navigate = useNavigate();

    return (
        <div className={style.titleSearch}>
            <p className={style.name} onClick={() => navigate(`/title/${id}`)} title={name}>
                {name}
            </p>
            <p className={style.author} onClick={() => navigate(`/user/${author}`)} title={`@${author}`}>
                @{author}
            </p>
        </div>
    );
}

export default TitleSearch;