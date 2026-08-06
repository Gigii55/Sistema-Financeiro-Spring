import { useState } from 'react';
import {
  Link,
  useNavigate,
  useSearchParams
} from 'react-router-dom';

import { validarSenhasIguais } from './js/ValidarSenhasIguais';
import { verificarForcaDaSenha } from './js/VerificarForcaDaSenha';
import { redefinirSenha } from '../configs/RecuperacaoSenhaService';

import './style/Codigo.css';

function Codigo() {
  const [parametros] = useSearchParams();
  const navigate = useNavigate();

  const token = parametros.get('token');

  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
  const [forcaSenha, setForcaSenha] = useState('');
  const [senhasIguais, setSenhasIguais] = useState(null);
  const [mensagem, setMensagem] = useState('');

  const handleNovaSenhaChange = (e) => {
    const senhaDigitada = e.target.value;

    setNovaSenha(senhaDigitada);
    setForcaSenha(verificarForcaDaSenha(senhaDigitada));

    if (confirmarNovaSenha.length > 0) {
      setSenhasIguais(
        validarSenhasIguais(
          senhaDigitada,
          confirmarNovaSenha
        )
      );
    }
  };

  const handleConfirmacaoChange = (e) => {
    const confirmacaoDigitada = e.target.value;

    setConfirmarNovaSenha(confirmacaoDigitada);

    setSenhasIguais(
      validarSenhasIguais(
        novaSenha,
        confirmacaoDigitada
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem('');

    if (!token) {
      setMensagem('Token não encontrado.');
      return;
    }

    if (!senhasIguais) {
      setMensagem('As senhas não coincidem.');
      return;
    }

    try {
      await redefinirSenha(token, novaSenha);

      alert('Senha alterada com sucesso!');
      navigate('/');
    } catch (erro) {
      setMensagem(
        erro.response?.data ||
        'Não foi possível alterar a senha.'
      );
    }
  };

  return (
    <>
      <div className="codigo-cabecalho">
        <h1 className="codigo-boas-vindas">
          CRIE UMA NOVA SENHA
        </h1>

        <h2 className="codigo-identificacao">
          Sistemas de Finanças Astrotech
        </h2>
      </div>

      <div className="codigo-card">
        <p className="codigo-titulo">
          RECUPERAÇÃO DE SENHA
        </p>

        <form
          className="codigo-formulario"
          onSubmit={handleSubmit}
        >
          <p className="codigo-descricao">
            Digite e confirme sua nova senha.
          </p>

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
              value={novaSenha}
              onChange={handleNovaSenhaChange}
              minLength={6}
              required
            />

            {forcaSenha && (
              <span
                className={`codigo-feedback ${
                  forcaSenha === 'Forte'
                    ? 'codigo-feedback-sucesso'
                    : forcaSenha === 'Média'
                      ? 'codigo-feedback-medio'
                      : 'codigo-feedback-erro'
                }`}
              >
                Força da senha: {forcaSenha}
              </span>
            )}
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
              value={confirmarNovaSenha}
              onChange={handleConfirmacaoChange}
              minLength={6}
              required
            />

            {senhasIguais !== null && (
              <span
                className={`codigo-feedback ${
                  senhasIguais
                    ? 'codigo-feedback-sucesso'
                    : 'codigo-feedback-erro'
                }`}
              >
                {senhasIguais
                  ? 'As senhas coincidem'
                  : 'As senhas não coincidem'}
              </span>
            )}
          </div>

          {mensagem && (
            <span className="codigo-feedback codigo-feedback-erro">
              {mensagem}
            </span>
          )}

          <button
            type="submit"
            className="codigo-botao"
            disabled={
              !senhasIguais ||
              novaSenha.length < 6
            }
          >
            ALTERAR SENHA
          </button>

          <p className="codigo-voltar-container">
            Link expirado?{' '}
            <Link
              to="/esqueceuSenha"
              className="codigo-voltar-link"
            >
              SOLICITAR NOVAMENTE
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default Codigo;