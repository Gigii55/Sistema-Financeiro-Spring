import { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  solicitarRecuperacao
} from '../services/RecuperacaoSenhaService';

import './style/EsqueceuSenha.css';

function EsqueceuSenha() {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMensagem('');
    setCarregando(true);

    try {
      const resposta = await solicitarRecuperacao(email);

      setMensagem(resposta.data);
    }
    catch (erro) {
      console.error(erro);
      setMensagem('Não foi possível solicitar a recuperação.');
    }
    finally {
      setCarregando(false);
    }
  };

  return (
    <>
      <div className="recuperacao-cabecalho">
        <h1 className="recuperacao-boas-vindas">RECUPERE SUA SENHA</h1>
        <h2 className="recuperacao-identificacao">Sistemas de Finanças Astrotech</h2>
      </div>

      <div className="recuperacao-card">
        <p className="recuperacao-titulo">ESQUECEU A SENHA?</p>

        <form className="recuperacao-formulario" onSubmit={handleSubmit}>
          <p className="recuperacao-descricao"> Digite o e-mail cadastrado para receberas instruções de recuperação da sua senha.</p>
          <label className="recuperacao-label" htmlFor="recuperacao-email">E-mail</label>
          <input id="recuperacao-email" className="recuperacao-input" type="email" required
           placeholder="Digite seu e-mail..."value={email} onChange={(e) =>setEmail(e.target.value)}
           disabled={carregando}/>

          {mensagem && (<p className="recuperacao-mensagem">{mensagem}</p>)}

          <button type="submit" className="recuperacao-botao"disabled={carregando}>
             {carregando ? 'ENVIANDO...': 'ENVIAR LINK'}
          </button>

          <p className="recuperacao-voltar-container">Lembrou sua senha?{' '}
            <Link to="/" className="recuperacao-voltar-link">VOLTAR AO LOGIN</Link>
          </p>
        </form>
      </div>
    </>
  );
}


export default EsqueceuSenha;