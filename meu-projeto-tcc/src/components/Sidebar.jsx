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

  // Estilo dinâmico para os links (sidebar compacta, só ícones)
  const linkStyle = ({ isActive }) => 
    `flex items-center justify-center w-11 h-11 rounded-2xl transition-all group ${
      isActive 
        ? 'bg-gray-100 text-gray-950' 
        : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50/60'
    }`;

  return (
    <aside className="w-[60px] h-screen bg-white border-r border-r-gray-100 flex flex-col items-center justify-between py-6 sticky top-0 select-none flex-shrink-0">
      
      {/* Bloco Superior: Logo + Navegação */}
      <div className="flex flex-col items-center gap-6">
        
        {/* LOGO DO EDUCONNECT (só ícone) */}
        <div className="mb-2">
          <img src="/src/assets/logo-educonnect.png" alt="EduConnect" className="w-8 h-8 object-contain" />
        </div>

        {/* LINKS DE NAVEGAÇÃO */}
        <nav className="flex flex-col items-center gap-2">
          <NavLink to="/feed" className={linkStyle} title="Início">
            <Home size={20} strokeWidth={1.8} />
          </NavLink>

          <NavLink to="/busca" className={linkStyle} title="Buscar">
            <Search size={20} strokeWidth={1.8} />
          </NavLink>

          {/* ROTA DINÂMICA DO PERFIL */}
          {userId ? (
            <NavLink to={`/perfil/${userId}`} className={linkStyle} title="Meu Perfil">
              <User size={20} strokeWidth={1.8} />
            </NavLink>
          ) : (
            <div className="flex items-center justify-center w-11 h-11 text-gray-300">
              <Loader2 size={20} className="animate-spin" />
            </div>
          )}
        </nav>
      </div>

      {/* Bloco Inferior: Configurações */}
      <div>
        <NavLink to="/configuracoes" className={linkStyle} title="Configurações">
          <Settings size={20} strokeWidth={1.8} />
        </NavLink>
      </div>

    </aside>
  );
}