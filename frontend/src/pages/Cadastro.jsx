import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { validarSenhasIguais } from './js/ValidarSenhasIguais';
import { verificarForcaDaSenha } from './js/VerificarForcaDaSenha';

import UsuarioService from '../services/UsuarioService';

import './style/Cadastro.css';

const usuarioService = new UsuarioService();

function Cadastro() {

  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [forcaSenha, setForcaSenha] = useState('');
  const [senhasIguais, setSenhasIguais] = useState(null);

  const [mensagem, setMensagem] = useState('');
  const [cadastroRealizado, setCadastroRealizado] =
    useState(false);

  const [carregando, setCarregando] = useState(false);

  const handleSenhaChange = (e) => {
    const novaSenha = e.target.value;

    setSenha(novaSenha);
    setForcaSenha(verificarForcaDaSenha(novaSenha));

    if (confirmarSenha.length > 0) {
      setSenhasIguais(validarSenhasIguais(novaSenha,confirmarSenha));
    }
  };

  const handleConfirmacaoChange = (e) => {
    const novaConfirmacao = e.target.value;

    setConfirmarSenha(novaConfirmacao);

    setSenhasIguais(validarSenhasIguais(senha,novaConfirmacao));
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

 const cadastrarUsuario = async (e) => {
  e.preventDefault();

  setMensagem('');
  setCadastroRealizado(false);

  if (!senhasIguais) {
    setMensagem('As senhas precisam ser iguais.');
    return;
  }

  const usuario = {
    nome: nome,
    email: email,
    senha: senha
  };

  try {
    setCarregando(true);

    const resposta = await usuarioService.inserir(usuario);

    console.log('Usuário cadastrado:', resposta.data);

    setCadastroRealizado(true);
    setMensagem('Cadastro realizado com sucesso!');

    setNome('');
    setEmail('');
    setSenha('');
    setConfirmarSenha('');
    setForcaSenha('');
    setSenhasIguais(null);

    setTimeout(() => {
      navigate('/');
    }, 1500);

  } catch (erro) {
    console.error('Erro ao cadastrar:', erro);

    setCadastroRealizado(false);

    if (erro.response?.status === 400) {
      setMensagem(erro.response.data);
    } else {
      setMensagem('Não foi possível conectar ao backend.');
    }

  } finally {
    setCarregando(false);
  }
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

        <form
          className="cadastro-formulario"
          onSubmit={cadastrarUsuario}
        >
          <div className="cadastro-coluna">
            <div className="cadastro-campo">
              <label className="cadastro-label" htmlFor="cadastro-nome">Nome</label>

              <input id="cadastro-nome" className="cadastro-input" type="text" placeholder="Digite seu nome completo..."
                value={nome} onChange={(e) => setNome(e.target.value)} required/>
            </div>

            <div className="cadastro-campo">

              <label className="cadastro-label" htmlFor="cadastro-email">E-mail</label>

              <input id="cadastro-email" className="cadastro-input" type="email" placeholder="Digite seu e-mail..."
                value={email} onChange={(e) =>setEmail(e.target.value)} required/>
            </div>
          </div>

          <div className="cadastro-coluna">
            <div className="cadastro-campo">
              <label className="cadastro-label" htmlFor="cadastro-senha">Senha</label>

              <input id="cadastro-senha" className="cadastro-input" type="password" placeholder="Crie uma senha..."
               minLength={6} value={senha} onChange={handleSenhaChange} required/>

              {forcaSenha && ( 
                <span className={classeForcaSenha()}>
                  Força da senha: {forcaSenha}
                </span>
              )}
            </div>

            <div className="cadastro-campo">
              <label className="cadastro-label" htmlFor="cadastro-confirmar-senha">
                Confirmar senha
              </label>

              <input id="cadastro-confirmar-senha" className="cadastro-input" type="password"
                placeholder="Confirme sua senha..." value={confirmarSenha} onChange={handleConfirmacaoChange} 
                required/>

              {senhasIguais !== null && (
                <span className={senhasIguais?'cadastro-feedback cadastro-feedback-sucesso':
                'cadastro-feedback cadastro-feedback-erro'}>
                  
                  {senhasIguais?'As senhas coincidem':'As senhas não coincidem'}
                </span>
              )}
            </div>
          </div>

          <button type="submit" className="cadastro-botao" 
          disabled={!senhasIguais || nome.trim() === '' || email.trim() === '' || carregando}>
            {carregando? 'CADASTRANDO...': 'CADASTRAR'}
          </button>

          {mensagem && (
            <span className={cadastroRealizado? 'cadastro-feedback cadastro-feedback-sucesso':
             'cadastro-feedback cadastro-feedback-erro'}>
              {mensagem}
            </span>
          )}

          <p className="cadastro-login-container">
            Já tem uma conta?{' '}

            <Link to="/" className="cadastro-login-link">
              ENTRAR
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default Cadastro;