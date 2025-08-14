import { useNavigate } from "react-router-dom";
import style from "./HomeTitle.module.css"

function HomeTitle({author, name, id}){

    const navigate = useNavigate();

    return ( 
        <div className={style.homeTitle}>
            <p className={style.author} onClick={
                (e) => {
                    navigate(`/user/${author}`)
                }
            }>{author}</p>
            <p className={style.name} onClick={
                (e) => {
                    navigate(`/title/${id}`)
                }
            }>{name}</p>
        </div>
    )
}

export default HomeTitle;