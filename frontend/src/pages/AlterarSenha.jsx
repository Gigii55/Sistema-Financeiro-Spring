import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import './style/AlterarSenha.css';
import UsuarioService from '../services/UsuarioService';

function AlterarSenha() {
  
  const navigate = useNavigate();
  const service = new UsuarioService();

  const usuarioSalvo = localStorage.getItem('usuario');
  const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;

  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function alterarSenha(evento) {
    evento.preventDefault();

    setMensagem('');
    setErro('');

    if (novaSenha.length < 6) {
      setErro('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    try {
      setCarregando(true);

      await service.alterarSenha({
        email: usuario.email,
        senhaAtual: senhaAtual,
        novaSenha: novaSenha
      });

      setMensagem('Senha alterada com sucesso!');
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');

    } catch (erro) {
      setErro('Senha atual incorreta.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="alterar-senha-pagina">

      <header className="alterar-senha-cabecalho">
        <h1 className="alterar-senha-boas-vindas"> Segurança da conta</h1>

        <p className="alterar-senha-identificacao"> ALTERE SUA SENHA </p>
      </header>

      <section className="alterar-senha-card">

        <h2 className="alterar-senha-titulo"> Alterar senha</h2>

        <form className="alterar-senha-formulario" onSubmit={alterarSenha}>
          <div className="alterar-senha-campo">
            <label htmlFor="senhaAtual" className="alterar-senha-label"> Senha atual </label>

            <input id="senhaAtual" type="password" className="alterar-senha-input" value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)} placeholder="Digite sua senha atual" required/>
          </div>

          <div className="alterar-senha-campo">
            <label htmlFor="novaSenha" className="alterar-senha-label">Nova senha</label>
            <input id="novaSenha" type="password" className="alterar-senha-input" value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)} placeholder="Digite sua nova senha" required/>
            <small className="alterar-senha-ajuda">A senha deve possuir pelo menos 6 caracteres.</small>
          </div>

          <div className="alterar-senha-campo">
            <label htmlFor="confirmarSenha" className="alterar-senha-label">Confirmar nova senha</label>

            <input id="confirmarSenha" type="password" className="alterar-senha-input" value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)} placeholder="Digite novamente sua nova senha" required/>
          </div>

          {erro && (<p className="alterar-senha-feedback alterar-senha-feedback-erro">{erro}</p>)}
          {mensagem && (<p className="alterar-senha-feedback alterar-senha-feedback-sucesso"> {mensagem}</p>)}
          <div className="alterar-senha-acoes">
            <Button type="submit" label={carregando ? 'Alterando...' : 'Alterar senha'} disabled={carregando} className="alterar-senha-botao"/>
            <Button type="button" label="Voltar" text onClick={() => navigate('/dashboard')} className="alterar-senha-voltar"/>

          </div>

        </form>
      </section>

    </main>
  );
}

export default AlterarSenha;