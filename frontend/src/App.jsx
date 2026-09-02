import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Cadastro from './pages/Cadastro.jsx';
import Codigo from './pages/Codigo.jsx';
import EsqueceuSenha from './pages/EsqueceuSenha.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AlterarSenha from './pages/AlterarSenha';

function App() {
  return (
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/cadastro" element={<Cadastro />} />
    <Route path="/esqueceuSenha" element={<EsqueceuSenha />} />
    <Route path="/codigo" element={<Codigo />} />
    <Route path="/dashboard" element={<Dashboard />} />
     <Route path="/app/perfil/senha" element={<AlterarSenha />} />

    </Routes>
    </BrowserRouter>
  )
}

export default App;