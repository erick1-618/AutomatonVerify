import styles from './Header.module.css';
import createIcon from '../../assets/icons/create.png';
import userIcon from '../../assets/icons/user.png';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, login } from '../../redux/authSlice';
import { useEffect} from 'react';

function Header() {

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const name = useSelector(state => state.auth.name);

  useEffect(() => {
    const savedName = localStorage.getItem('name');
    const token = localStorage.getItem('token');
    if(savedName && !name){
      dispatch(login({token: token, name: savedName}));
    }
  }, [name, dispatch])

  return (

    <header className={styles.header}>
      {!name ? (
        <>
        <p className={styles.cad} onClick={() => navigate('/register')}>Cadastro</p>
        <div className={styles.rightGroup} onClick={() => navigate('/login')}>
          <p className={styles.log}>Login</p>
          <img src={userIcon} alt="User" className={styles.userIcon} />
        </div>
        </>): (
      <>
        <p className={styles.cad} onClick={() => {navigate('/home')}}>Página Inicial</p>

        <div className={styles.rightGroup}>
          <p className={styles.profile} onClick={() => navigate(`/user/${name}`)}>{name}</p>
          <img src={createIcon} onClick={() => navigate('/title/create')} alt="Create" className={styles.createButton}></img>
          <p className={styles.exit} onClick={() => {
              dispatch(logout());
              navigate('/')
          }} >Sair</p>
        </div>
      </>
        )
      }
    </header>
  );
}

export default Header;