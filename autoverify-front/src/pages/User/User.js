import style from './User.module.css';
import logo from '../../assets/icons/logotype.png'
import trash from '../../assets/icons/trash.png'
import star from '../../assets/icons/star_cut.png'
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {useDispatch} from 'react-redux'
import Modal from '../../components/Modal/Modal';
import {logout} from '../../redux/authSlice'
import { expire } from '../../redux/expireSlice';

function User() {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const [my, setMy] = useState(true);
    const [titles, setTitles] = useState();
    const [trigger, setTrigger] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTitle, setSelectedTitle] = useState(null);
    const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(null);

    const myName = localStorage.getItem("name")

    const {name} = useParams(); 

    const myPage = myName === name;

    useEffect(() => {

        const token = localStorage.getItem("token");
        const path = myPage ? my ? `user/name/${name}` : 'favorites' : `user/name/${name}`;

        fetch(`http://localhost:8080/title/${path}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            method: "GET"
        }).then((res) => {
            if(res.status === 403){
                dispatch(expire())
            }
            if(!res.ok){
                return 404;
            }
            return res.json();
        }).then((data) => {
            setTitles(data);
        }).catch((err) => {
            alert("Erro ao buscar títulos")
        })
    }, [my, name, trigger, dispatch, myPage])

    function handleUnfavorite(id) {
        const token = localStorage.getItem("token");

        fetch(`http://localhost:8080/title/${id}/favorite`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
        }).then(res => () => {
            if(res.status === 403) dispatch(expire())
            if(!res.ok) throw new Error();
        })
        .catch((err) => {
            alert("Erro ao desfavoritar o título");
        }).finally(() => setTrigger(-trigger))
    }

    const accept = {
        action: () => {
            const token = localStorage.getItem("token");

            fetch(`http://localhost:8080/title/${selectedTitle.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((res) => {
                if(res.status === 403) dispatch(expire())
                if(!res.ok) throw new Error();
            }).catch((err) => {
                alert("Erro ao deletar o título")
            }).finally(() => {
                setTrigger(-trigger);
                setIsModalOpen(false);
            })
        },
        message: "Excluir"
    }

    const reject = {
        action: () => {
            setIsModalOpen(false);
        },
        message: "Cancelar"
    }

    const acceptDeleteUser = {
        action: () => {
            const token = localStorage.getItem("token");

            fetch(`http://localhost:8080/us`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((res) => {
                if(res.status === 403) dispatch(expire())
                if(!res.ok) throw new Error();
                dispatch(logout())
                navigate('/')
            }).catch((err) => {
            })
        },
        message: "Deletar minha conta"
    }

    const rejectDeleteUser = {
        action: () => {
            setIsDeleteUserOpen(false);
        },
        message: "Cancelar"
    }

    return (
        <div className={style.user}>
            <div className={style.box}>
                <div className={style.top}>
                    <img alt='logo' src={logo} className={style.logo}></img>
                    <p>/{name}</p>
                </div>

                <div className={style.nav}>
                    {myPage ? <>
                        <p onClick={() => {
                        if(!my) setMy(true);
                    }} className={my ? style.btnOn : style.btnOff}>Seus títulos</p>
                    <p onClick={() => {
                        if(my) setMy(false);
                    }} className={my ? style.btnOff : style.btnOn}>Favoritados</p>
                    </>
                    : <p className={style.btn}>Títulos cadastrados</p>}
                </div> 
                <div className={style.titles}>
                        {titles && titles !== 404 && titles.map((item) => (
                            <div className={style.title}>
                                <p onClick={() => navigate(`/title/${item.id}`)}>{item.titleName}</p>
                                {myPage && (my ? <img alt='trash' onClick={() => {
                                    setSelectedTitle({id: item.id, name: item.titleName})
                                    setIsModalOpen(true)
                                }} src={trash}></img> :
                                <img alt='fav' onClick={() => handleUnfavorite(item.id)} src={star}></img>)}
                            </div>
                        ))}

                        {titles && titles === 404 && 
                        <div className={style.title}>
                            <p>{my ? "Sem títulos registrados" : "Nenhum título favorito"}</p>
                        </div>}
                </div>
                {myPage && <button onClick={() => setIsDeleteUserOpen(true)} className={style.deleteAccount}>Excluir minha conta</button>}
            </div>


            <Modal isOpen={isModalOpen} message={`Deseja realmente excluir o título selecionado?`} accept={accept} reject={reject}>
            </Modal>

            <Modal isOpen={isDeleteUserOpen} accept={acceptDeleteUser} message={"Deseja excluir sua conta permanetemente?"} reject={rejectDeleteUser}></Modal>

        </div>
    )
}

export default User;