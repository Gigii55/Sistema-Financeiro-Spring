import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { opcoesGrafico } from './js/configuracaoGraficos';
import { calcularResumo } from './js/dashBoardCalculos';
import { formatarData, formatarMoeda } from './js/formatadores';

import Sidebar from '../components/Sidebar';
import TransacaoService from '../services/TransacaoService';

import './style/Dashboard.css';

const transacaoService = new TransacaoService();

function Dashboard() {

  const navigate = useNavigate();

  const [transacoes, setTransacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [transacoesPagina, setTransacoesPagina] = useState([]);
  const [carregandoTabela, setCarregandoTabela] = useState(true);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [lazyState, setLazyState] = useState({first: 0,rows: 5,page: 0});
  const usuarioSalvo = localStorage.getItem('usuario');
  const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
  const [filtroTipo, setFiltroTipo] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  useEffect(() => {
    async function carregarDados() {
      try {
        setCarregando(true);
        setErro('');

        const resposta = await transacaoService.buscarTodos();
        setTransacoes(resposta.data);

      } catch (erro) {
        console.error(erro);
        setErro('Não foi possível carregar os dados da dashboard.');
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  useEffect(() => {

    async function carregarPagina() {
      try {
        setCarregandoTabela(true);
        const resposta = await transacaoService.buscarPaginado(lazyState.page, lazyState.rows);
        const pageData = resposta.data;

        setTransacoesPagina(pageData.content);
        setTotalRegistros(pageData.totalElements);

      } catch (erro) {
        console.error(erro);
        setErro('Não foi possível carregar os lançamentos.');
      } 
      finally {
        setCarregandoTabela(false);
      }
    }

    carregarPagina();
  }, [lazyState]);

  function onPageChange(event) {
    setLazyState({
      first: event.first,
      rows: event.rows,
      page: event.page
    });
  }

  async function limparFiltros() {
    setFiltroTipo('');
    setFiltroCategoria('');
    setDataInicio('');
    setDataFim('');

    try {
      setCarregando(true);

      const resposta = await transacaoService.buscarTodos();

      setTransacoes(resposta.data || resposta);

    } catch (erro) {
      console.error(erro);
    } 
    finally {
      setCarregando(false);
    }
  }

  async function buscarPorTipo(tipo) {
    setFiltroTipo(tipo);
    
    if (!tipo) return limparFiltros();

    try {
      setCarregando(true);

      const resposta = await transacaoService.buscarPorTipo(tipo);

      setTransacoes(resposta.data || resposta);

    } catch (e) { console.error(e); }
    
    finally { setCarregando(false); }
  }

  async function buscarPorPeriodo() {

    if (!dataInicio || !dataFim) return;

    try {
      setCarregando(true);

      const resposta = await transacaoService.buscarPorPeriodo(dataInicio, dataFim);

      setTransacoes(resposta.data || resposta);

    } catch (e) { console.error(e); }

     finally { setCarregando(false); }
  }

  const {totalReceitas,totalDespesas,saldo,resultado,percentual,percentualGrafico,dadosGrafico} = calcularResumo(transacoes);

  const descricaoTabela = (transacao) => (
    <div className="lancamento">
      <span className={transacao.tipo === 'RECEITA' ? 'tipo entrada' : 'tipo saida'}>
        <i className={transacao.tipo === 'RECEITA' ? 'pi pi-arrow-up' : 'pi pi-arrow-down'} />
      </span>
      <strong>{transacao.descricao || 'Sem descrição'}</strong>
    </div>
  );

  async function excluirTransacao(id) {
    const confirmar = window.confirm('Tem certeza que deseja excluir esta transação?');
    if (confirmar) {
      try {
        setCarregandoTabela(true);
        setCarregando(true);
        
        await transacaoService.remover(id);
        
        const resDados = await transacaoService.buscarTodos();
        setTransacoes(resDados.data);

        const resTabela = await transacaoService.buscarPaginado(lazyState.page, lazyState.rows);
        setTransacoesPagina(resTabela.data.content);
        setTotalRegistros(resTabela.data.totalElements);

      } catch (erro) {
        console.error('Erro ao excluir:', erro);
        alert('Não foi possível excluir a transação.');
      } finally {
        setCarregandoTabela(false);
        setCarregando(false);
      }
    }
  }

  const acoesTabela = (transacao) => (
    <Button icon="pi pi-trash"  className="p-button-rounded p-button-danger p-button-text"  aria-label="Excluir"  onClick={() => excluirTransacao(transacao.id)}/>
  );

  const categoriaTabela = (transacao) => {
    return transacao.categoria?.nome || 'Sem categoria';
  };

  const dataTabela = (transacao) => {
    return formatarData(transacao.data);
  };

  const valorTabela = (transacao) => (
    <span className={transacao.tipo === 'RECEITA' ? 'valor-receita' : 'valor-despesa'}>
      {transacao.tipo === 'RECEITA' ? '+ ' : '- '}
      {formatarMoeda(transacao.valor)}
    </span>
  );

  return (
    <div className="pagina">

      <Sidebar />

      <main className="conteudo">
        <header className="cabecalho">
          <div>
            <p className="saudacao">VISÃO GERAL</p>
            <h1>Olá, {usuario?.nome || 'Usuário'}!</h1>
            <span>Confira como estão suas finanças neste mês.</span>
          </div>

          <div className="usuario">
            <Avatar label={usuario?.nome?.charAt(0).toUpperCase() || 'U'} shape="circle" className="avatar" />
            <div className="usuario-info">
              <strong>{usuario?.nome || 'Usuário'}</strong>
              <span>{usuario?.email || ''}</span>
            </div>
            <Button label="Alterar senha" icon="pi pi-key" text className="botao-alterar-senha"
              onClick={() => navigate('/app/perfil/senha')} />
          </div>
        </header>

        {erro && <div className="mensagem-erro">{erro}</div>}

        <section className="resumo">
          <Card className="resumo-card saldo">
            <div className="card-topo">
              <span>Saldo atual</span>
              <div className="card-icone">
                <i className="pi pi-wallet" />
              </div>
            </div>
            <strong>
              {carregando ? 'Carregando...' : formatarMoeda(saldo)}
            </strong>
            <small>Valor disponível atualmente</small>
          </Card>

          <Card className="resumo-card receita">
            <div className="card-topo">
              <span>Receitas</span>
              <div className="card-icone">
                <i className="pi pi-arrow-up" />
              </div>
            </div>
            <strong>
              {carregando ? 'Carregando...' : formatarMoeda(totalReceitas)}
            </strong>
            <small>Total recebido no mês</small>
          </Card>

          <Card className="resumo-card despesa">
            <div className="card-topo">
              <span>Despesas</span>
              <div className="card-icone">
                <i className="pi pi-arrow-down" />
              </div>
            </div>
            <strong>
              {carregando ? 'Carregando...' : formatarMoeda(totalDespesas)}
            </strong>
            <small>Total gasto no mês</small>
          </Card>
        </section>

        <section className="paineis">
          <Card className="painel painel-grafico">
            <div className="painel-topo">
              <div>
                <h2>Receitas e despesas</h2>
                <p>Comparação financeira dos últimos seis meses.</p>
              </div>
            </div>
            <div className="grafico">
              {!carregando && (
                <Chart type="bar" data={dadosGrafico} options={opcoesGrafico} style={{ width: '100%', height: '100%' }} />
              )}
            </div>
          </Card>

          <Card className="painel painel-resultado">
            <div className="painel-topo">
              <div>
                <h2>Resultado do período</h2>
                <p>Distribuição dos valores do mês.</p>
              </div>
            </div>
            <div className="resultado">
              <div className="resultado-circulo" style={{ '--percentual': `${percentualGrafico}%` }}>
                <strong>{percentual}%</strong>
                <span>comprometido</span>
              </div>

              <div className="resultado-valores">
                <div>
                  <span>Receitas</span>
                  <strong>{formatarMoeda(totalReceitas)}</strong>
                </div>
                <div>
                  <span>Despesas</span>
                  <strong>{formatarMoeda(totalDespesas)}</strong>
                </div>
                <div>
                  <span>Resultado</span>
                  <strong>{formatarMoeda(resultado)}</strong>
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section className="barra-filtros">
          <div className="filtro-grupo">
            <label className="filtro-label">Filtrar por Tipo</label>
            <select className="filtro-input" value={filtroTipo} onChange={(e) => buscarPorTipo(e.target.value)}>
              <option value="">Todas as transações</option>
              <option value="RECEITA">Apenas Receitas</option>
              <option value="DESPESA">Apenas Despesas</option>
            </select>
          </div>

          <div className="filtro-grupo">
            <label className="filtro-label">Data Início</label>
            <input type="date" className="filtro-input" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
          </div>

          <div className="filtro-grupo">
            <label className="filtro-label">Data Fim</label>
            <input type="date" className="filtro-input" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
          </div>

          <div className="filtro-botoes">
            <Button label="Buscar Período" icon="pi pi-search" onClick={buscarPorPeriodo} className="p-button-outlined filtro-botao" />
            <Button label="Limpar" icon="pi pi-times" onClick={limparFiltros} className="p-button-text p-button-danger filtro-botao" />
          </div>
        </section>

        <Card className="painel lista-transacoes">
          <div className="painel-topo">
            <div>
              <h2>Lançamentos recentes</h2>
              <p>Últimas movimentações registradas na sua conta.</p>
            </div>
            <Button label="Nova Transação" icon="pi pi-arrow-right" iconPos="right" text className="ver-todos" onClick={() => navigate('/transacoes')} />
          </div>
          <div className="tabela-container">
            <DataTable value={transacoesPagina} dataKey="id" loading={carregandoTabela} stripedRows
              emptyMessage="Nenhum lançamento encontrado." className="tabela" lazy
              paginator first={lazyState.first} rows={lazyState.rows} totalRecords={totalRegistros}
              onPage={onPageChange} rowsPerPageOptions={[5, 10, 20]}>
              <Column field="descricao" header="Descrição" body={descricaoTabela} />
              <Column field="categoria" header="Categoria" body={categoriaTabela} />
              <Column field="data" header="Data" body={dataTabela} />
              <Column field="valor" header="Valor" body={valorTabela} />
              <Column body={acoesTabela} style={{ width: '5rem', textAlign: 'center' }} />
            </DataTable>
          </div>
        </Card>
      </main>
    </div>
  );
}

export default Dashboard;