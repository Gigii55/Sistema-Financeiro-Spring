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
      setSenhasIguais(validarSenhasIguais(novaSenha, confirmarSenha));
    }
  };

  const handleConfirmacaoChange = (e) => {
    const novaConfirmacao = e.target.value;
    setConfirmarSenha(novaConfirmacao);
    
    setSenhasIguais(validarSenhasIguais(senha, novaConfirmacao));
  };

  return (
    <>
      <div>
        <h1 className="welcome">CADASTRE-SE!</h1>
        <h1 className="sistem-identification">Sistemas de Financas Astrotech</h1>
      </div>
      
      <div className="form-div"> 
        <p className="register-title">CADASTRO</p>
        
        <form className="form">
          <p className="label-input">Nome</p>
          <input className="input" type="text" placeholder="Digite seu nome completo..." />

          <p className="label-input">E-mail</p>
          <input className="input" type="email" placeholder="Digite seu e-mail..." />
          
          <p className="label-input">Senha</p>
          <input className="input" type="password" placeholder="Crie uma senha..." value={senha} onChange={handleSenhaChange}/>
          {forcaSenha && (
            <span style={{ color: forcaSenha === 'Forte' ? 'green' : forcaSenha === 'Média' ? 'orange' : 'red', fontSize: '12px', display: 'block' }}>
              Força da senha: {forcaSenha} 
            </span>
          )}

          <p className="label-input">Confirmar Senha</p>
          <input className="input" type="password" placeholder="Confirme sua senha..." value={confirmarSenha} onChange={handleConfirmacaoChange}/>
          {senhasIguais !== null && (
            <span style={{ color: senhasIguais ? 'green' : 'red', fontSize: '12px', display: 'block' }}>
              {senhasIguais ? 'As senhas coincidem' : 'As senhas não coincidem'}
            </span>
          )}
          
          <button type="submit" className="btn-register" disabled={!senhasIguais || senha.length === 0}>
            CADASTRAR
          </button>
          
          <p className="login-link-container">
            Já tem uma conta?
            <Link to="/" className="login-link">ENTRAR</Link>
          </p>
        </form>
      </div>
    </>
  )
}

export default Cadastro;