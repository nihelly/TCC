import React from 'react';
import { Settings, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Perfil({ perfil, metrics, isDono, isFollowing, toggleFollow }) {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-[600px] mx-auto md:pt-4">
      
      {/* 1. TOP BAR DO PERFIL */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50 sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <span className="text-[16px] font-bold text-gray-950 tracking-tight">@{perfil?.handle}</span>
        <div className="flex items-center gap-4 text-gray-800">
          {isDono && (
            <button onClick={() => navigate('/configuracoes')} className="hover:opacity-70 transition-opacity cursor-pointer">
              <Settings size={22} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>

      {/* 2. HEADER: AVATAR + METRICAS */}
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between gap-6">
          {/* FOTO DO USUÁRIO */}
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-full flex-shrink-0 overflow-hidden border border-gray-200 shadow-inner">
            {perfil?.avatar_url ? (
              <img src={perfil.avatar_url} alt={perfil.nome} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400"><User size={40} /></div>
            )}
          </div>

          {/* CONTADORES (ESTILO INSTAGRAM) */}
          <div className="flex-1 flex justify-around text-center">
            <div className="flex flex-col"><span className="text-[16px] font-bold text-gray-950">{metrics?.posts || 0}</span><span className="text-[12px] text-gray-400">posts</span></div>
            <div className="flex flex-col"><span className="text-[16px] font-bold text-gray-950">{metrics?.seguidores || 0}</span><span className="text-[12px] text-gray-400">seguidores</span></div>
            <div className="flex flex-col"><span className="text-[16px] font-bold text-gray-950">{metrics?.seguindo || 0}</span><span className="text-[12px] text-gray-400">seguindo</span></div>
          </div>
        </div>

        {/* 3. BIOGRAFIA */}
        <div className="text-[14px] space-y-0.5">
          <h2 className="font-bold text-gray-950">{perfil?.nome}</h2>
          <p className="text-gray-600 font-light leading-relaxed whitespace-pre-line text-[13px]">
            {perfil?.biografia || 'Nenhuma apresentação disponível ainda.'}
          </p>
        </div>

        {/* 4. BOTÕES DE AÇÃO */}
        <div className="pt-2">
          {isDono ? (
            <button 
              onClick={() => navigate('/editar-perfil')} 
              className="w-full bg-gray-100 hover:bg-gray-200/80 text-gray-950 text-[13px] font-semibold py-2 rounded-xl transition-all cursor-pointer text-center"
            >
              Editar perfil
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={toggleFollow} className={`flex-1 text-[13px] font-bold py-2 rounded-xl text-center transition-all cursor-pointer ${isFollowing ? 'bg-gray-100 text-gray-800' : 'bg-black text-white'}`}>
                {isFollowing ? 'Seguindo' : 'Seguir'}
              </button>
              <button onClick={() => navigate('/mensagens')} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-950 text-[13px] font-semibold py-2 rounded-xl text-center cursor-pointer">
                Mensagem
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SEÇÃO DAS ABAS E FEEDS ABAIXO... */}
    </div>
  );
}