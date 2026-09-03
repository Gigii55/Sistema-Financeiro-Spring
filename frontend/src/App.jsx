import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Cadastro from './pages/Cadastro.jsx';
import Codigo from './pages/Codigo.jsx';
import EsqueceuSenha from './pages/EsqueceuSenha.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AlterarSenha from './pages/AlterarSenha';
import Transacoes from './pages/Transacoes.jsx';
import RotaProtegida from './components/RotaProtegida';

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
    </Routes>
    </BrowserRouter>
  )
}

export default App;