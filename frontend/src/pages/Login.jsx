import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UsuarioService from '../services/UsuarioService';
import {alternarVisibilidadeSenha, definirTextoBotao,definirTipoSenha} from './js/MostrarSenha';

import { realizarLogin } from './js/RealizarLogin';

import './style/Login.css';


function Login() {
  
  const navigate = useNavigate();

  
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');

  useEffect(() => {
  const usuario = localStorage.getItem('usuario');

  if (usuario) {
    navigate('/dashboard');
  }
}, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMensagemErro('');

    const formulario = new FormData(e.currentTarget);

    const email = formulario.get('email');
    const senha = formulario.get('senha');

    setCarregando(true);

    try {
      const resposta = await realizarLogin(email, senha);

  localStorage.setItem('usuario',JSON.stringify(resposta.data));

  navigate('/dashboard');
}
    catch (erro) {
      console.error(erro);

      if (erro.response?.status === 401) {
        setMensagemErro('E-mail ou senha inválidos.');
      }
      else {
        setMensagemErro('Não foi possível conectar ao backend.');
      }
    } 
    finally {
      setCarregando(false);
    }
  };


  return (
    <>
      <div className="login-cabecalho">
        <h1 className="login-boas-vindas">
          SEJA BEM-VINDO!
        </h1>

        <h2 className="login-identificacao">
          Sistemas de Finanças Astrotech
        </h2>
      </div>

      <div className="login-card">
        <p className="login-titulo">
          LOGIN
        </p>

        <form className="login-formulario" onSubmit={handleSubmit}>
          <label className="login-label" htmlFor="login-email">Email</label>

          <input id="login-email" name="email" className="login-input" type="email"
            placeholder="Digite seu email..." required disabled={carregando}/>

          <label className="login-label" htmlFor="login-senha">Senha</label>

          <div className="login-senha-container">
            <input id="login-senha" name="senha" className="login-input" type={definirTipoSenha(mostrarSenha)}
              placeholder="Digite sua senha..." required minLength={6} disabled={carregando}/>
            <button type="button" className="login-mostrar-senha" onClick={() => setMostrarSenha((valorAtual) => alternarVisibilidadeSenha(valorAtual))}>
              {definirTextoBotao(mostrarSenha)}
            </button>
          </div>

          {mensagemErro && (<span className="login-erro"> {mensagemErro}</span>)}

          <Link to="/esqueceuSenha" className="login-esqueceu-senha">Esqueceu a senha</Link>

          <button type="submit" className="login-botao" disabled={carregando}>{carregando ? 'ENTRANDO...' : 'ENTRAR'}</button>

          <p className="login-cadastro"> Não tem uma conta?{' '}<Link to="/cadastro" className="login-cadastro-link"> CADASTRE-SE</Link></p>
        </form>
      </div>
    </>
  );
}

export default Login;