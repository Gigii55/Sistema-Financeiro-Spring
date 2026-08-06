import { useState } from 'react';
import { Link } from 'react-router-dom';
import './style/EsqueceuSenha.css';

function EsqueceuSenha() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Recuperar senha para:', email);
  };

  return (
    <>
      <div className="recuperacao-cabecalho">
        <h1 className="recuperacao-boas-vindas"> RECUPERE SUA SENHA</h1>
        <h2 className="recuperacao-identificacao"> Sistemas de Finanças Astrotech</h2>
      </div>

      <div className="recuperacao-card">
        <p className="recuperacao-titulo">ESQUECEU A SENHA?</p>

        <form className="recuperacao-formulario" onSubmit={handleSubmit}>
          <p className="recuperacao-descricao">
            Digite o e-mail cadastrado para receber as instruções
            de recuperação da sua senha.
          </p>

          <label className="recuperacao-label" htmlFor="recuperacao-email"> E-mail</label>

          <input id="recuperacao-email" className="recuperacao-input" type="email" placeholder="Digite seu e-mail..."
           value={email} onChange={(e) => setEmail(e.target.value)}required/>

        <Link to="/codigo" className="recuperacao-botao">ENVIAR CÓDIGO</Link>

          <p className="recuperacao-voltar-container">
            Lembrou sua senha?{' '}
            <Link to="/"  className="recuperacao-voltar-link">
              VOLTAR AO LOGIN
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default EsqueceuSenha;