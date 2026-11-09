
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';

import CarteiraServices from '../services/CarteiraServices';
import './style/Carteiras.css';

const carteiraService = new CarteiraServices();

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
  const [formData, setFormData] = useState({nome: '',descricao: ''});

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

  useEffect(() => {
    if (!usuarioId) {
      navigate('/');
      return;
    }

    carregarCarteiras();
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

  async function criarCarteira(e) {
    e.preventDefault();

    setMensagemErro('');
    setSalvando(true);

    const payload = {
      nome: formData.nome.trim(),
      descricao: formData.descricao.trim(),
      dono: { id: usuarioId }
    };

    try {
      await carteiraService.inserir(payload);

      setExibirModal(false);
      setFormData({ nome: '', descricao: '' });

      await carregarCarteiras();

    } catch (error) {
      console.error('Erro ao criar carteira:', error);

      const mensagem = error.response?.data?.message || 'Não foi possível criar a carteira.';

      setMensagemErro(mensagem);
    } finally {
      setSalvando(false);
    }
  }

  async function excluirCarteira(id) {
    const confirmar = window.confirm('Tem certeza que deseja excluir esta carteira? ' +'As transações vinculadas a ela poderão ser afetadas.');

    if (!confirmar) return;

    try {
      setCarregando(true);
      setErro('');

      await carteiraService.remover(id);
      await carregarCarteiras();

    } catch (error) {
      console.error('Erro ao excluir carteira:', error);
      setErro('Não foi possível excluir a carteira.');
    } finally {
      setCarregando(false);
    }
  }

  function formatarData(data) {
    if (!data) return 'Data não informada';
    return new Date(data).toLocaleDateString('pt-BR', {timeZone: 'UTC'});
  }

  return (
    <div className="carteiras-pagina">
      <button type="button" className="carteiras-voltar"onClick={voltarPagina}>
        <i className="pi pi-arrow-left"/> Voltar
      </button>
      <div className="carteiras-container">
        <header className="carteiras-topo">
          <span className="carteiras-kicker">CONTROLE FINANCEIRO</span>
          <h1>Minhas carteiras</h1>
          <p>Organize e gerencie seus espaços financeiros.</p>
        </header>
        <div className="carteiras-barra">
          <div className="carteiras-contador">
            <i className="pi pi-wallet" />
            <span>{carregando ? 'Carregando...' : `${carteiras.length} ${carteiras.length === 1 ? 'carteira cadastrada': 'carteiras cadastradas'}`}
            </span>
          </div>
        </div>

        {erro && (<div className="carteiras-erro">{erro}</div>)}


        {carregando ? (
          <div className="carteiras-vazio">
            <i className="pi pi-spin pi-spinner"/>
            <p>Carregando suas carteiras...</p>
            </div>) : carteiras.length === 0 && !erro ? (
          <div className="carteiras-vazio">
            <div className="carteiras-vazio-icone">
              <i className="pi pi-wallet" />
            </div>
            <h2>Nenhuma carteira cadastrada</h2>
            <p>Crie sua primeira carteira para começar aorganizar suas finanças.</p>
            <button type="button" className="carteiras-botao-novo"onClick={abrirModal}>
              <i className="pi pi-plus" />Criar primeira carteira
            </button>
          </div>) : (
          <div className="carteiras-grade">
            {carteiras.map((carteira) => (
              <article key={carteira.id}className="carteiras-cartao">
                <div className="carteiras-cartao-icone">
                  <i className="pi pi-wallet" />
                </div>

                <div className="carteiras-cartao-conteudo">
                  <h2>{carteira.nome}</h2>
                  <p>{carteira.descricao ||'Sem descrição cadastrada.'}</p>
                </div>

                <div className="carteiras-cartao-data">
                  <i className="pi pi-calendar" />
                  <span> Criada em {formatarData(carteira.criadoEm)}</span>
                </div>

                <div className="carteiras-cartao-footer">
                  <button type="button" className="carteiras-botao-membros" onClick={() =>navigate(`/carteiras/${carteira.id}/membros`)}>
                    <i className="pi pi-users" /> Membros
                  </button>
                  <button type="button" className="carteiras-botao-excluir" onClick={() => excluirCarteira(carteira.id)}
                    aria-label={`Excluir ${carteira.nome}`}title="Excluir carteira">
                    <i className="pi pi-trash" />
                  </button>
                </div>
              </article>))}

            <button type="button" className="carteiras-cartao-adicionar" onClick={abrirModal}>
              <span className="carteiras-adicionar-icone">
                <i className="pi pi-plus" />
              </span>
              <strong>Nova carteira</strong>
              <span>Clique para criar um novo espaço financeiro.</span>
            </button>
          </div>)}
      </div>

      <Dialog header="Nova carteira" visible={exibirModal} onHide={fecharModal} closable={!salvando} modal style={{ width: 'min(450px, 95vw)' }}>
        <form className="carteiras-modal-form" onSubmit={criarCarteira} >
          <p className="carteiras-modal-descricao"> Dê um nome à sua carteira para organizar suas movimentações financeiras.</p>

          <div className="carteiras-modal-campo">
            <label htmlFor="nome-carteira"> Nome da carteira </label>
            <input id="nome-carteira" type="text" name="nome" value={formData.nome} onChange={handleChange} placeholder="Ex.: Viagem de formatura"
              maxLength={100} required disabled={salvando}/>
          </div>

          <div className="carteiras-modal-campo">
            <label htmlFor="descricao-carteira"> Descrição (opcional)</label>
            <textarea id="descricao-carteira" name="descricao" value={formData.descricao} onChange={handleChange} placeholder="Ex.: Economias para a viagem"
              maxLength={250} rows={3} disabled={salvando}/>
          </div>

          {mensagemErro && ( <div className="carteiras-modal-erro"> {mensagemErro} </div>)}

          <div className="carteiras-modal-acoes">
            <button type="button" className="carteiras-modal-cancelar" onClick={fecharModal} disabled={salvando}>
              Cancelar
            </button>

            <button type="submit" className="carteiras-modal-salvar" disabled={salvando}>
              {salvando ? ('Salvando...') : (<><i className="pi pi-check" />Criar carteira</>)}
            </button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
