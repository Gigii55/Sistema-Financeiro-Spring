
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';

import api from '../configs/axiosConfig';
import CarteiraServices from '../services/CarteiraServices';
import ConviteCarteiraServices from '../services/ConviteCarteiraServices';

import './style/Carteiras.css';

const carteiraService = new CarteiraServices();
const conviteService = new ConviteCarteiraServices();

export default function Carteiras() {

  const navigate = useNavigate();

  const usuarioSalvo = localStorage.getItem('usuario');
  const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
  const usuarioId = usuario?.id;

  const [carteiras, setCarteiras] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const [exibirModal, setExibirModal] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');
  const [formData, setFormData] = useState({ nome: '',descricao: ''});
  const [convites, setConvites] = useState([]);
  const [carregandoConvites, setCarregandoConvites] = useState(false);
  const [modalNotificacoes, setModalNotificacoes] = useState(false);
  const [processandoConvite, setProcessandoConvite] = useState(null);
  const [erroNotificacoes, setErroNotificacoes] = useState('');

  const [modalMembros, setModalMembros] = useState(false);
  const [carteiraAtual, setCarteiraAtual] = useState(null);
  const [membros, setMembros] = useState([]);
  const [carregandoMembros, setCarregandoMembros] = useState(false);
  const [emailConvite, setEmailConvite] = useState('');
  const [enviandoConvite, setEnviandoConvite] = useState(false);
  const [erroMembros, setErroMembros] = useState('');
  const [mensagemConvite, setMensagemConvite] = useState('');

  
useEffect(() => {
  if (!usuarioId) {
    navigate('/');
    return;
  }

  carregarCarteiras();
  carregarConvites();

  const conexao = new EventSource('http://localhost:8080/eventos', {withCredentials: true});

  const atualizarConvites = () => {
    carregarConvites();
  };

  const atualizarCarteiras = () => {
    carregarCarteiras();
  };

  conexao.addEventListener('convite-atualizado', atualizarConvites);
  conexao.addEventListener('carteira-atualizada', atualizarCarteiras);

  return () => {
    conexao.removeEventListener('convite-atualizado', atualizarConvites);
    conexao.removeEventListener('carteira-atualizada', atualizarCarteiras);
    conexao.close();
  };

}, [navigate, usuarioId]);


  async function carregarConvites() {
    try {
      const resposta = await conviteService.buscarPendentes();

      setConvites(resposta.data);
      setErroNotificacoes('');

    } catch (error) {
      console.error('Erro ao carregar convites:', error);
      setErroNotificacoes('Não foi possível consultar os convites.');
    }
  }

  useEffect(() => {
    if (!usuarioId) {
      navigate('/');
      return;
    }

    carregarCarteiras();
    carregarConvites();

    const intervalo = setInterval(() => {carregarConvites();}, 30000);

    return () => clearInterval(intervalo);

  }, [navigate, usuarioId]);

  function voltarPagina() {
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  }

  function abrirModal() {
    setMensagemErro('');
    setFormData({ nome: '', descricao: '' });
    setExibirModal(true);
  }

  function fecharModal() {
    if (salvando) return;

    setExibirModal(false);
    setMensagemErro('');
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((anterior) => ({...anterior,[name]: value}));
  }


async function carregarCarteiras() {
  try {
    setCarregando(true);
    setErro('');

    const resposta = await carteiraService.buscarTodos();
    setCarteiras(resposta.data);

  } catch (error) {
    console.error('Erro ao buscar carteiras:', error);
    setErro('Não foi possível carregar suas carteiras.');

  } finally {
    setCarregando(false);
  }
}

async function carregarConvites() {
  try {
    const resposta = await conviteService.buscarPendentes();

    setConvites(resposta.data);
    setErroNotificacoes('');

  } catch (error) {
    console.error('Erro ao carregar convites:', error);
    setErroNotificacoes('Não foi possível consultar os convites.');
  }
}


  async function criarCarteira(e) {
    e.preventDefault();

    setMensagemErro('');
    setSalvando(true);

    const payload = { nome: formData.nome.trim(), descricao: formData.descricao.trim(), dono: { id: usuarioId }};

    try {
      await carteiraService.inserir(payload);

      setExibirModal(false);
      setFormData({ nome: '', descricao: '' });

      await carregarCarteiras();

    } catch (error) {
      console.error('Erro ao criar carteira:', error);

      setMensagemErro(error.response?.data?.message || 'Não foi possível criar a carteira.');

    } finally {
      setSalvando(false);
    }
  }

  async function excluirCarteira(id) {
    const confirmar = window.confirm('Tem certeza que deseja excluir esta carteira? As transações vinculadas a ela poderão ser afetadas.');

    if (!confirmar) return;

    try {
      setErro('');

      await carteiraService.remover(id);
      await carregarCarteiras();

    } catch (error) {
      console.error('Erro ao excluir carteira:', error);
      setErro('Não foi possível excluir a carteira.');
    }
  }

  async function abrirNotificacoes() {
    setErroNotificacoes('');
    setModalNotificacoes(true);
    setCarregandoConvites(true);

    try {
      await carregarConvites();
    } finally {
      setCarregandoConvites(false);
    }
  }

  async function responderConvite(conviteId, aceitar) {
    if (processandoConvite !== null) return;

    try {
      setProcessandoConvite(conviteId);
      setErroNotificacoes('');

      if (aceitar) {
        await conviteService.aceitar(conviteId);
      } else {
        await conviteService.recusar(conviteId);
      }

      setConvites((anteriores) =>anteriores.filter((convite) => convite.id !== conviteId));

      await carregarConvites();

      if (aceitar) {
        await carregarCarteiras();
      }

    } catch (error) {
      console.error('Erro ao responder convite:', error);
      setErroNotificacoes(error.response?.data?.message ||'Não foi possível responder ao convite.');

    } finally {
      setProcessandoConvite(null);
    }
  }

  async function abrirMembros(carteira) {
    setCarteiraAtual(carteira);
    setMembros([]);
    setEmailConvite('');
    setErroMembros('');
    setMensagemConvite('');
    setModalMembros(true);
    setCarregandoMembros(true);

    try {
      const resposta = await api.get(`/carteira-membros/carteira/${carteira.id}`);

      setMembros(resposta.data);

    } catch (error) {
      console.error('Erro ao carregar membros:', error);
      setErroMembros('Não foi possível carregar os membros da carteira.');

    } finally {
      setCarregandoMembros(false);
    }
  }

  async function enviarConvite(e) {
    e.preventDefault();

    if (!carteiraAtual || !emailConvite.trim()) return;

    try {
      setEnviandoConvite(true);
      setErroMembros('');
      setMensagemConvite('');

      await conviteService.enviar(
        carteiraAtual.id,
        emailConvite.trim()
      );

      setEmailConvite('');
      setMensagemConvite('Convite enviado com sucesso!');

    } catch (error) {
      console.error('Erro ao enviar convite:', error);

      setErroMembros(error.response?.data?.message ||'Não foi possível enviar o convite.');

    } finally {
      setEnviandoConvite(false);
    }
  }

  function fecharMembros() {
    if (enviandoConvite) return;

    setModalMembros(false);
    setCarteiraAtual(null);
    setMembros([]);
    setEmailConvite('');
    setErroMembros('');
    setMensagemConvite('');
  }

  function formatarData(data) {
    if (!data) return 'Data não informada';
    return new Date(data).toLocaleDateString('pt-BR', {timeZone: 'UTC'});
  }

  return (

    <div className="carteiras-pagina">
      <button type="button" className="carteiras-voltar" onClick={voltarPagina}>
        <i className="pi pi-arrow-left" />Voltar
      </button>

      <div className="carteiras-container">

        <header className="carteiras-topo">
          <span className="carteiras-kicker">CONTROLE FINANCEIRO</span>
          <h1>Minhas carteiras</h1>
          <p> Organize e gerencie seus espaços financeiros.</p>
        </header>

        <div className="carteiras-barra">

          <div className="carteiras-contador">
            <i className="pi pi-wallet" />
            <span>{carregando? 'Carregando...': `${carteiras.length} ${ carteiras.length === 1? 'carteira cadastrada' : 'carteiras cadastradas'}`}
            </span>
          </div>

          <button type="button" className="carteiras-sininho" onClick={abrirNotificacoes} title="Notificações"
            aria-label={convites.length > 0? `${convites.length} convites pendentes`: 'Notificações'}>
            <i className="pi pi-bell" />
            {convites.length > 0 && (<span className="carteiras-notificacao-bolinha" />)}
          </button>

        </div>

        {erro && (<div className="carteiras-erro">{erro}</div>)}

        {carregando ? (
          <div className="carteiras-vazio">
            <i className="pi pi-spin pi-spinner" />
            <p>Carregando suas carteiras...</p>
          </div>) : carteiras.length === 0 && !erro ? (

          <div className="carteiras-vazio">
            <div className="carteiras-vazio-icone">
              <i className="pi pi-wallet" />
            </div>

            <h2>Nenhuma carteira cadastrada</h2>

            <p> Crie sua primeira carteira para começar a organizar suas finanças. </p>

            <button type="button" className="carteiras-botao-novo" onClick={abrirModal}>
              <i className="pi pi-plus" />Criar primeira carteira
            </button>
          </div>) : (

          <div className="carteiras-grade">
            {carteiras.map((carteira) => (<article key={carteira.id}className="carteiras-cartao">

                <div className="carteiras-cartao-icone">
                  <i className="pi pi-wallet" />
                </div>

                <div className="carteiras-cartao-conteudo">
                  <h2>{carteira.nome}</h2>
                  <p>{carteira.descricao || 'Sem descrição cadastrada.'}</p>
                </div>

                <div className="carteiras-cartao-data">
                  <i className="pi pi-calendar" />
                  <span>Criada em {formatarData(carteira.criadoEm)} </span>
                </div>

                <div className="carteiras-cartao-footer">
                  <button type="button" className="carteiras-botao-membros" onClick={() => abrirMembros(carteira)}>
                    <i className="pi pi-users" />Membros
                  </button>

                  {Number(carteira.dono?.id) === Number(usuarioId) && (
                    <button type="button" className="carteiras-botao-excluir" onClick={() => excluirCarteira(carteira.id)} aria-label={`Excluir ${carteira.nome}`}
                      title="Excluir carteira">
                      <i className="pi pi-trash" />
                    </button>)}
                </div>
              </article>
            ))}

            <button type="button" className="carteiras-cartao-adicionar" onClick={abrirModal}>
              <span className="carteiras-adicionar-icone">
                <i className="pi pi-plus" />
              </span>
              <strong>Nova carteira</strong>
              <span> Clique para criar um novo espaço financeiro. </span>
            </button>

          </div>
        )}
      </div>

      <Dialog header="Nova carteira" visible={exibirModal} onHide={fecharModal} closable={!salvando} modal
        style={{ width: 'min(450px, 95vw)' }}>

        <form className="carteiras-modal-form" onSubmit={criarCarteira}>
          <p className="carteiras-modal-descricao"> Dê um nome à sua carteira para organizar suas movimentações financeiras.</p>

          <div className="carteiras-modal-campo">
            <label htmlFor="nome-carteira"> Nome da carteira</label>

            <input id="nome-carteira" type="text" name="nome" value={formData.nome} onChange={handleChange}
              placeholder="Ex.: Viagem de formatura" maxLength={100} required disabled={salvando}/>
          </div>

          <div className="carteiras-modal-campo">
            <label htmlFor="descricao-carteira">Descrição (opcional)</label>
            <textarea id="descricao-carteira" name="descricao" value={formData.descricao} onChange={handleChange}
              placeholder="Ex.: Economias para a viagem" maxLength={250} rows={3} disabled={salvando}/>
          </div>

          {mensagemErro && (<div className="carteiras-modal-erro">{mensagemErro}</div>)}

          <div className="carteiras-modal-acoes">

            <button type="button" className="carteiras-modal-cancelar" onClick={fecharModal}disabled={salvando}>
              Cancelar
            </button>

            <button type="submit" className="carteiras-modal-salvar" disabled={salvando}>
              {salvando ? ('Salvando...') : (<> <i className="pi pi-check" />Criar carteira </>)}
            </button>

          </div>
        </form>
      </Dialog>

      <Dialog header="Notificações" visible={modalNotificacoes} onHide={() => setModalNotificacoes(false)} modal style={{ width: 'min(500px, 95vw)' }}>
        <div className="carteiras-notificacoes">

          {erroNotificacoes && (<div className="carteiras-erro"> {erroNotificacoes}</div>)}

          {carregandoConvites ? (

            <div className="carteiras-notificacoes-vazio">
              <i className="pi pi-spin pi-spinner" />
              <p>Carregando notificações...</p>
            </div>) : convites.length === 0 ? (

            <div className="carteiras-notificacoes-vazio">
              <i className="pi pi-bell" />
              <p> Nenhum convite pendente no momento.</p>
            </div>) : (

            convites.map((convite) => (
              <div key={convite.id} className="carteiras-convite">

                <div className="carteiras-convite-icone">
                  <i className="pi pi-wallet" />
                </div>

                <div className="carteiras-convite-conteudo">

                  <strong>{convite.carteira?.nome || 'Carteira compartilhada'}</strong>

                  <p>{convite.remetente?.nome || 'Um usuário'}{' '}convidou você para participar desta carteira.</p>
                  <div className="carteiras-convite-acoes">
                    <button type="button" className="carteiras-convite-aceitar" disabled={processandoConvite !== null}
                      onClick={() => responderConvite(convite.id, true)}>
                      <i className="pi pi-check" /> Aceitar
                    </button>

                    <button type="button" className="carteiras-convite-recusar" disabled={processandoConvite !== null}
                      onClick={() => responderConvite(convite.id, false)}>
                      <i className="pi pi-times" />Recusar
                    </button>

                  </div>
                </div>
              </div>
            ))

          )}
        </div>
      </Dialog>

      <Dialog header={carteiraAtual?.nome || 'Membros da carteira'} visible={modalMembros} onHide={fecharMembros} closable={!enviandoConvite}
        modal style={{ width: 'min(500px, 95vw)' }}>
        <div className="carteiras-notificacoes">

          {erroMembros && (<div className="carteiras-erro">{erroMembros}</div>)}

          <h3 className="carteiras-modal-titulo">Membros da carteira</h3>

          {carregandoMembros ? (
            <div className="carteiras-notificacoes-vazio">
              <i className="pi pi-spin pi-spinner" />
              <p>Carregando membros...</p>
            </div>) : membros.length === 0 ? (

            <p className="carteiras-sem-membros">Nenhum membro encontrado.</p>

          ) : (

            membros.map((membro) => (
              <div key={membro.id} className="carteiras-membro">
                <div>
                  <strong> {membro.usuario?.nome || 'Usuário'}</strong>
                  <small>{membro.usuario?.email || ''}</small>
                </div>
                <span> {membro.papel} </span>
              </div>
            ))

          )}

          {Number(carteiraAtual?.dono?.id) === Number(usuarioId) && (
            <form className="carteiras-modal-form" onSubmit={enviarConvite}>
              <h3 className="carteiras-modal-titulo">Convidar usuário</h3>
              <div className="carteiras-modal-campo">
                <label htmlFor="email-convite"> E-mail do convidado </label>
                <input id="email-convite" type="email" value={emailConvite} onChange={(e) => setEmailConvite(e.target.value)}
                  placeholder="email@exemplo.com" required disabled={enviandoConvite}/>
              </div>

              {mensagemConvite && (<div className="carteiras-mensagem-sucesso"> {mensagemConvite}</div>)}

              <button type="submit" className="carteiras-modal-salvar" disabled={enviandoConvite}>
                <i className="pi pi-send" /> {enviandoConvite ? 'Enviando...' : 'Enviar convite'}
              </button>

            </form>
          )}
        </div>
      </Dialog>

    </div>
  );
}
