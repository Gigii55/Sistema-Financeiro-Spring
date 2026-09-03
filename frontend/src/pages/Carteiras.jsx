import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

import CarteiraServices from '../services/CarteiraServices';
import './style/Carteiras.css';

export default function Carteiras() {
  const navigate = useNavigate();
  const carteiraService = new CarteiraServices();

  const usuarioSalvo = localStorage.getItem('usuario');
  const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;

  const [carteiras, setCarteiras] = useState([]);
  const [carregando, setCarregando] = useState(true);
  
  // Estados para o Modal de Criação
  const [exibirModal, setExibirModal] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [formData, setFormData] = useState({ nome: '', descricao: '' });
  const [mensagemErro, setMensagemErro] = useState('');

 useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (!usuarioSalvo) {
      navigate('/');
      return;
    }

    // Colocamos a função de buscar DENTRO do useEffect. 
    // Assim o React não se perde e roda apenas 1 vez.
    async function fetchCarteiras() {
      setCarregando(true);
      try {
        const servico = new CarteiraServices();
        const resposta = await servico.buscarTodos();
        setCarteiras(resposta.data || resposta);
      } catch (error) {
        console.error('Erro ao buscar carteiras:', error);
      } finally {
        setCarregando(false);
      }
    }

    fetchCarteiras();
  }, [navigate]);

  async function carregarCarteiras() {
    setCarregando(true);
    try {
      const resposta = await carteiraService.buscarTodos();
      setCarteiras(resposta.data || resposta);
    } catch (error) {
      console.error('Erro ao buscar carteiras:', error);
    } finally {
      setCarregando(false);
    }
  }

  // --- Funções do Modal de Nova Carteira ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function criarCarteira(e) {
    e.preventDefault();
    setMensagemErro('');
    setSalvando(true);

    const payload = {
      nome: formData.nome,
      descricao: formData.descricao,
      dono: { id: usuario.id }
    };

    try {
      await carteiraService.inserir(payload);
      setExibirModal(false);
      setFormData({ nome: '', descricao: '' });
      carregarCarteiras(); // Atualiza a lista
    } catch (error) {
      const msg = error.response?.data?.message || 'Erro ao criar carteira.';
      setMensagemErro(msg);
    } finally {
      setSalvando(false);
    }
  }

  // --- Renderização dos Cartões ---
  const footerCartao = (carteira) => (
    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
      <Button 
        label="Membros" 
        icon="pi pi-users" 
        className="p-button-outlined p-button-sm" 
        onClick={() => navigate(`/carteiras/${carteira.id}/membros`)} 
      />
      {/* Você pode adicionar um botão de Editar/Excluir aqui depois, se quiser */}
    </div>
  );

  return (
    <div className="pagina-carteiras">
      <div className="cabecalho-carteiras">
        <div>
          <h2>Minhas Carteiras</h2>
          <p>Gerencie seus espaços financeiros e compartilhamentos.</p>
        </div>
        <Button 
          label="Nova Carteira" 
          icon="pi pi-plus" 
          className="botao-adicionar-carteira" 
          onClick={() => setExibirModal(true)} 
        />
      </div>

      {carregando ? (
        <p>Carregando carteiras...</p>
      ) : (
        <div className="grade-carteiras">
          {carteiras.length === 0 ? (
            <p>Você ainda não possui nenhuma carteira.</p>
          ) : (
            carteiras.map((carteira) => (
              <Card key={carteira.id} title={carteira.nome} footer={footerCartao(carteira)} className="cartao-carteira">
                <p className="m-0" style={{ color: '#666' }}>
                  {carteira.descricao || 'Sem descrição.'}
                </p>
                <small style={{ display: 'block', marginTop: '1rem', color: '#999' }}>
                  Criada em: {new Date(carteira.criadoEm).toLocaleDateString('pt-BR')}
                </small>
              </Card>
            ))
          )}
        </div>
      )}

      {/* MODAL DE CRIAÇÃO */}
      <Dialog visible={exibirModal} style={{ width: '450px' }} header="Criar Nova Carteira" modal onHide={() => setExibirModal(false)}>
        <form onSubmit={criarCarteira} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 'bold', color: '#595a61' }}>Nome da Carteira</label>
            <input type="text" name="nome" value={formData.nome} onChange={handleChange} required className="carteira-input-modal" maxLength="100" placeholder="Ex: Viagem 2027" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 'bold', color: '#595a61' }}>Descrição (Opcional)</label>
            <input type="text" name="descricao" value={formData.descricao} onChange={handleChange} className="carteira-input-modal" maxLength="250" placeholder="Ex: Fundo para a viagem de formatura" />
          </div>

          {mensagemErro && <span style={{ color: '#b91c1c', fontWeight: 'bold' }}>{mensagemErro}</span>}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Button type="button" label="Cancelar" className="p-button-text" onClick={() => setExibirModal(false)} disabled={salvando} />
            <Button type="submit" label={salvando ? 'Salvando...' : 'Criar Carteira'} autoFocus disabled={salvando} />
          </div>
        </form>
      </Dialog>
    </div>
  );
}