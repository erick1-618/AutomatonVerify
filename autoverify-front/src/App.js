import {Routes, Route, useNavigate} from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Begin from './pages/Begin/Begin';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Title from './pages/Title/Title';
import CreateTitle from './pages/CreateTitle/CreateTitle';
import Search from './pages/Search/Search';
import User from './pages/User/User';
import Modal from './components/Modal/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './redux/authSlice';
import { reset } from './redux/expireSlice';

function App() {

  const navigator = useNavigate();  

  const dispatch = useDispatch()

  const expired = useSelector(state => state.expired.expired)

  const accept = {
    action: () => {
      dispatch(logout())
      dispatch(reset())
      navigator('/login')
    },
    message: 'Voltar a tela de login'
  }

  const reject = {
    action: () => {
      dispatch(logout())
      dispatch(reset())
      navigator('/')
    },
    message: 'Voltar a tela de início'
  }

  return (
    <main>
      <Header/>
        <Routes>
          <Route path="/" element={<Begin/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path='/title/:id' element={<Title/>}/>
          <Route path='/title/create' element={<CreateTitle/>}/>
          <Route path='/search' element={<Search/>}/>
          <Route path='/user/:name' element={<User/>}/>
        </Routes>
      <Footer/>

      <Modal isOpen={expired} accept={accept} message={"Sua sessão expirou, faça login novamente para continuar"} reject={reject}></Modal>
    </main>
  );
}

export default App;
