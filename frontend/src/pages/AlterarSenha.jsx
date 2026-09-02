import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';

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
    <div>
      <h1>Alterar senha</h1>

      <form onSubmit={alterarSenha}>
        <div>
          <label>Senha atual</label>
          <input type="password" value={senhaAtual} onChange={(e) => setSenhaAtual(e.target.value)} required/>
        </div>

        <div>
          <label>Nova senha</label>
          <input type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} required/>
        </div>

        <div>
          <label>Confirmar nova senha</label>
          <input type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} required/>
        </div>
        {erro && <p>{erro}</p>}
        {mensagem && <p>{mensagem}</p>}
        <Button type="submit" label={carregando ? 'Alterando...' : 'Alterar senha'} disabled={carregando}/>
        <Button type="button" label="Voltar" text onClick={() => navigate('/dashboard')}/>
      </form>
    </div>
  );
}

export default AlterarSenha;