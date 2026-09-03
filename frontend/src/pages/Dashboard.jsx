import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';

import TransacaoService from '../services/TransacaoService';

import './style/Dashboard.css';

const transacaoService = new TransacaoService();

function Dashboard() {
  const navigate = useNavigate();

  const [transacoes, setTransacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const usuarioSalvo = localStorage.getItem('usuario');
  const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
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

  function sair() {
    localStorage.removeItem('usuario');
    navigate('/');
  }

  function converterData(data) {
    return new Date(`${data}T00:00:00`);
  }

  function formatarData(data) {
    return converterData(data).toLocaleDateString('pt-BR');
  }

  function formatarMoeda(valor) {
    return Number(valor).toLocaleString('pt-BR', {style: 'currency',currency: 'BRL'});
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
    } finally {
      setCarregando(false);
    }
  }

  // Funções de disparo para os seus endpoints separados
  async function buscarPorTipo(tipo) {
    setFiltroTipo(tipo);
    if (!tipo) return limparFiltros();
    try {
      setCarregando(true);
      const resposta = await transacaoService.buscarPorTipo(tipo);
      setTransacoes(resposta.data || resposta);
    } catch (e) { console.error(e); } finally { setCarregando(false); }
  }

  async function buscarPorPeriodo() {
    if (!dataInicio || !dataFim) return;
    try {
      setCarregando(true);
      const resposta = await transacaoService.buscarPorPeriodo(dataInicio, dataFim);
      setTransacoes(resposta.data || resposta);
    } catch (e) { console.error(e); } finally { setCarregando(false); }
  }

  const hoje = new Date();

  const transacoesDoMes = transacoes.filter((transacao) => {
    const data = converterData(transacao.data);

    return (data.getMonth() === hoje.getMonth() && data.getFullYear() === hoje.getFullYear());
  });

  const totalReceitas = transacoesDoMes
    .filter((transacao) => transacao.tipo === 'RECEITA')
    .reduce((total, transacao) => total + Number(transacao.valor), 0);

  const totalDespesas = transacoesDoMes
    .filter((transacao) => transacao.tipo === 'DESPESA')
    .reduce((total, transacao) => total + Number(transacao.valor), 0);

  const saldo = transacoes.reduce((total, transacao) => {
    if (transacao.tipo === 'RECEITA') {
      return total + Number(transacao.valor);
    }

    return total - Number(transacao.valor);
  }, 0);

  const resultado = totalReceitas - totalDespesas;

  const percentual = totalReceitas > 0? Math.round((totalDespesas / totalReceitas) * 100): 0;

  const percentualGrafico = Math.min(percentual, 100);

  const ultimasTransacoes = [...transacoes].sort((a, b) => {
    const dataA = converterData(a.data);
      const dataB = converterData(b.data);
      return dataB - dataA;
    }).slice(0, 5);

  const meses = Array.from({ length: 6 }, (_, indice) => {
    const data = new Date(hoje.getFullYear(),hoje.getMonth() - (5 - indice),1);

    return {
      mes: data.getMonth(),
      ano: data.getFullYear(),
      nome: data
        .toLocaleDateString('pt-BR', { month: 'short' })
        .replace('.', '')
        .replace(/^./, (letra) => letra.toUpperCase())
    };
  });

  function somarPorMes(tipo, mes, ano) {
    return transacoes
      .filter((transacao) => {
        const data = converterData(transacao.data);

        return (
          transacao.tipo === tipo &&
          data.getMonth() === mes &&
          data.getFullYear() === ano
        );
      })
      .reduce((total, transacao) => total + Number(transacao.valor), 0);
  }

  const dadosGrafico = {
    labels: meses.map((item) => item.nome),
    datasets: [
      {
        label: 'Receitas',
        data: meses.map((item) =>
          somarPorMes('RECEITA', item.mes, item.ano)
        ),
        backgroundColor: '#44aa8b',
        borderColor: '#237f63',
        borderWidth: 1,
        borderRadius: 6
      },
      {
        label: 'Despesas',
        data: meses.map((item) =>
          somarPorMes('DESPESA', item.mes, item.ano)
        ),
        backgroundColor: '#c44c4c',
        borderColor: '#af3838',
        borderWidth: 1,
        borderRadius: 6
      }
    ]
  };

  const opcoesGrafico = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end'
      },
      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.dataset.label}: ${formatarMoeda(context.raw)}`
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (valor) =>
            Number(valor).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              maximumFractionDigits: 0
            })
        }
      }
    }
  };

  const descricaoTabela = (transacao) => (
    <div className="lancamento">
      <span className={transacao.tipo === 'RECEITA'? 'tipo entrada': 'tipo saida'}>
        <i className={transacao.tipo === 'RECEITA'? 'pi pi-arrow-up': 'pi pi-arrow-down'}/>
      </span>

      <strong>{transacao.descricao || 'Sem descrição'}</strong>
    </div>
  );

  const categoriaTabela = (transacao) => {
    return transacao.categoria?.nome || 'Sem categoria';
  };

  const dataTabela = (transacao) => {
    return formatarData(transacao.data);
  };

  const valorTabela = (transacao) => (
    <span className={transacao.tipo === 'RECEITA' ? 'valor-receita': 'valor-despesa'}>
      {transacao.tipo === 'RECEITA' ? '+ ' : '- '}
      {formatarMoeda(transacao.valor)}
    </span>
  );

  return (
    <div className="pagina">
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-marca">A</div>

          <div>
            <strong>ASTROTECH</strong>
            <span>Finanças</span>
          </div>
        </div>

        <nav className="menu">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'menu-link ativo' : 'menu-link'}>
            <i className="pi pi-home menu-icone" />
            Visão geral
          </NavLink>

          <NavLink to="/transacoes" className={({ isActive }) => isActive ? 'menu-link ativo' : 'menu-link'}>
            <i className="pi pi-arrow-right-arrow-left menu-icone" />
            Transações
          </NavLink>

          {/* 👇 AQUI ESTÁ O NOVO MENU DE CARTEIRAS 👇 */}
          <NavLink to="/carteiras" className={({ isActive }) => isActive ? 'menu-link ativo' : 'menu-link'}>
            <i className="pi pi-wallet menu-icone" />
            Carteiras
          </NavLink>

          <NavLink to="/categorias" className={({ isActive }) => isActive ? 'menu-link ativo' : 'menu-link'}>
            <i className="pi pi-tags menu-icone" />
            Categorias
          </NavLink>

          <NavLink to="/relatorios" className={({ isActive }) => isActive ? 'menu-link ativo' : 'menu-link'}>
            <i className="pi pi-chart-bar menu-icone" />
            Relatórios
          </NavLink>

          <NavLink to="/perfil" className={({ isActive }) => isActive ? 'menu-link ativo' : 'menu-link'}>
            <i className="pi pi-user menu-icone" />
            Perfil
          </NavLink>
          
        </nav>
        <Button label="Sair" icon="pi pi-sign-out" className="botao-sair" onClick={sair}/>
      </aside>

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
            onClick={() => navigate('/app/perfil/senha')}/>
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
              {!carregando && (<Chart type="bar"  data={dadosGrafico} options={opcoesGrafico} style={{ width: '100%', height: '100%' }}/>)}
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
              <div  className="resultado-circulo" style={{ '--percentual': `${percentualGrafico}%` }}>
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
          <Button label="Ver todos" icon="pi pi-arrow-right" iconPos="right" text className="ver-todos" onClick={() => navigate('/transacoes')}/>
          </div>
          <div className="tabela-container">
            <DataTable value={ultimasTransacoes} dataKey="id" loading={carregando} stripedRows responsiveLayout="scroll"
              emptyMessage="Nenhum lançamento encontrado." className="tabela" >
              <Column field="descricao" header="Descrição" body={descricaoTabela}/>
              <Column field="categoria" header="Categoria" body={categoriaTabela}/>
              <Column field="data" header="Data" body={dataTabela}/>
              <Column field="valor" header="Valor" body={valorTabela}/>
            </DataTable>
          </div>
        </Card>
      </main>
    </div>
  );
}

export default Dashboard;