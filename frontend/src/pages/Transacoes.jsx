import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CarteiraServices from '../services/CarteiraServices';
import CategoriaServices from '../services/CategoriaServices';
import TransacaoServices from '../services/TransacaoService';

import './style/Transacoes.css';

export default function Transacoes() {
  const navigate = useNavigate();
  
  const transacaoService = new TransacaoServices();
  const carteiraService = new CarteiraServices();
  const categoriaService = new CategoriaServices();

  const usuarioSalvo = localStorage.getItem('usuario');
  const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;

  const [carteiras, setCarteiras] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');

  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    data: '',
    tipo: 'RECEITA',
    carteiraId: '', 
    categoriaId: '',
  });

  useEffect(() => {
    if (!usuario) {
      navigate('/');
      return;
    }

    async function carregarDados() {
      try {
        const resCarteiras = await carteiraService.buscarTodos();
        const resCategorias = await categoriaService.buscarTodos();
        setCarteiras(resCarteiras.data || resCarteiras);
        setCategorias(resCategorias.data || resCategorias);
      } catch (error) {
        console.error('Erro ao carregar carteiras ou categorias:', error);
      }
    }
    carregarDados();
  }, [navigate, usuario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagemErro('');
    setCarregando(true);

    const payload = {
      descricao: formData.descricao,
      valor: parseFloat(formData.valor),
      data: formData.data,
      tipo: formData.tipo,
      carteira: { id: formData.carteiraId },
      criadoPor: { id: usuario.id },
      categoria: formData.categoriaId ? { id: parseInt(formData.categoriaId) } : null,
    };

    try {
      await transacaoService.inserir(payload);
      alert('Transação adicionada com sucesso!');
      

      navigate('/dashboard'); 
    } catch (error) {
      console.error('Erro detalhado:', error);
      const msg = error.response?.data?.message || 'Não foi possível conectar ao backend.';
      setMensagemErro(msg);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <>
      <div className="transacao-cabecalho">
        <h1 className="transacao-boas-vindas">NOVA TRANSAÇÃO</h1>
        <h2 className="transacao-identificacao">Sistemas de Finanças Astrotech</h2>
      </div>

      <div className="transacao-card">
        <p className="transacao-titulo">REGISTRAR</p>

        <form className="transacao-formulario" onSubmit={handleSubmit}>
          
          <label className="transacao-label">Descrição</label>
          <input className="transacao-input" type="text" name="descricao" value={formData.descricao} 
            onChange={handleChange} maxLength="250" placeholder="Ex: Compra no mercado" required disabled={carregando} />

          <label className="transacao-label">Valor (R$)</label>
          <input className="transacao-input" type="number" step="0.01" name="valor" value={formData.valor} 
            onChange={handleChange} placeholder="0.00" required disabled={carregando} />

          <label className="transacao-label">Data</label>
          <input className="transacao-input" type="date" name="data" value={formData.data} 
            onChange={handleChange} required disabled={carregando} />

          <label className="transacao-label">Tipo</label>
          <select className="transacao-input" name="tipo" value={formData.tipo} onChange={handleChange} disabled={carregando}>
            <option value="RECEITA">Receita</option>
            <option value="DESPESA">Despesa</option>
          </select>

          <label className="transacao-label">Carteira</label>
          <select className="transacao-input" name="carteiraId" value={formData.carteiraId} onChange={handleChange} required disabled={carregando}>
            <option value="" disabled>Selecione uma carteira...</option>
            {carteiras.map((carteira) => (
              <option key={carteira.id} value={carteira.id}>{carteira.nome}</option>
            ))}
          </select>

          <label className="transacao-label">Categoria (Opcional)</label>
          <select className="transacao-input" name="categoriaId" value={formData.categoriaId} onChange={handleChange} disabled={carregando}>
            <option value="">Nenhuma categoria</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>
            ))}
          </select>

          {mensagemErro && <span className="transacao-erro">{mensagemErro}</span>}

          <button type="submit" className="transacao-botao" disabled={carregando}>{carregando ? 'SALVANDO...' : 'SALVAR TRANSAÇÃO'}</button>
          <button type="button" className="transacao-botao-secundario" onClick={() => navigate('/dashboard')} disabled={carregando}>
            CANCELAR
          </button>

        </form>
      </div>
    </>
  );
}