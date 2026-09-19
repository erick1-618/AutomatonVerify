import style from './User.module.css';
import logo from '../../assets/icons/logotype.png';
import trash from '../../assets/icons/trash.png';
import star from '../../assets/icons/star_cut.png';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Modal from '../../components/Modal/Modal';
import { logout } from '../../redux/authSlice';
import { expire } from '../../redux/expireSlice';
import { API_URL } from '../../services/api';

function User() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [my, setMy] = useState(true);
    const [titles, setTitles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [trigger, setTrigger] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTitle, setSelectedTitle] = useState(null);
    const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const myName = localStorage.getItem("name");
    const { name } = useParams();
    const myPage = myName === name;

    useEffect(() => {
        const token = localStorage.getItem("token");
        const path = myPage ? (my ? `user/name/${name}` : 'favorites') : `user/name/${name}`;
        setLoading(true);
        setErrorMsg('');

        fetch(`${API_URL}/title/${path}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            method: "GET"
        }).then((res) => {
            if (res.status === 403) {
                dispatch(expire());
                return;
            }
            if (!res.ok) {
                return 404;
            }
            return res.json();
        }).then((data) => {
            if (data === 404 || !Array.isArray(data)) {
                setTitles([]);
            } else {
                setTitles(data);
            }
        }).catch((err) => {
            setErrorMsg("Não foi possível carregar os títulos.");
        }).finally(() => {
            setLoading(false);
        });
    }, [my, name, trigger, dispatch, myPage]);

    function handleUnfavorite(id) {
        const token = localStorage.getItem("token");

        fetch(`${API_URL}/title/${id}/favorite`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            if (res.status === 403) dispatch(expire());
            if (!res.ok) throw new Error();
            setTrigger(prev => -prev);
        }).catch((err) => {
            setErrorMsg("Erro ao desfavoritar o título.");
        });
    }

    const acceptDeleteTitle = {
        action: () => {
            if (!selectedTitle) return;
            const token = localStorage.getItem("token");

            fetch(`${API_URL}/title/${selectedTitle.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((res) => {
                if (res.status === 403) dispatch(expire());
                if (!res.ok) throw new Error();
                setTrigger(prev => -prev);
                setIsModalOpen(false);
            }).catch((err) => {
                setErrorMsg("Erro ao excluir o título.");
                setIsModalOpen(false);
            });
        },
        message: "Excluir"
    };

    const rejectDeleteTitle = {
        action: () => setIsModalOpen(false),
        message: "Cancelar"
    };

    const acceptDeleteUser = {
        action: () => {
            const token = localStorage.getItem("token");

            fetch(`${API_URL}/us`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((res) => {
                if (res.status === 403) dispatch(expire());
                if (!res.ok) throw new Error();
                dispatch(logout());
                navigate('/');
            }).catch((err) => {
                setErrorMsg("Erro ao deletar conta.");
                setIsDeleteUserOpen(false);
            });
        },
        message: "Deletar minha conta"
    };

    const rejectDeleteUser = {
        action: () => setIsDeleteUserOpen(false),
        message: "Cancelar"
    };

    return (
        <div className={style.user}>
            <div className={style.box}>
                <div className={style.top}>
                    <img alt='Logo' src={logo} className={style.logo} />
                    <p className={style.username}>@{name}</p>
                </div>

                <div className={style.nav}>
                    {myPage ? (
                        <>
                            <button
                                type="button"
                                onClick={() => setMy(true)}
                                className={my ? style.btnOn : style.btnOff}
                            >
                                Seus títulos
                            </button>
                            <button
                                type="button"
                                onClick={() => setMy(false)}
                                className={my ? style.btnOff : style.btnOn}
                            >
                                Favoritados
                            </button>
                        </>
                    ) : (
                        <p className={style.btn}>Títulos cadastrados</p>
                    )}
                </div>

                {errorMsg && <p className={style.errorMsg}>{errorMsg}</p>}

                <div className={style.titles}>
                    {loading ? (
                        <div className={style.loader}></div>
                    ) : titles.length > 0 ? (
                        titles.map((item) => (
                            <div key={item.id} className={style.titleItem}>
                                <p 
                                    className={style.titleName} 
                                    onClick={() => navigate(`/title/${item.id}`)}
                                    title={item.titleName}
                                >
                                    {item.titleName}
                                </p>
                                {myPage && (
                                    my ? (
                                        <button 
                                            className={style.iconBtn}
                                            onClick={() => {
                                                setSelectedTitle({ id: item.id, name: item.titleName });
                                                setIsModalOpen(true);
                                            }}
                                            title="Excluir título"
                                        >
                                            <img alt='Excluir' src={trash} />
                                        </button>
                                    ) : (
                                        <button 
                                            className={style.iconBtn}
                                            onClick={() => handleUnfavorite(item.id)}
                                            title="Remover dos favoritos"
                                        >
                                            <img alt='Remover favorito' src={star} />
                                        </button>
                                    )
                                )}
                            </div>
                        ))
                    ) : (
                        <div className={style.emptyItem}>
                            <p>{my ? "Sem títulos registrados" : "Nenhum título favorito"}</p>
                        </div>
                    )}
                </div>

                {myPage && (
                    <button 
                        onClick={() => setIsDeleteUserOpen(true)} 
                        className={style.deleteAccount}
                    >
                        Excluir minha conta
                    </button>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                message={selectedTitle ? `Deseja realmente excluir "${selectedTitle.name}"?` : "Deseja realmente excluir o título selecionado?"}
                accept={acceptDeleteTitle}
                reject={rejectDeleteTitle}
            />

            <Modal
                isOpen={isDeleteUserOpen}
                accept={acceptDeleteUser}
                message="Deseja excluir sua conta permanentemente?"
                reject={rejectDeleteUser}
            />
        </div>
    );
}

export default User;