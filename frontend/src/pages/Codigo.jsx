import { useState } from 'react';
import { Link } from 'react-router-dom';

import { validarSenhasIguais } from './js/ValidarSenhasIguais';
import { verificarForcaDaSenha } from './js/VerificarForcaDaSenha';

import './style/Codigo.css';

function Codigo() {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');

  const [forcaSenha, setForcaSenha] = useState('');
  const [senhasIguais, setSenhasIguais] = useState(null);

  const handleNovaSenhaChange = (e) => {
    const senhaDigitada = e.target.value;

    setNovaSenha(senhaDigitada);
    setForcaSenha(verificarForcaDaSenha(senhaDigitada));

    if (confirmarNovaSenha.length > 0) {
      setSenhasIguais(validarSenhasIguais(senhaDigitada, confirmarNovaSenha));
    }
  };

  const handleConfirmacaoChange = (e) => {
    const confirmacaoDigitada = e.target.value;

    setConfirmarNovaSenha(confirmacaoDigitada);

    setSenhasIguais(validarSenhasIguais(novaSenha, confirmacaoDigitada));
  };

  return (
    <>
      <div className="codigo-cabecalho">
        <h1 className="codigo-boas-vindas">VERIFIQUE SEU E-MAIL</h1>

        <h2 className="codigo-identificacao">Sistemas de Finanças Astrotech</h2>
      </div>

      <div className="codigo-card">
        <p className="codigo-titulo">RECUPERAÇÃO DE SENHA</p>

        <form className="codigo-formulario">
          <p className="codigo-descricao">Digite o código recebido no seu e-mail e crie uma nova senha.</p>

          <div className="codigo-campo">
            <label className="codigo-label" htmlFor="codigo">Código</label>

            <input id="codigo" className="codigo-input" type="text" inputMode="numeric" placeholder="Digite o código..."
              maxLength={6}required/>
          </div>

          <div className="codigo-campo">
            <label className="codigo-label" htmlFor="nova-senha">Nova senha</label>

            <input id="nova-senha" className="codigo-input" type="password" placeholder="Digite sua nova senha..."
              value={novaSenha} onChange={handleNovaSenhaChange} minLength={6} required/>

            {forcaSenha && (
              <span className={`codigo-feedback ${forcaSenha === 'Forte' ? 'codigo-feedback-sucesso': forcaSenha === 'Média' ? 'codigo-feedback-medio' : 'codigo-feedback-erro'}`}>
                Força da senha: {forcaSenha}
              </span>
            )}
          </div>

          <div className="codigo-campo">
            <label className="codigo-label" htmlFor="confirmar-nova-senha">Confirmar nova senha</label>

            <input id="confirmar-nova-senha" className="codigo-input" type="password" placeholder="Confirme sua nova senha..."
              value={confirmarNovaSenha} onChange={handleConfirmacaoChange} minLength={6} required/>

            {senhasIguais !== null && (
              <span className={`codigo-feedback ${senhasIguais ? 'codigo-feedback-sucesso' : 'codigo-feedback-erro'}`}>
                {senhasIguais ? 'As senhas coincidem': 'As senhas não coincidem'}
              </span>
            )}
          </div>

          <button type="submit" className="codigo-botao" disabled={!senhasIguais || novaSenha.length < 6}>ALTERAR SENHA</button>

          <p className="codigo-voltar-container">
            Não recebeu o código?{' '}
            <Link to="/esqueceuSenha" className="codigo-voltar-link">VOLTAR</Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default Codigo;