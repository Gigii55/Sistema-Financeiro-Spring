import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';

function Sidebar() {
  const navigate = useNavigate();

  function sair() {
    localStorage.removeItem('usuario');
    navigate('/');
  }

  return (
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
      
      <Button label="Sair" icon="pi pi-sign-out" className="botao-sair" onClick={sair} />
    </aside>
  );
}

export default Sidebar;