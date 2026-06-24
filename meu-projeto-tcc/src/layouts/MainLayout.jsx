import React from 'react';
import Sidebar from '../components/Sidebar';

export function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full bg-[#fcfcfc] text-gray-900 antialiased selection:bg-gray-100">
      
      {/* 1. Componente de Navegação Lateral */}
      <Sidebar />

      {/* 2. Container do Conteúdo Principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        
        {/* 3. Área interna onde as páginas (Feed, Configurações, Perfil) são renderizadas */}
        <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 py-8 sm:px-8 sm:py-10 md:px-12 md:py-12 animate-in fade-in duration-300">
          {children}
        </main>
        
      </div>
      
    </div>
  );
}
