import { Link } from 'react-router-dom';
import './style/Login.css';

function Login() {
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

        <form className="login-formulario">
          <label className="login-label" htmlFor="login-nome">
            Nome
          </label>

          <input
            id="login-nome"
            className="login-input"
            type="text"
            placeholder="Digite seu nome..."
          />

          <label className="login-label" htmlFor="login-senha">
            Senha
          </label>

          <input
            id="login-senha"
            className="login-input"
            type="password"
            placeholder="Digite sua senha..."
          />

          <Link to="/esqueceuSenha" className="login-esqueceu-senha">
              Esqueceu a senha
            </Link>

          <button type="submit" className="login-botao">
            ENTRAR
          </button>

          <p className="login-cadastro">
            Não tem uma conta?{' '}

            <Link to="/cadastro" className="login-cadastro-link">
              CADASTRE-SE
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default Login;