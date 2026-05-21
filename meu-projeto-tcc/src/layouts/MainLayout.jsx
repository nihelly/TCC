import React from 'react';
import { Home, Search, User, Settings, Bell, Mail, Plus, Globe } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const SidebarItem = ({ Icon, label, path, ativo }) => {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => navigate(path)}
      className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200 
        ${ativo ? 'bg-gray-100' : 'hover:bg-gray-50'} group`}
    >
      <Icon size={26} className={`${ativo ? 'text-black' : 'text-gray-700'} group-hover:scale-105`} />
      <span className={`text-[15px] hidden lg:block ${ativo ? 'font-bold' : 'font-medium'}`}>
        {label}
      </span>
    </div>
  );
};

export const MainLayout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-white">
      {/* SIDEBAR ESTILO INSTAGRAM */}
      <aside className="w-20 lg:w-64 border-r border-gray-100 p-4 flex flex-col justify-between fixed h-full bg-white z-50 transition-all">
        <div className="space-y-8">
          {/* Logo Superior */}
          <div className="p-3 mb-4">
            <Globe size={28} className="lg:hidden" />
            <h1 className="text-xl font-bold hidden lg:block tracking-tighter">CONECTA</h1>
          </div>
          
          <nav className="space-y-2 ">
            <SidebarItem Icon={Home} label="Página inicial" path="/feed" ativo={location.pathname === '/feed'} />
            <SidebarItem Icon={Search} label="Pesquisa" path="/busca" />
            <SidebarItem Icon={User} label="Perfil" path="/perfil" />
          </nav>
        </div>

        <div className="mb-4">
          <SidebarItem Icon={Settings} label="Configurações" path="/configuracoes" />
        </div>
      </aside>

      {/* CONTEÚDO À DIREITA */}
      <main className="flex-1 ml-20 lg:ml-64">
        {/* HEADER EXATAMENTE COMO A FOTO */}
        <header className="h-14 bg-white flex items-center justify-between px-8 sticky top-0 z-40 border-b border-gray-50">
          {/* Lado Esquerdo: Texto INÍCIO */}
          <span className="text-[11px] font-bold tracking-[0.2em] text-gray-400 uppercase">
            
          </span>
          
          {/* Lado Direito: Os 3 botões da foto na ordem correta */}
          <div className="flex items-center gap-5 text-gray-800">
            <Bell size={20} className="cursor-pointer hover:opacity-60 transition-opacity" />
            <Mail size={20} className="cursor-pointer hover:opacity-60 transition-opacity" />
            <Plus size={20} className="cursor-pointer hover:opacity-60 transition-opacity" />
          </div>
        </header>

        {/* Espaço do Feed */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};