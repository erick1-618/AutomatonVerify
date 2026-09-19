import HomeFeature from "../../components/HomeFeature/HomeFeature";
import Search from "../../components/Search/Search";
import style from "./Home.module.css";
import { useSelector } from "react-redux";

function Home(){

    const name = useSelector(state => state.auth.name);

    return(
        <div className={style.home}>
            <p className={style.title}>Bem vindo de volta, {name}!</p>
            <Search/>
            <HomeFeature name={"Novos títulos"}/>
            <HomeFeature name={"Top Favoritos"}/>
        </div>
    )
}

export default Home;