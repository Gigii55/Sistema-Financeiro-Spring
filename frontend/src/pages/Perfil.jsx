
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';

import UsuarioService from '../services/UsuarioService';
import CarteiraServices from '../services/CarteiraServices';
import TransacaoService from '../services/TransacaoService';

import { calcularResumo } from './js/dashBoardCalculos';
import { formatarMoeda } from './js/formatadores';

import './style/Perfil.css';

const usuarioService = new UsuarioService();
const carteiraService = new CarteiraServices();
const transacaoService = new TransacaoService();

function Perfil() {

  const navigate = useNavigate();

  const usuarioSalvo = localStorage.getItem('usuario');
  const usuarioLocal = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
  const usuarioId = usuarioLocal?.id;

  const [usuario, setUsuario] = useState(usuarioLocal);
  const [carteiras, setCarteiras] = useState([]);
  const [transacoes, setTransacoes] = useState([]);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const [modalNome, setModalNome] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [erroNome, setErroNome] = useState('');

  useEffect(() => {
    if (!usuarioId) {
      navigate('/');
      return;
    }

    async function carregarDados() {
      try {
        setCarregando(true);
        setErro('');

        const [resUsuario, resCarteiras, resTransacoes] = await Promise.all([
          usuarioService.buscarPorId(usuarioId),
          carteiraService.buscarTodos(),
          transacaoService.buscarTodos()
        ]);

        setUsuario(resUsuario.data);
        setCarteiras(resCarteiras.data);
        setTransacoes(resTransacoes.data);

      } catch (erro) {
        console.error('Erro ao carregar perfil:', erro);
        setErro('Não foi possível carregar todos os dados do perfil.');
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, [navigate, usuarioId]);

  function voltarPagina() {
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  }

  function abrirModalNome() {
    setNovoNome(usuario?.nome || '');
    setErroNome('');
    setModalNome(true);
  }

  function fecharModalNome() {
    if (salvando) return;

    setModalNome(false);
    setErroNome('');
  }

  async function alterarNome(e) {
    e.preventDefault();
    setErroNome('');

    const nome = novoNome.trim();

    if (!nome) {
      setErroNome('O nome não pode ficar vazio.');
      return;
    }

    if (nome.length > 100) {
      setErroNome('O nome deve ter no máximo 100 caracteres.');
      return;
    }

    try {
      setSalvando(true);

      const resposta = await usuarioService.alterarNome(usuarioId, nome);
      const usuarioAtualizado = resposta.data;

      setUsuario(usuarioAtualizado);

      localStorage.setItem('usuario',JSON.stringify(usuarioAtualizado));

      setModalNome(false);

    } catch (erro) {
      console.error('Erro ao alterar nome:', erro);
      setErroNome('Não foi possível atualizar seu nome.');
    } finally {
      setSalvando(false);
    }
  }

  function sair() {
    localStorage.removeItem('usuario');
    navigate('/');
  }

  function formatarData(data) {
    if (!data) return 'Não informada';

    return new Date(data).toLocaleDateString('pt-BR');
  }

  const {saldo,totalReceitas,totalDespesas} = calcularResumo(transacoes);

  const quantidadeCarteiras = carteiras.length;
  const quantidadeTransacoes = transacoes.length;

  return (
    <div className="perfil-pagina">
      <button type="button" className="perfil-voltar" onClick={voltarPagina}>
        <i className="pi pi-arrow-left" /> Voltar
      </button>

      <div className="perfil-container">

        <header className="perfil-topo">
          <span className="perfil-kicker">MINHA CONTA</span>
          <h1>Meu perfil</h1>
          <p>Gerencie seus dados e acompanhe suas finanças.</p>
        </header>

        {erro && (<div className="perfil-erro"> {erro} </div>)}

        <section className="perfil-card perfil-identificacao">

          <div className="perfil-avatar">
            {usuario?.nome?.charAt(0).toUpperCase() || 'U'}
          </div>

          <div className="perfil-dados">
            <h2>{usuario?.nome || 'Usuário'}</h2>
            <p>{usuario?.email || ''}</p>
            <span className="perfil-identificacao-tag">Conta pessoal</span>
          </div>

          <button type="button" className="perfil-botao-editar" onClick={abrirModalNome}>

            <i className="pi pi-pencil" />Editar nome
          </button>

        </section>

        <section className="perfil-card perfil-informacoes">

          <div className="perfil-secao-titulo">
            <i className="pi pi-user" />
            <h2>Informações pessoais</h2>
          </div>

          <div className="perfil-informacoes-grade">

            <div className="perfil-info-item">
              <span>Nome completo</span>
              <strong>{usuario?.nome || '-'}</strong>
            </div>

            <div className="perfil-info-item">
              <span>E-mail</span>
              <strong>{usuario?.email || '-'}</strong>
              <small>Este dado não pode ser alterado.</small>
            </div>

            <div className="perfil-info-item">
              <span>Membro desde</span>
              <strong>{formatarData(usuario?.criadoEm)}</strong>
            </div>

            <div className="perfil-info-item">
              <span>Carteiras cadastradas</span>
              <strong>
                {carregando ? 'Carregando...' : quantidadeCarteiras}
              </strong>
            </div>

          </div>
        </section>

        <div className="perfil-secao-cabecalho">
          <h2>Resumo financeiro</h2>
          <p>Uma visão geral das suas movimentações.</p>
        </div>

        <section className="perfil-resumo">

          <div className="perfil-resumo-card">
            <div className="perfil-resumo-topo">
              <span>Saldo total</span>
              <i className="pi pi-wallet" />
            </div>

            <strong>{carregando ? 'Carregando...' : formatarMoeda(saldo)}</strong>

            <small>Saldo acumulado das movimentações</small>
          </div>

          <div className="perfil-resumo-card">
            <div className="perfil-resumo-topo">
              <span>Receitas do mês</span>
              <i className="pi pi-arrow-up" />
            </div>

            <strong className="perfil-valor-receita">
              {carregando ? 'Carregando...' : formatarMoeda(totalReceitas)}
            </strong>

            <small>Total recebido neste mês</small>
          </div>

          <div className="perfil-resumo-card">
            <div className="perfil-resumo-topo">
              <span>Despesas do mês</span>
              <i className="pi pi-arrow-down" />
            </div>

            <strong className="perfil-valor-despesa">
              {carregando ? 'Carregando...' : formatarMoeda(totalDespesas)}
            </strong>

            <small>Total gasto neste mês</small>
          </div>

        </section>

        <section className="perfil-estatisticas">

          <div className="perfil-estatistica">
            <i className="pi pi-wallet" />

            <div>
              <strong>{quantidadeCarteiras}</strong>
              <span>Carteiras</span>
            </div>
          </div>

          <div className="perfil-estatistica">
            <i className="pi pi-arrow-right-arrow-left" />

            <div>
              <strong>{quantidadeTransacoes}</strong>
              <span>Transações registradas</span>
            </div>
          </div>

        </section>

        <section className="perfil-card perfil-configuracoes">

          <div className="perfil-secao-titulo">
            <i className="pi pi-cog" />
            <h2>Configurações da conta</h2>
          </div>

          <button type="button" className="perfil-opcao" onClick={abrirModalNome}>
            <span className="perfil-opcao-icone">
              <i className="pi pi-pencil" />
            </span>

            <span className="perfil-opcao-texto">
              <strong>Alterar nome</strong>
              <small>Atualize seu nome de exibição.</small>
            </span>

            <i className="pi pi-chevron-right" />
          </button>

          <button type="button" className="perfil-opcao" onClick={() => navigate('/app/perfil/senha')}>
            <span className="perfil-opcao-icone">
              <i className="pi pi-lock" />
            </span>

            <span className="perfil-opcao-texto">
              <strong>Alterar senha</strong>
              <small>Atualize a senha de acesso à conta.</small>
            </span>

            <i className="pi pi-chevron-right" />
          </button>

          <button type="button" className="perfil-opcao" onClick={() => navigate('/carteiras')}>
            <span className="perfil-opcao-icone">
              <i className="pi pi-wallet" />
            </span>

            <span className="perfil-opcao-texto">
              <strong>Gerenciar carteiras</strong>
              <small>Organize seus espaços financeiros.</small>
            </span>

            <i className="pi pi-chevron-right" />
          </button>

          <button type="button" className="perfil-opcao"onClick={() => navigate('/categorias')}>
            <span className="perfil-opcao-icone">
              <i className="pi pi-tags" />
            </span>

            <span className="perfil-opcao-texto">
              <strong>Gerenciar categorias</strong>
              <small>Organize suas receitas e despesas.</small>
            </span>

            <i className="pi pi-chevron-right" />
          </button>

          <button type="button" className="perfil-opcao perfil-opcao-sair" onClick={sair}>
            <span className="perfil-opcao-icone">
              <i className="pi pi-sign-out" />
            </span>

            <span className="perfil-opcao-texto">
              <strong>Sair da conta</strong>
              <small>Encerrar a sessão atual.</small>
            </span>

            <i className="pi pi-chevron-right" />
          </button>

        </section>
      </div>

      <Dialog header="Alterar nome" visible={modalNome} onHide={fecharModalNome}closable={!salvando}
        modalstyle={{ width: 'min(450px, 95vw)'}}>

        <form className="perfil-modal-form"onSubmit={alterarNome}>

          <label htmlFor="perfil-novo-nome">Nome completo</label>

          <input id="perfil-novo-nome" type="text" value={novoNome} onChange={(e) => setNovoNome(e.target.value)}maxLength={100}
            requireddisabled={salvando}/>

          {erroNome && ( <div className="perfil-erro">{erroNome}</div>)}

          <div className="perfil-modal-acoes">

            <button type="button" className="perfil-modal-cancelar" onClick={fecharModalNome} disabled={salvando}>
              Cancelar
            </button>

            <button type="submit" className="perfil-modal-salvar" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Salvar alterações'}
            </button>

          </div>
        </form>
      </Dialog>

    </div>
  );
}

export default Perfil;
