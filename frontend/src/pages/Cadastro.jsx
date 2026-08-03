import { useState } from 'react';
import { Link } from 'react-router-dom';

import { validarSenhasIguais } from './js/ValidarSenhasIguais';
import { verificarForcaDaSenha } from './js/VerificarForcaDaSenha';

import './style/Cadastro.css';

function Cadastro() {
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [forcaSenha, setForcaSenha] = useState('');
  const [senhasIguais, setSenhasIguais] = useState(null);

  const handleSenhaChange = (e) => {
    const novaSenha = e.target.value;

    setSenha(novaSenha);
    setForcaSenha(verificarForcaDaSenha(novaSenha));

    if (confirmarSenha.length > 0) {
      setSenhasIguais(
        validarSenhasIguais(novaSenha, confirmarSenha)
      );
    }
  };

  const handleConfirmacaoChange = (e) => {
    const novaConfirmacao = e.target.value;

    setConfirmarSenha(novaConfirmacao);
    setSenhasIguais(
      validarSenhasIguais(senha, novaConfirmacao)
    );
  };

  const classeForcaSenha = () => {
    if (forcaSenha === 'Forte') {
      return 'cadastro-feedback cadastro-feedback-sucesso';
    }

    if (forcaSenha === 'Média') {
      return 'cadastro-feedback cadastro-feedback-medio';
    }

    return 'cadastro-feedback cadastro-feedback-erro';
  };

  return (
    <>
      <div className="cadastro-cabecalho">
        <h1 className="cadastro-boas-vindas">
          CADASTRE-SE!
        </h1>

        <h2 className="cadastro-identificacao">
          Sistemas de Finanças Astrotech
        </h2>
      </div>

      <div className="cadastro-card">
        <p className="cadastro-titulo">
          CADASTRO
        </p>

        <form className="cadastro-formulario">
   
          <div className="cadastro-coluna">
            <div className="cadastro-campo">
              <label
                className="cadastro-label"
                htmlFor="cadastro-nome"
              >
                Nome
              </label>

              <input
                id="cadastro-nome"
                className="cadastro-input"
                type="text"
                placeholder="Digite seu nome completo..."
              />
            </div>

            <div className="cadastro-campo">
              <label
                className="cadastro-label"
                htmlFor="cadastro-email"
              >
                E-mail
              </label>

              <input
                id="cadastro-email"
                className="cadastro-input"
                type="email"
                placeholder="Digite seu e-mail..."
              />
            </div>
          </div>

          <div className="cadastro-coluna">
            <div className="cadastro-campo">
              <label
                className="cadastro-label"
                htmlFor="cadastro-senha"
              >
                Senha
              </label>

              <input
                id="cadastro-senha"
                className="cadastro-input"
                type="password"
                placeholder="Crie uma senha..."
                value={senha}
                onChange={handleSenhaChange}
              />

              {forcaSenha && (
                <span className={classeForcaSenha()}>
                  Força da senha: {forcaSenha}
                </span>
              )}
            </div>

            <div className="cadastro-campo">
              <label
                className="cadastro-label"
                htmlFor="cadastro-confirmar-senha"
              >
                Confirmar senha
              </label>

              <input
                id="cadastro-confirmar-senha"
                className="cadastro-input"
                type="password"
                placeholder="Confirme sua senha..."
                value={confirmarSenha}
                onChange={handleConfirmacaoChange}
              />

              {senhasIguais !== null && (
                <span
                  className={
                    senhasIguais
                      ? 'cadastro-feedback cadastro-feedback-sucesso'
                      : 'cadastro-feedback cadastro-feedback-erro'
                  }
                >
                  {senhasIguais
                    ? 'As senhas coincidem'
                    : 'As senhas não coincidem'}
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="cadastro-botao"
            disabled={!senhasIguais || senha.length === 0}
          >
            CADASTRAR
          </button>

          <p className="cadastro-login-container">
            Já tem uma conta?{' '}

            <Link
              to="/"
              className="cadastro-login-link"
            >
              ENTRAR
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default Cadastro;