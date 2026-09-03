import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

import CarteiraServices from '../services/CarteiraServices';
import './style/Carteiras.css';

const carteiraService = new CarteiraServices();

function Carteiras() {
  const navigate = useNavigate();

  const usuarioSalvo = localStorage.getItem('usuario');
  const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;

  const [carteiras, setCarteiras] = useState([]);
  const [carregando, setCarregando] = useState(true);
  
  const [exibirModal, setExibirModal] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [formData, setFormData] = useState({ nome: '', descricao: '' });
  const [mensagemErro, setMensagemErro] = useState('');

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

  useEffect(() => {
    if (!usuario) {
      navigate('/');
      return;
    }

    carregarCarteiras();

  }, [navigate]);

  async function excluirCarteira(id) {
    const confirmar = window.confirm('Tem certeza que deseja excluir esta carteira? Todas as transações ligadas a ela poderão ser afetadas.');
    
    if (confirmar) {
      try {
        setCarregando(true);
        await carteiraService.remover(id);
        carregarCarteiras(); 
      } catch (error) {
        console.error('Erro ao excluir carteira:', error);
        alert('Não foi possível excluir a carteira.');
      } finally {
        setCarregando(false);
      }
    }
  }

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

      carregarCarteiras();

    } catch (error) {
      const msg = error.response?.data?.message || 'Erro ao criar carteira.';
      setMensagemErro(msg);
    } finally {
      setSalvando(false);
    }
  }

  const footerCartao = (carteira) => (
    <div className="cartao-footer">
      <Button label="Membros"  icon="pi pi-users"  className="p-button-outlined p-button-sm" onClick={() => navigate(`/carteiras/${carteira.id}/membros`)}/>
      <Button icon="pi pi-trash" className="p-button-outlined p-button-danger p-button-sm" aria-label="Excluir" 
        onClick={() => excluirCarteira(carteira.id)} title="Excluir Carteira"/>
    </div>
  );

  return (
    <div className="pagina-carteiras">
      
      <div className="cabecalho-carteiras">
        <div>
          <h2>Minhas Carteiras</h2>
          <p>Gerencie seus espaços financeiros e compartilhamentos.</p>
        </div>
        <Button label="Nova Carteira" icon="pi pi-plus" className="botao-adicionar-carteira" onClick={() => setExibirModal(true)}/>
      </div>

      {carregando ? (
        <p className="texto-informativo">Carregando carteiras...</p>
      ) : (
        <div className="grade-carteiras">
          {carteiras.length === 0 ? (
            <p className="texto-informativo">Você ainda não possui nenhuma carteira.</p>
          ) : (
            carteiras.map((carteira) => (
              <Card key={carteira.id} title={carteira.nome} footer={footerCartao(carteira)} className="cartao-carteira">
                <p className="cartao-descricao">
                  {carteira.descricao || 'Sem descrição.'}
                </p>
                <small className="cartao-data">
                  Criada em: {new Date(carteira.criadoEm).toLocaleDateString('pt-BR')}
                </small>
              </Card>
            ))
          )}
        </div>
      )}
      <Dialog visible={exibirModal} style={{ width: '450px' }} header="Criar Nova Carteira" modal onHide={() => setExibirModal(false)}>
        <form onSubmit={criarCarteira} className="formulario-modal">
          <div className="grupo-input">
            <label className="modal-label">Nome da Carteira</label>
            <input type="text" name="nome" value={formData.nome} onChange={handleChange} required className="carteira-input-modal" maxLength="100" placeholder="Ex: Viagem de Formatura" />
          </div>
          <div className="grupo-input">
            <label className="modal-label">Descrição (Opcional)</label>
            <input type="text" name="descricao" value={formData.descricao} onChange={handleChange} className="carteira-input-modal" maxLength="250" placeholder="Ex: Fundo para a viagem" />
          </div>
          {mensagemErro && <span className="mensagem-erro">{mensagemErro}</span>}
          <div className="botoes-modal">
            <Button type="button" label="Cancelar" className="p-button-text" onClick={() => setExibirModal(false)} disabled={salvando} />
                        <Button type="submit" label={salvando ? 'Salvando...' : 'Criar Carteira'} autoFocus disabled={salvando} className="botao-adicionar-carteira" />
          </div>
        </form>
      </Dialog>
    </div>
  );
}

export default Carteiras;