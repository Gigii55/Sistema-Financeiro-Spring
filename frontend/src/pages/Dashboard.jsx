import { NavLink, useNavigate } from 'react-router-dom';
import './style/Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();

 const handleLogout = () => {
  localStorage.removeItem('usuario');
  navigate('/');
};

    const usuarioSalvo = localStorage.getItem(
    'usuario'
  );

  const usuario = usuarioSalvo
    ? JSON.parse(usuarioSalvo)
    : null;


  return (
    
    <div className="dashboard-pagina">
      <aside className="dashboard-sidebar">
        <div className="dashboard-logo">
          <div className="dashboard-logo-simbolo">A</div>
          <div>
            <strong>ASTROTECH</strong>
            <span>Finanças</span>
          </div>
        </div>

        <nav className="dashboard-menu">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'dashboard-menu-link dashboard-menu-ativo' : 'dashboard-menu-link'}>
            <span className="dashboard-menu-icone">◫</span>
            Visão geral
          </NavLink>

          <NavLink to="/transacoes" className="dashboard-menu-link">
            <span className="dashboard-menu-icone"> ↕</span>
            Transações
          </NavLink>

          <NavLink to="/categorias" className="dashboard-menu-link">
            <span className="dashboard-menu-icone">▦</span>
            Categorias
          </NavLink>

          <NavLink to="/relatorios" className="dashboard-menu-link">
            <span className="dashboard-menu-icone">▥</span>
            Relatórios
          </NavLink>

          <NavLink to="/perfil" className="dashboard-menu-link">
            <span className="dashboard-menu-icone">○</span>
            Perfil
          </NavLink>
        </nav>

        <button type="button" className="dashboard-logout" onClick={handleLogout}><span>↪</span>Sair</button>
      </aside>

      <main className="dashboard-conteudo">
        <header className="dashboard-cabecalho">
  <div>
    <p className="dashboard-saudacao">
      VISÃO GERAL
    </p>

    <h1>
      Olá, {usuario?.nome || 'Usuário'}!
    </h1>

    <span>
      Confira como estão suas finanças neste mês.
    </span>
  </div>

  <div className="dashboard-usuario">
    <div className="dashboard-avatar">
      {usuario?.nome
        ? usuario.nome.charAt(0).toUpperCase()
        : 'U'
      }
    </div>

    <div className="dashboard-usuario-informacoes">
      <strong>
        {usuario?.nome || 'Usuário'}
      </strong>

      <span>
        {usuario?.email || ''}
      </span>
    </div>
  </div>
</header>

        <section className="dashboard-resumo" aria-label="Resumo financeiro">
          <article className="dashboard-resumo-card dashboard-card-saldo">
            <div className="dashboard-card-topo">
              <span>Saldo atual</span>

              <div className="dashboard-card-icone">
                R$
              </div>
            </div>

            <strong>R$ 5.240,80</strong>

            <small>
              Valor disponível atualmente
            </small>
          </article>

          <article className="dashboard-resumo-card dashboard-card-receitas">
            <div className="dashboard-card-topo">
              <span>Receitas</span>

              <div className="dashboard-card-icone">
                ↑
              </div>
            </div>

            <strong>R$ 7.850,00</strong>

            <small>
              Total recebido no período
            </small>
          </article>

          <article className="dashboard-resumo-card dashboard-card-despesas">
            <div className="dashboard-card-topo">
              <span>Despesas</span>

              <div className="dashboard-card-icone">
                ↓
              </div>
            </div>

            <strong>R$ 2.609,20</strong>

            <small>
              Total gasto no período
            </small>
          </article>
        </section>

        <section className="dashboard-secao-principal">
          <article className="dashboard-painel dashboard-painel-grafico">
            <div className="dashboard-painel-cabecalho">
              <div>
                <h2>Receitas e despesas</h2>
                <p> Comparação financeira dos últimos seis meses. </p>
              </div>

              <div className="dashboard-grafico-legenda">
                <span> <i className="dashboard-legenda-receita" /> Receitas</span>
                <span> <i className="dashboard-legenda-despesa" /> Despesas</span>
              </div>
            </div>

            <div className="dashboard-grafico">
              <div className="dashboard-grafico-grupo">
                <div className="dashboard-grafico-barras">
                  <div className="dashboard-barra dashboard-barra-receita" style={{ height: '64%' }}/>
                  <div className="dashboard-barra dashboard-barra-despesa" style={{ height: '42%' }}/>
                </div>

                <span>Mar</span>
              </div>

              <div className="dashboard-grafico-grupo">
                <div className="dashboard-grafico-barras">
                  <div className="dashboard-barra dashboard-barra-receita" style={{ height: '72%' }}/>
                  <div className="dashboard-barra dashboard-barra-despesa" style={{ height: '38%' }}/>
                </div>

                <span>Abr</span>
              </div>

              <div className="dashboard-grafico-grupo">
                <div className="dashboard-grafico-barras">
                  <div className="dashboard-barra dashboard-barra-receita" style={{ height: '76%' }}/>
                  <div className="dashboard-barra dashboard-barra-despesa" style={{ height: '51%' }}/>
                </div>

                <span>Mai</span>
              </div>

              <div className="dashboard-grafico-grupo">
                <div className="dashboard-grafico-barras">
                  <div className="dashboard-barra dashboard-barra-receita" style={{ height: '82%' }}/>
                  <div className="dashboard-barra dashboard-barra-despesa" style={{ height: '47%' }}/>
                </div>

                <span>Jun</span>
              </div>

              <div className="dashboard-grafico-grupo">
                <div className="dashboard-grafico-barras">
                  <div className="dashboard-barra dashboard-barra-receita" style={{ height: '88%' }}/>
                  <div className="dashboard-barra dashboard-barra-despesa" style={{ height: '55%' }}/>
                </div>

                <span>Jul</span>
              </div>

              <div className="dashboard-grafico-grupo">
                <div className="dashboard-grafico-barras">
                  <div className="dashboard-barra dashboard-barra-receita" style={{ height: '96%' }}/>
                  <div className="dashboard-barra dashboard-barra-despesa" style={{ height: '32%' }}/>
                </div>
                <span>Ago</span>
              </div>
            </div>
          </article>

          <article className="dashboard-painel dashboard-painel-distribuicao">
            <div className="dashboard-painel-cabecalho">
              <div>
                <h2>Resultado do período</h2>

                <p>
                  Distribuição dos valores do mês.
                </p>
              </div>
            </div>

            <div className="dashboard-resultado">
              <div className="dashboard-resultado-circulo">
                <strong>33%</strong>
                <span>comprometido</span>
              </div>

              <div className="dashboard-resultado-detalhes">
                <div>
                  <span>Receitas</span>
                  <strong>R$ 7.850,00</strong>
                </div>

                <div>
                  <span>Despesas</span>
                  <strong>R$ 2.609,20</strong>
                </div>

                <div>
                  <span>Resultado</span>
                  <strong>R$ 5.240,80</strong>
                </div>
              </div>
            </div>
          </article>
        </section>

        <section className="dashboard-painel dashboard-lancamentos">
          <div className="dashboard-painel-cabecalho">
            <div>
              <h2>Lançamentos recentes</h2>

              <p>
                Últimas movimentações registradas na sua conta.
              </p>
            </div>

            <NavLink to="/transacoes" className="dashboard-ver-todos">Ver todos</NavLink>
          </div>

          <div className="dashboard-tabela-container">
            <table className="dashboard-tabela">
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th>Categoria</th>
                  <th>Data</th>
                  <th>Valor</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>
                    <div className="dashboard-lancamento-descricao">
                      <span className="dashboard-tipo-icone dashboard-tipo-receita">
                        ↑
                      </span>

                      <strong>
                        Pagamento do escritório
                      </strong>
                    </div>
                  </td>

                  <td>Trabalho</td>
                  <td>04/08/2026</td>

                  <td className="dashboard-valor-receita">
                    + R$ 3.200,00
                  </td>
                </tr>

                <tr>
                  <td>
                    <div className="dashboard-lancamento-descricao">
                      <span className="dashboard-tipo-icone dashboard-tipo-despesa">
                        ↓
                      </span>

                      <strong>
                        Mensalidade da faculdade
                      </strong>
                    </div>
                  </td>

                  <td>Educação</td>
                  <td>03/08/2026</td>

                  <td className="dashboard-valor-despesa">
                    - R$ 690,00
                  </td>
                </tr>

                <tr>
                  <td>
                    <div className="dashboard-lancamento-descricao">
                      <span className="dashboard-tipo-icone dashboard-tipo-receita">
                        ↑
                      </span>

                      <strong>
                        Projeto freelancer
                      </strong>
                    </div>
                  </td>

                  <td>Trabalho</td>
                  <td>02/08/2026</td>

                  <td className="dashboard-valor-receita">
                    + R$ 1.450,00
                  </td>
                </tr>

                <tr>
                  <td>
                    <div className="dashboard-lancamento-descricao">
                      <span className="dashboard-tipo-icone dashboard-tipo-despesa">
                        ↓
                      </span>

                      <strong>Supermercado</strong>
                    </div>
                  </td>

                  <td>Alimentação</td>
                  <td>01/08/2026</td>

                  <td className="dashboard-valor-despesa">
                    - R$ 328,70
                  </td>
                </tr>

                <tr>
                  <td>
                    <div className="dashboard-lancamento-descricao">
                      <span className="dashboard-tipo-icone dashboard-tipo-despesa">
                        ↓
                      </span>

                      <strong>Conta de internet</strong>
                    </div>
                  </td>

                  <td>Moradia</td>
                  <td>30/07/2026</td>

                  <td className="dashboard-valor-despesa">
                    - R$ 119,90
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;