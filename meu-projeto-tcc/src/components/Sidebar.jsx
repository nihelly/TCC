import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Search, User, Settings, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function Sidebar() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  // Busca o ID do usuário logado para montar a rota dinâmica do perfil
  useEffect(() => {
    async function obterUsuarioLogado() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    }
    obterUsuarioLogado();
  }, []);

  // Estilo padrão e dinâmico para os links da Sidebar
  const linkStyle = ({ isActive }) => 
    `flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-medium transition-all group ${
      isActive 
        ? 'bg-gray-100 text-gray-950 font-semibold' 
        : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50/60'
    }`;

  return (
    <aside className="w-[260px] h-screen bg-white border-r border-r-gray-100 flex flex-col justify-between p-6 sticky top-0 select-none">
      
      {/* Bloco Superior: Logo e Rotas */}
      <div className="flex flex-col gap-8">
        
        {/* LOGO DO EDUCONNECT */}
        <div className="flex items-center gap-2 px-4 py-1">
          <img src="/src/assets/logo-educonnect.png" alt="EduConnect" className="w-8 h-8 object-contain" />
          <span className="text-[15px] font-bold text-gray-950 tracking-tight">EduConnect</span>
        </div>

        {/* LINKS DE NAVEGAÇÃO SUPERIORES */}
        <nav className="flex flex-col gap-1.5">
          <NavLink to="/feed" className={linkStyle}>
            <Home size={18} strokeWidth={1.8} />
            <span>Início</span>
          </NavLink>

          <NavLink to="/busca" className={linkStyle}>
            <Search size={18} strokeWidth={1.8} />
            <span>Buscar</span>
          </NavLink>

          {/* ROTA DINÂMICA DO PERFIL */}
          {userId ? (
            <NavLink to={`/perfil/${userId}`} className={linkStyle}>
              <User size={18} strokeWidth={1.8} />
              <span>Meu Perfil</span>
            </NavLink>
          ) : (
            <div className="flex items-center gap-3 px-4 py-3 text-[13px] font-medium text-gray-300">
              <Loader2 size={18} className="animate-spin" />
              <span>A carregar perfil...</span>
            </div>
          )}
        </nav>
      </div>

      {/* Bloco Inferior: Apenas Configurações */}
      <div className="border-t border-gray-50 pt-4">
        <NavLink to="/configuracoes" className={linkStyle}>
          <Settings size={18} strokeWidth={1.8} />
          <span>Configurações</span>
        </NavLink>
      </div>

    </aside>
  );
}