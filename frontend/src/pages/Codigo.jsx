import { Link } from 'react-router-dom';
import './style/Codigo.css';

function Codigo() {
  return (
    <>
      <div className="codigo-cabecalho">
        <h1 className="codigo-boas-vindas">
          VERIFIQUE SEU E-MAIL
        </h1>

        <h2 className="codigo-identificacao">
          Sistemas de Finanças Astrotech
        </h2>
      </div>

      <div className="codigo-card">
        <p className="codigo-titulo">
          RECUPERAÇÃO DE SENHA
        </p>

        <form className="codigo-formulario">
          <p className="codigo-descricao">
            Digite o código recebido no seu e-mail e crie uma nova senha.
          </p>

          <div className="codigo-campo">
            <label
              className="codigo-label"
              htmlFor="codigo"
            >
              Código
            </label>

            <input
              id="codigo"
              className="codigo-input"
              type="text"
              inputMode="numeric"
              placeholder="Digite o código..."
              maxLength={6}
              required
            />
          </div>

          <div className="codigo-campo">
            <label
              className="codigo-label"
              htmlFor="nova-senha"
            >
              Nova senha
            </label>

            <input
              id="nova-senha"
              className="codigo-input"
              type="password"
              placeholder="Digite sua nova senha..."
              required
            />
          </div>

          <div className="codigo-campo">
            <label
              className="codigo-label"
              htmlFor="confirmar-nova-senha"
            >
              Confirmar nova senha
            </label>

            <input
              id="confirmar-nova-senha"
              className="codigo-input"
              type="password"
              placeholder="Confirme sua nova senha..."
              required
            />
          </div>

          <button
            type="submit"
            className="codigo-botao"
          >
            ALTERAR SENHA
          </button>

          <p className="codigo-voltar-container">
            Não recebeu o código?{' '}

            <Link
              to="/esqueceuSenha"
              className="codigo-voltar-link"
            >
              VOLTAR
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default Codigo;