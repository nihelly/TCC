import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, Home, Loader2, Mail, Search, Settings, User } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import logoDark from '../assets/logo-educonnect-dark.png';

export default function Sidebar() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    async function obterUsuarioLogado() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    }
    obterUsuarioLogado();
  }, []);

  const navItems = [
    { to: '/feed', label: 'Início', icon: Home },
    { to: '/busca', label: 'Explorar', icon: Search },
    { to: userId ? `/perfil/${userId}` : null, label: 'Perfil', icon: User },
    { to: '/mensagens', label: 'Mensagens', icon: Mail },
  ];

  const linkClass = ({ isActive }) =>
    [
      'group relative flex h-11 w-11 items-center justify-center rounded-lg transition-all duration-150 lg:w-full lg:justify-start lg:gap-3 lg:px-3',
      isActive
        ? 'bg-[#1A2234] text-[#F8FAFC] shadow-[inset_3px_0_0_#3B82F6]'
        : 'text-[#94A3B8] hover:bg-[#111827] hover:text-[#F8FAFC]'
    ].join(' ');

  return (
    <>
    <aside className="sticky top-0 z-30 hidden h-screen w-[76px] flex-shrink-0 border-r border-[rgba(148,163,184,0.14)] bg-[#0B0F19]/92 px-3 py-5 backdrop-blur-xl md:flex lg:w-[236px]">
      <div className="flex w-full flex-col justify-between">
        <div className="space-y-8">
          <NavLink
            to="/feed"
            className="focus-ring flex items-center justify-center gap-3 rounded-lg lg:justify-start"
            title="EduConnect"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-[rgba(148,163,184,0.14)] bg-[#111827]">
              <img src={logoDark} alt="EduConnect" className="h-8 w-8 object-contain" />
            </span>
            <span className="hidden leading-tight lg:block">
              <span className="block text-[16px] font-bold text-[#F8FAFC]">EduConnect</span>
              <span className="block text-[12px] font-medium text-[#94A3B8]">Rede acadêmica</span>
            </span>
          </NavLink>

          <nav className="space-y-1" aria-label="Navegação principal">
            {navItems.map((item) => {
              const Icon = item.icon;
              if (!item.to) {
                return (
                  <div key={item.label} className="flex h-11 w-11 items-center justify-center rounded-lg text-[#64748B] lg:w-full lg:justify-start lg:px-3">
                    <Loader2 size={20} className="animate-spin" />
                    <span className="ml-3 hidden text-sm font-semibold lg:inline">{item.label}</span>
                  </div>
                );
              }

              return (
                <NavLink key={item.label} to={item.to} className={linkClass} title={item.label}>
                  <Icon size={20} strokeWidth={1.9} />
                  <span className="hidden text-sm font-semibold lg:inline">{item.label}</span>
                  <span className="pointer-events-none absolute left-[54px] z-40 hidden whitespace-nowrap rounded-md border border-[rgba(148,163,184,0.14)] bg-[#111827] px-2 py-1 text-xs font-semibold text-[#F8FAFC] opacity-0 shadow-lg transition-opacity group-hover:opacity-100 md:group-hover:block lg:hidden">
                    {item.label}
                  </span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="space-y-2">
          <div className="hidden rounded-lg border border-[rgba(148,163,184,0.14)] bg-[#111827]/70 p-3 lg:block">
            <div className="mb-2 flex items-center gap-2 text-[#CBD5E1]">
              <Compass size={16} />
              <span className="text-sm font-semibold">Campus online</span>
            </div>
            <p className="text-xs leading-relaxed text-[#94A3B8]">
              Comunicação acadêmica com foco em avisos, materiais e colaboração.
            </p>
          </div>

          <NavLink to="/configuracoes" className={linkClass} title="Configurações">
            <Settings size={20} strokeWidth={1.9} />
            <span className="hidden text-sm font-semibold lg:inline">Configurações</span>
          </NavLink>
        </div>
      </div>
    </aside>

    <nav className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-around rounded-lg border border-[rgba(148,163,184,0.18)] bg-[#111827]/94 p-2 shadow-2xl backdrop-blur-xl md:hidden" aria-label="Navegação mobile">
      {[...navItems, { to: '/configuracoes', label: 'Configurações', icon: Settings }].map((item) => {
        const Icon = item.icon;
        if (!item.to) return null;
        return (
          <NavLink
            key={item.label}
            to={item.to}
            title={item.label}
            className={({ isActive }) =>
              `focus-ring flex h-11 w-11 items-center justify-center rounded-lg transition-colors ${
                isActive ? 'bg-[#1A2234] text-[#3B82F6]' : 'text-[#94A3B8] hover:bg-[#1A2234] hover:text-[#F8FAFC]'
              }`
            }
          >
            <Icon size={20} strokeWidth={1.9} />
          </NavLink>
        );
      })}
    </nav>
    </>
  );
}
