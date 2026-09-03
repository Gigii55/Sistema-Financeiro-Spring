import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoriaServices from '../services/CategoriaServices';

import './style/Categoria.css';

export default function Categorias() {
  const navigate = useNavigate();
  const categoriaService = new CategoriaServices();

  const usuarioSalvo = localStorage.getItem('usuario');
  const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;

  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'DESPESA',
    icone: 'pi pi-shopping-cart',
    cor: '#44aa8b'
  });

  const [carregando, setCarregando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');

  useEffect(() => {
    if (!usuario) {
      navigate('/');
    }
  }, [navigate, usuario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagemErro('');
    setCarregando(true);

    if (!usuario || !usuario.id) {
      alert('Sessão expirada. Faça login novamente.');
      return;
    }

    const payload = {
      nome: formData.nome,
      tipo: formData.tipo,
      icone: formData.icone,
      cor: formData.cor,
      usuario: { id: usuario.id }
    };

    try {
      await categoriaService.inserir(payload);
      alert('Categoria adicionada com sucesso!');
      navigate('/dashboard'); 
    } catch (error) {
      console.error('Erro detalhado:', error);
      const msg = error.response?.data?.message || 'Não foi possível cadastrar a categoria.';
      setMensagemErro(msg);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <>
      <div className="categoria-cabecalho">
        <h1 className="categoria-boas-vindas">NOVA CATEGORIA</h1>
        <h2 className="categoria-identificacao">Sistemas de Finanças Astrotech</h2>
      </div>

      <div className="categoria-card">
        <p className="categoria-titulo">CADASTRAR</p>

        <form className="categoria-formulario" onSubmit={handleSubmit}>
          
          <label className="categoria-label">Nome da Categoria</label>
          <input className="categoria-input" type="text" name="nome" value={formData.nome} 
            onChange={handleChange} maxLength="100" placeholder="Ex: Alimentação, Lazer..." 
            required disabled={carregando} />

          <label className="categoria-label">Tipo</label>
          <select className="categoria-input" name="tipo" value={formData.tipo} onChange={handleChange} disabled={carregando}>
            <option value="RECEITA">Receita</option>
            <option value="DESPESA">Despesa</option>
          </select>

          <label className="categoria-label">Ícone</label>
          <select className="categoria-input" name="icone" value={formData.icone} onChange={handleChange} disabled={carregando}>
            <option value="pi pi-shopping-cart">🛒 Carrinho (Compras)</option>
            <option value="pi pi-car">🚗 Carro (Transporte)</option>
            <option value="pi pi-home">🏠 Casa (Moradia)</option>
            <option value="pi pi-bolt">⚡ Energia (Contas)</option>
            <option value="pi pi-heart">❤️ Coração (Saúde/Pet)</option>
            <option value="pi pi-graduation-cap">🎓 Educação</option>
            <option value="pi pi-money-bill">💵 Dinheiro (Salário/Renda)</option>
            <option value="pi pi-tag">🏷️ Etiqueta (Outros)</option>
          </select>

          <label className="categoria-label">Cor de Destaque</label>
          <div style={{ width: '84%', maxWidth: '390px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input type="color" name="cor" value={formData.cor} onChange={handleChange} 
              disabled={carregando} style={{ width: '50px', height: '48px', padding: '0', border: 'none', cursor: 'pointer', borderRadius: '9px', backgroundColor: 'transparent' }}/>
            <span style={{ color: '#595a61', fontWeight: 'bold' }}>{formData.cor.toUpperCase()}</span>
          </div>

          {mensagemErro && <span className="categoria-erro">{mensagemErro}</span>}

          <button type="submit" className="categoria-botao" disabled={carregando}>
            {carregando ? 'SALVANDO...' : 'SALVAR CATEGORIA'}
          </button>
          
          <button type="button" className="categoria-botao-secundario" onClick={() => navigate('/dashboard')} disabled={carregando}>
            CANCELAR
          </button>

        </form>
      </div>
    </>
  );
}