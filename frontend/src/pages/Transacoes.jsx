
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';

import CarteiraServices from '../services/CarteiraServices';
import CategoriaServices from '../services/CategoriaServices';
import TransacaoServices from '../services/TransacaoService';

import './style/Transacoes.css';

const transacaoService = new TransacaoServices();
const carteiraService = new CarteiraServices();
const categoriaService = new CategoriaServices();

export default function Transacoes() {
  const navigate = useNavigate();

  const usuarioSalvo = localStorage.getItem('usuario');
  const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
  const usuarioId = usuario?.id;

  const [carteiras, setCarteiras] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');

  const [modalCarteira, setModalCarteira] = useState(false);
  const [modalCategoria, setModalCategoria] = useState(false);
  const [salvandoModal, setSalvandoModal] = useState(false);
  const [erroModal, setErroModal] = useState('');

  const [novaCarteira, setNovaCarteira] = useState({
    nome: '',
    descricao: ''
  });

  const [novaCategoria, setNovaCategoria] = useState({
    nome: '',
    icone: 'pi pi-tag',
    cor: '#44aa8b'
  });

  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    data: '',
    tipo: 'RECEITA',
    carteiraId: '',
    categoriaId: ''
  });


  useEffect(() => {
    if (!usuarioId) {
      navigate('/');
      return;
    }

    async function carregarDados() {
      try {
        const resCarteiras = await carteiraService.buscarTodos();
        const resCategorias = await categoriaService.buscarTodos();

        const listaCarteiras = resCarteiras.data;
        const listaCategorias = resCategorias.data;

        setCarteiras(listaCarteiras);
        setCategorias(listaCategorias);

        const chaveCarteira = `carteiraSelecionada_${usuarioId}`;
        const carteiraSalva = localStorage.getItem(chaveCarteira);

        const carteiraExiste = listaCarteiras.some(
          (carteira) => carteira.id === carteiraSalva
        );

        let carteiraInicial = '';

        if (carteiraSalva && carteiraSalva !== 'todas' && carteiraExiste) {
          carteiraInicial = carteiraSalva;
        } else if (listaCarteiras.length > 0) {
          carteiraInicial = listaCarteiras[0].id;
        }

        setFormData((anterior) => ({...anterior,carteiraId: carteiraInicial}));

      } catch (erro) {
        console.error('Erro ao carregar carteiras ou categorias:', erro);
        setMensagemErro('Não foi possível carregar os dados.');
      }
    }

    carregarDados();
  }, [navigate, usuarioId]);

  async function criarCarteira(e) {
    e.preventDefault();
    setErroModal('');
    setSalvandoModal(true);

    try {
      const resposta = await carteiraService.inserir({
        nome: novaCarteira.nome,
        descricao: novaCarteira.descricao,
        dono: { id: usuarioId }
      });

      const carteiraCriada = resposta.data;

      setCarteiras((anteriores) => [...anteriores,carteiraCriada]);

      setFormData((anterior) => ({...anterior,carteiraId: carteiraCriada.id}));

      setNovaCarteira({nome: '',descricao: ''});

      setModalCarteira(false);

    } catch (erro) {
      console.error('Erro ao criar carteira:', erro);
      setErroModal(erro.response?.data?.message || 'Não foi possível criar a carteira.');
    } finally {
      setSalvandoModal(false);
    }
  }


  async function criarCategoria(e) {
    e.preventDefault();
    setErroModal('');
    setSalvandoModal(true);

    try {
      const resposta = await categoriaService.inserir({
        nome: novaCategoria.nome,
        icone: novaCategoria.icone,
        cor: novaCategoria.cor,
        tipo: formData.tipo,
        usuario: { id: usuarioId }
      });

      const categoriaCriada = resposta.data;

      setCategorias((anteriores) => [...anteriores, categoriaCriada]);

      setFormData((anterior) => ({...anterior,categoriaId: String(categoriaCriada.id)}));

      setNovaCategoria({nome: '',icone: 'pi pi-tag',cor: '#44aa8b'});

      setModalCategoria(false);

    } catch (erro) {
      console.error('Erro ao criar categoria:', erro);
      setErroModal(erro.response?.data?.message || 'Não foi possível criar a categoria.');
    } finally {
      setSalvandoModal(false);
    }
  }


  function voltarPagina() {
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((anterior) => ({...anterior,[name]: value}));
  }

  function selecionarTipo(tipo) {
    setFormData((anterior) => ({...anterior, tipo,categoriaId: ''}));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMensagemErro('');
    setCarregando(true);

    const payload = {
      descricao: formData.descricao,
      valor: parseFloat(formData.valor),
      data: formData.data,
      tipo: formData.tipo,
      carteira: { id: formData.carteiraId },
      criadoPor: { id: usuarioId },
      categoria: formData.categoriaId ? { id: parseInt(formData.categoriaId, 10) }: null
    };

    try {
      await transacaoService.inserir(payload);

      alert('Transação adicionada com sucesso!');
      navigate('/dashboard');

    } catch (erro) {
      console.error('Erro ao salvar transação:', erro);

      setMensagemErro(erro.response?.data?.message ||'Não foi possível salvar a transação.');

    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="transacao-pagina">
      <div className="transacao-container">

        <div className="transacao-topo">
          <button type="button"className="transacao-voltar"onClick={voltarPagina}>
            <i className="pi pi-arrow-left" /> Voltar
          </button>

          <div className="transacao-hero">
            <span className="transacao-kicker">CONTROLE FINANCEIRO</span>
            <h1>Nova transação</h1>
            <p> Registre uma receita ou despesa em sua carteira.</p>
          </div>
        </div>

        <div className="transacao-card">
          <div className="transacao-card-header">
            <h2>Registrar</h2>
            <p>Preencha os dados da movimentação abaixo.</p>
          </div>

          <form className="transacao-formulario" onSubmit={handleSubmit}>

            <div className="transacao-campo transacao-campo-full">
              <label className="transacao-label">Descrição</label>

              <input className="transacao-input" type="text" name="descricao" value={formData.descricao} onChange={handleChange}
                maxLength={250} placeholder="Ex: Compra no mercado" requireddisabled={carregando}/>
            </div>

            <div className="transacao-campo">
              <label className="transacao-label">Valor (R$)</label>

              <input className="transacao-input" type="number" min="0.01"step="0.01" name="valor"
                value={formData.valor} onChange={handleChange} placeholder="0.00" required disabled={carregando}/>
            </div>

            <div className="transacao-campo">
              <label className="transacao-label">Data</label>

              <input className="transacao-input" type="date" name="data" value={formData.data}
                onChange={handleChange} required disabled={carregando}/>
            </div>

            <div className="transacao-campo transacao-campo-full">
              <label className="transacao-label">Tipo</label>

              <div className="transacao-tipo-toggle">

                <button type="button" className={`tipo-botao ${formData.tipo === 'RECEITA'? 'ativo receita': ''}`}
                  onClick={() => selecionarTipo('RECEITA')} aria-pressed={formData.tipo === 'RECEITA'} disabled={carregando}>
                  <i className="pi pi-arrow-up" />Receita
                </button>

                <button type="button" className={`tipo-botao ${formData.tipo === 'DESPESA'? 'ativo despesa': ''}`}
                  onClick={() => selecionarTipo('DESPESA')}
                  aria-pressed={formData.tipo === 'DESPESA'}
                  disabled={carregando}>
                  <i className="pi pi-arrow-down"/> Despesa</button>

              </div>
            </div>

            <div className="transacao-campo">
              <label className="transacao-label"> Carteira</label>

              <div className="transacao-campo-adicionar">
                <select className="transacao-input"  name="carteiraId" value={formData.carteiraId} onChange={handleChange}
                  requireddisabled={carregando}>
                  <option value="" disabled> Selecione uma carteira...</option>

                  {carteiras.map((carteira) => (<option key={carteira.id} value={carteira.id}>{carteira.nome}</option>))}
                </select>

                <button type="button" className="transacao-botao-adicionar" title="Adicionar carteira"
                  aria-label="Adicionar carteira"onClick={() => { setErroModal('');setModalCarteira(true);}}
                  disabled={carregando}>
                  <i className="pi pi-plus" />
                </button>
              </div>
            </div>

      
            <div className="transacao-campo">
              <label className="transacao-label">Categoria (Opcional)</label>

              <div className="transacao-campo-adicionar">
                <select className="transacao-input" name="categoriaId"value={formData.categoriaId} onChange={handleChange}
                  disabled={carregando}>

                  <option value=""> Nenhuma categoria</option>

                  {categorias.filter((categoria) => categoria.tipo === formData.tipo).map((categoria) => (
                      <option key={categoria.id}value={categoria.id}>{categoria.nome}</option>))}
                </select>

                <button type="button" className="transacao-botao-adicionar" title="Adicionar categoria"
                  aria-label="Adicionar categoria" onClick={() => {setErroModal('');setModalCategoria(true);}}
                  disabled={carregando}>
                  <i className="pi pi-plus" />
                </button>
              </div>
            </div>

      
            {mensagemErro && (
              <div className="transacao-campo transacao-campo-full">
                <span className="transacao-erro">{mensagemErro}</span>
              </div>
            )}

            <div className="transacao-acoes transacao-campo-full">

              <button type="button" className="transacao-botao-secundario"onClick={() => navigate('/dashboard')}disabled={carregando}>
                Cancelar
              </button>

              <button type="submit" className="transacao-botao" disabled={carregando}>
                {carregando ? 'Salvando...': formData.tipo === 'RECEITA'? 'Salvar receita' : 'Salvar despesa'}
              </button>

            </div>
          </form>
        </div>
      </div>

  
      <Dialog header="Nova carteira" visible={modalCarteira}onHide={() => { if (!salvandoModal) setModalCarteira(false);}}
        closable={!salvandoModal} modal style={{ width: 'min(450px, 95vw)'}}>

        <form className="transacao-modal-form"onSubmit={criarCarteira}>
          <label>Nome da carteira</label>

          <input className="transacao-input" value={novaCarteira.nome} onChange={(e) => setNovaCarteira({
              ...novaCarteira, nome: e.target.value})} placeholder="Ex.: Reserva de emergência" maxLength={100}
            required disabled={salvandoModal}/>

          <label>Descrição (opcional)</label>

          <input className="transacao-input" value={novaCarteira.descricao} onChange={(e) => setNovaCarteira({
            ...novaCarteira, descricao: e.target.value})} placeholder="Descrição da carteira"
            maxLength={250} disabled={salvandoModal}/>

          {erroModal && (<span className="transacao-erro">{erroModal} </span>)}

          <button type="submit" className="transacao-botao" disabled={salvandoModal}>
            {salvandoModal? 'Salvando...': 'Criar carteira'} </button>
        </form>
      </Dialog>

      <Dialog header="Nova categoria" visible={modalCategoria} onHide={() => {
          if (!salvandoModal) setModalCategoria(false);}}

        closable={!salvandoModal}modal style={{ width: 'min(450px, 95vw)'}}>
        <form className="transacao-modal-form" onSubmit={criarCategoria}>

          <label>Nome da categoria</label>

          <input className="transacao-input" value={novaCategoria.nome} onChange={(e) => setNovaCategoria({
              ...novaCategoria,nome: e.target.value})} placeholder="Ex.: Alimentação" maxLength={100} required disabled={salvandoModal}/>

          <label>Tipo</label>

          <input className="transacao-input" value={formData.tipo === 'RECEITA'? 'Receita': 'Despesa'}readOnly/>

          <label>Ícone</label>

          <select className="transacao-input" value={novaCategoria.icone} onChange={(e) => setNovaCategoria({
              ...novaCategoria, icone: e.target.value})}disabled={salvandoModal}>

            <option value="pi pi-tag">Etiqueta</option>
            <option value="pi pi-shopping-cart">Compras</option>
            <option value="pi pi-car">Transporte</option>
            <option value="pi pi-home">Moradia</option>
            <option value="pi pi-bolt">Contas</option>
            <option value="pi pi-heart">Saúde</option>
            <option value="pi pi-graduation-cap">Educação</option>
            <option value="pi pi-money-bill">Dinheiro</option>
          </select>

          <label>Cor de destaque</label>

          <input type="color" value={novaCategoria.cor} onChange={(e) => setNovaCategoria({
              ...novaCategoria, cor: e.target.value})} disabled={salvandoModal}/>

          {erroModal && (<span className="transacao-erro">{erroModal}</span>)}

          <button type="submit" className="transacao-botao"disabled={salvandoModal}>
            {salvandoModal? 'Salvando...': 'Criar categoria'}
          </button>
        </form>
      </Dialog>
    </div>
  );
}
