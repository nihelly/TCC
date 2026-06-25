import React from 'react';
import { Bell, Mail, Plus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import GeometricBackground from '../components/GeometricBackground';

const tituloPorRota = {
  '/feed': 'Início',
  '/busca': 'Explorar',
  '/mensagens': 'Mensagens',
  '/notificacoes': 'Notificações',
  '/configuracoes': 'Configurações',
  '/criar-post': 'Nova publicação',
  '/criar-aviso': 'Novo aviso',
};

export function MainLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const tituloAtual = tituloPorRota[location.pathname] ||
    (location.pathname.startsWith('/perfil') ? 'Perfil' : 'EduConnect');

  return (
    <div className="app-shell flex w-full antialiased relative z-[1]">
      <GeometricBackground />
      <Sidebar />

      <div className="flex-1 flex min-w-0 flex-col overflow-x-hidden">
        <header className="sticky top-0 z-20 border-b border-[rgba(148,163,184,0.14)] bg-[#0B0F19]/82 backdrop-blur-xl">
          <div className="app-container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#94A3B8]">
                EduConnect
              </p>
              <h1 className="text-[20px] font-bold leading-tight text-[#F8FAFC]">
                {tituloAtual}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/notificacoes')}
                className="focus-ring relative flex h-10 w-10 items-center justify-center rounded-lg border border-transparent text-[#94A3B8] transition-colors hover:bg-[#111827] hover:text-[#F8FAFC]"
                aria-label="Notificações"
                title="Notificações"
              >
                <Bell size={18} strokeWidth={1.8} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#3B82F6]" />
              </button>
              <button
                onClick={() => navigate('/mensagens')}
                className="focus-ring flex h-10 w-10 items-center justify-center rounded-lg border border-transparent text-[#94A3B8] transition-colors hover:bg-[#111827] hover:text-[#F8FAFC]"
                aria-label="Mensagens"
                title="Mensagens"
              >
                <Mail size={18} strokeWidth={1.8} />
              </button>
              <button
                onClick={() => navigate('/criar-post')}
                className="btn-primary px-4 text-sm"
                title="Nova publicação"
              >
                <Plus size={18} strokeWidth={2} />
                <span className="hidden sm:inline">Publicar</span>
              </button>
            </div>
          </div>
        </header>

        <main className="app-container flex-1 px-4 pb-24 pt-6 sm:px-6 sm:pt-8 md:pb-8 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
