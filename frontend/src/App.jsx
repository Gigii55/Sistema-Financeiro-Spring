import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Cadastro from './pages/Cadastro.jsx';
import Codigo from './pages/Codigo.jsx';
import EsqueceuSenha from './pages/EsqueceuSenha.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AlterarSenha from './pages/AlterarSenha';
import Transacoes from './pages/Transacoes.jsx';
import RotaProtegida from './components/RotaProtegida';
import Categorias from './pages/Categorias.jsx';
import Carteiras from './pages/Carteiras.jsx';


function App() {
  return (
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/cadastro" element={<Cadastro />} />
    <Route path="/esqueceuSenha" element={<EsqueceuSenha />} />
    <Route path="/codigo" element={<Codigo />} />
    <Route path="/dashboard" element={<RotaProtegida><Dashboard /></RotaProtegida>} />
     <Route path="/app/perfil/senha" element={<RotaProtegida><AlterarSenha /></RotaProtegida>} />
     <Route path="transacoes" element={<RotaProtegida><Transacoes /></RotaProtegida>} />
     <Route path="/categorias" element={<RotaProtegida><Categorias /></RotaProtegida>} />
     <Route path="/carteiras" element={<RotaProtegida><Carteiras /></RotaProtegida>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App;