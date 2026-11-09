
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';

import CategoriaServices from '../services/CategoriaServices';
import './style/Categoria.css';

const categoriaService = new CategoriaServices();

const formularioInicial = {nome: '',tipo: 'DESPESA', icone: 'pi pi-tag', cor: '#44aa8b'};

export default function Categorias() {
  const navigate = useNavigate();

  const usuarioSalvo = localStorage.getItem('usuario');
  const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
  const usuarioId = usuario?.id;

  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [filtroTipo, setFiltroTipo] = useState('TODAS');
  const [exibirModal, setExibirModal] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState(null);

  const [formData, setFormData] = useState(formularioInicial);
  const [mensagemErro, setMensagemErro] = useState('');
  const [erroPagina, setErroPagina] = useState('');

  useEffect(() => {
    if (!usuarioId) {
      navigate('/');
      return;
    }

    async function carregar() {
      try {
        setCarregando(true);

        const resposta = await categoriaService.buscarTodos();
        setCategorias(resposta.data);
      } catch (erro) {
        console.error(erro);
        setErroPagina('Não foi possível carregar as categorias.');
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [navigate, usuarioId]);

  async function carregarCategorias() {
    try {
      const resposta = await categoriaService.buscarTodos();
      setCategorias(resposta.data);
      setErroPagina('');
    } catch (erro) {
      console.error(erro);
      setErroPagina('Não foi possível atualizar as categorias.');
    }
  }

  function voltarPagina() {
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  }

  function abrirCadastro() {
    setCategoriaEditando(null);
    setFormData({ ...formularioInicial });
    setMensagemErro('');
    setExibirModal(true);
  }

  function abrirEdicao(categoria) {
    setCategoriaEditando(categoria);
    setMensagemErro('');

    setFormData({
      nome: categoria.nome,
      tipo: categoria.tipo,
      icone: categoria.icone,
      cor: categoria.cor
    });

    setExibirModal(true);
  }

  function fecharModal() {
    if (salvando) return;

    setExibirModal(false);
    setCategoriaEditando(null);
    setMensagemErro('');
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((anterior) => ({...anterior,[name]: value}));
  }

  async function salvarCategoria(e) {
    e.preventDefault();

    setSalvando(true);
    setMensagemErro('');

    const payload = { nome: formData.nome.trim(),tipo: formData.tipo, icone: formData.icone,cor: formData.cor,usuario: { id: usuarioId }};

    try {
      if (categoriaEditando) {
        await categoriaService.alterar({...payload,id: categoriaEditando.id});
      } else {
        await categoriaService.inserir(payload);
      }

      fecharModalAposSalvar();
      await carregarCategorias();

    } catch (erro) {
      console.error(erro);
      setMensagemErro( erro.response?.data?.message ||'Não foi possível salvar a categoria.');
    } finally {
      setSalvando(false);
    }
  }

  function fecharModalAposSalvar() {
    setExibirModal(false);
    setCategoriaEditando(null);
    setFormData({ ...formularioInicial });
  }

  async function excluirCategoria(categoria) {
    const confirmar = window.confirm(`Deseja realmente excluir a categoria "${categoria.nome}"? ` +'Essa ação não poderá ser desfeita.');

    if (!confirmar) return;

    try {
      setErroPagina('');
      await categoriaService.remover(categoria.id);
      await carregarCategorias();

    } catch (erro) {
      console.error(erro);
      setErroPagina(erro.response?.data?.message ||'Não foi possível excluir a categoria. ' +'Verifique se ela está vinculada a alguma transação.');
    }
  }

  const categoriasFiltradas = categorias.filter((categoria) => {
    return filtroTipo === 'TODAS' || categoria.tipo === filtroTipo;
  });

  return (
    <div className="categorias-pagina">
      <button type="button" className="categorias-voltar" onClick={voltarPagina}>
        <i className="pi pi-arrow-left" /> Voltar
      </button>

      <div className="categorias-container">
        <header className="categorias-topo">
          <span className="categorias-kicker"> CONTROLE FINANCEIRO</span>
          <h1>Minhas categorias</h1>
          <p> Organize e gerencie suas receitas e despesas. </p>
        </header>

        <div className="categorias-barra">
          <div className="categorias-contador">
            <i className="pi pi-tags" />

            <span>{categorias.length} categorias cadastradas</span>
          </div>
        </div>

        <div className="categorias-filtros">
          <button type="button" className={filtroTipo === 'TODAS' ? 'ativo' : ''}onClick={() => setFiltroTipo('TODAS')}>
            Todas
          </button>

          <button type="button" className={filtroTipo === 'RECEITA' ? 'ativo' : ''} onClick={() => setFiltroTipo('RECEITA')}>
            Receitas
          </button>

          <button type="button" className={filtroTipo === 'DESPESA' ? 'ativo' : ''}onClick={() => setFiltroTipo('DESPESA')}>
            Despesas
          </button>
        </div>

        {erroPagina && (<div className="categorias-erro">{erroPagina} </div>)}

        {carregando ? (
          <div className="categorias-vazio"> Carregando categorias...</div>) : (
          <div className="categorias-grade">

            {categoriasFiltradas.map((categoria) => (
              <article key={categoria.id} className="categorias-cartao">
                <div className="categorias-cartao-topo">
                  <div className="categorias-icone" style={{ backgroundColor: `${categoria.cor}20`, color: categoria.cor}}>
                    <i className={categoria.icone} />
                  </div>

                  <div className="categorias-acoes">
                    <button type="button" className="categorias-editar" title="Editar categoria" aria-label={`Editar 
                    ${categoria.nome}`} onClick={() => abrirEdicao(categoria)}>
                      <i className="pi pi-pencil" />
                    </button>

                    <button type="button" className="categorias-excluir" title="Excluir categoria"
                      aria-label={`Excluir ${categoria.nome}`} onClick={() => excluirCategoria(categoria)}>
                      <i className="pi pi-trash" />
                    </button>
                  </div>
                </div>

                <h2>{categoria.nome}</h2>

                <span className={`categorias-tipo ${categoria.tipo === 'RECEITA'? 'receita': 'despesa'}`}>
                  {categoria.tipo === 'RECEITA' ? 'Receita': 'Despesa'}
                </span>
              </article>
            ))}

            <button type="button" className="categorias-cartao-adicionar" onClick={abrirCadastro}>
              <span className="categorias-adicionar-icone">
                <i className="pi pi-plus" />
              </span>
              <strong>Nova categoria</strong>
              <span> Criar uma nova categoria financeira. </span>
            </button>
          </div>
        )}
      </div>

      <Dialog header={categoriaEditando ? 'Editar categoria': 'Nova categoria'} visible={exibirModal}
        onHide={fecharModal} closable={!salvando} modal style={{ width: 'min(480px, 95vw)' }}>

        <form className="categorias-modal-form" onSubmit={salvarCategoria}>

          <label>Nome da categoria</label>
          <input type="text" name="nome" className="categorias-input" value={formData.nome} onChange={handleChange} maxLength={100}
            placeholder="Ex.: Alimentação" required disabled={salvando}/>

          <label>Tipo</label>
          <select name="tipo" className="categorias-input" value={formData.tipo} onChange={handleChange}disabled={salvando || !!categoriaEditando}>
            <option value="RECEITA">Receita</option>
            <option value="DESPESA">Despesa</option>
          </select>

          <label>Ícone</label>
          <select name="icone" className="categorias-input" value={formData.icone} onChange={handleChange} disabled={salvando}>
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

          <div className="categorias-cor">
            <input type="color" name="cor" value={formData.cor} onChange={handleChange}disabled={salvando}/>

            <span>{formData.cor.toUpperCase()}</span>
          </div>

          {mensagemErro && (<div className="categorias-modal-erro">{mensagemErro}</div>)}

          <div className="categorias-modal-acoes">
            <button type="button" className="categorias-modal-cancelar" onClick={fecharModal} disabled={salvando}>
              Cancelar
            </button>

            <button type="submit" className="categorias-modal-salvar" disabled={salvando}>
              {salvando ? 'Salvando...' : categoriaEditando ? 'Salvar alterações' : 'Criar categoria'}
            </button>
          </div>

        </form>
      </Dialog>
    </div>
  );
}
