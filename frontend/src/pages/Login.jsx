import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  alternarVisibilidadeSenha,
  definirTextoBotao,
  definirTipoSenha
} from './js/MostrarSenha';
import { realizarLogin } from './js/RealizarLogin';
import './style/Login.css';

function Login() {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formulario = new FormData(e.currentTarget);

    const nome = formulario.get('nome');
    const senha = formulario.get('senha');

    setCarregando(true);

    try {
      await realizarLogin(nome, senha);

      console.log('Login realizado com sucesso');
    } catch (erro) {
      console.error(erro.message);
    } finally {
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

        <form
          className="login-formulario"
          onSubmit={handleSubmit}
        >
          <label
            className="login-label"
            htmlFor="login-nome"
          >
            Email
          </label>

          <input
            id="login-nome"
            name="nome"
            className="login-input"
            type="text"
            placeholder="Digite seu email..."
            type="email"
            required
            disabled={carregando}
          />

          <label
            className="login-label"
            htmlFor="login-senha"
          >
            Senha
          </label>

          <div className="login-senha-container">
            <input
              id="login-senha"
              name="senha"
              className="login-input"
              type={definirTipoSenha(mostrarSenha)}
              placeholder="Digite sua senha..."
              required
              disabled={carregando}
            />

            <button
              type="button"
              className="login-mostrar-senha"
              onClick={() =>
                setMostrarSenha((valorAtual) =>
                  alternarVisibilidadeSenha(valorAtual)
                )
              }
            >
              {definirTextoBotao(mostrarSenha)}
            </button>
          </div>

          <Link
            to="/esqueceuSenha"
            className="login-esqueceu-senha"
          >
            Esqueceu a senha
          </Link>

          <button
            type="submit"
            className="login-botao"
            disabled={carregando}
          >
            {carregando ? 'ENTRANDO...' : 'ENTRAR'}
          </button>

          <p className="login-cadastro">
            Não tem uma conta?{' '}

            <Link
              to="/cadastro"
              className="login-cadastro-link"
            >
              CADASTRE-SE
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default Login;