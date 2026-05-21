import React, { useState } from 'react';
import { User, Settings, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Perfil() {
  const navigate = useNavigate();
  // Estado para controlar a aba ativa exatamente como no design (POSTS ou REPOSTS)
  const [abaAtiva, setAbaAtiva] = useState('posts');

  return (
    <div className="max-w-[800px] mx-auto pt-4 pb-20 px-4 animate-in fade-in duration-500">
      
      {/* HEADER DA PÁGINA DE PERFIL */}
      <div className="flex items-center justify-between mb-8">
        {/* Lado Esquerdo: Texto PERFIL idêntico ao restante do app */}
        <span className="text-[11px] font-bold tracking-[0.2em] text-gray-800 uppercase">
          Perfil
        </span>
        
        {/* Lado Direito: Botões de Configurações e Favoritos */}
        <div className="flex items-center gap-5 text-gray-500">
          <Star size={20} className="cursor-pointer hover:text-black transition-colors" onClick={() => navigate('/')} />
           <Settings 
            size={20} 
            className="cursor-pointer hover:text-black transition-colors" 
            onClick={() => navigate('/')}
          />
        </div>
      </div>

      {/* DETALHES DO USUÁRIO CENTRALIZADOS */}
      <div className="flex flex-col items-center text-center mt-12 mb-10">
        {/* Círculo com Ícone de Usuário */}
        <div className="w-24 h-24 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
          <User size={44} className="text-gray-300" />
        </div>

        {/* Username */}
        <h2 className="text-[14px] font-medium text-gray-900 mb-4">
          @aluno.teste
        </h2>

        {/* CONTADORES (Estatísticas horizontais) */}
        <div className="flex items-center gap-6 text-[13px] text-gray-500 mb-4 font-normal">
          <div>
            posts <span className="font-semibold text-gray-800 ml-0.5">0</span>
          </div>
          <div>
            seguidores <span className="font-semibold text-gray-800 ml-0.5">0</span>
          </div>
          <div>
            seguindo <span className="font-semibold text-gray-800 ml-0.5">0</span>
          </div>
        </div>

        {/* Biografia */}
        <p className="text-[12px] text-gray-400 font-light">
          biografia
        </p>
      </div>

      {/* SELETOR DE ABAS (POSTS / REPOSTS) */}
      <div className="border-t border-gray-100 flex justify-center mb-6">
        <div className="flex gap-16 -mt-[1px]">
          {/* Aba POSTS */}
          <button
            onClick={() => setAbaAtiva('posts')}
            className={`py-3 px-8 text-[11px] font-bold tracking-wider transition-all border-t-2 uppercase
              ${abaAtiva === 'posts' 
                ? 'border-black text-black' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
          >
            Posts
          </button>

          {/* Aba REPOSTS */}
          <button
            onClick={() => setAbaAtiva('reposts')}
            className={`py-3 px-8 text-[11px] font-bold tracking-wider transition-all border-t-2 uppercase
              ${abaAtiva === 'reposts' 
                ? 'border-black text-black' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
          >
            Reposts
          </button>
        </div>
      </div>

      {/* CONTAINER DE CONTEÚDO (Cards de post vazios iguazinhas ao seu print) */}
      <div className="space-y-4">
        {abaAtiva === 'posts' ? (
          <>
            {/* Bloco Placeholder de Post 1 */}
            <div className="w-full h-32 bg-gray-50/50 border border-gray-100 rounded-[1.5rem] transition-all"></div>
            {/* Bloco Placeholder de Post 2 */}
            <div className="w-full h-32 bg-gray-50/50 border border-gray-100 rounded-[1.5rem] transition-all"></div>
          </>
        ) : (
          <div className="text-center py-12 text-[12px] text-gray-400 italic">
            Nenhum repost compartilhado ainda.
          </div>
        )}
      </div>

    </div>
  );
}