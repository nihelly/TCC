import React, { useState, useEffect } from 'react';
import { Settings, User } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';

export default function Perfil() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { usuario } = useAuth();
  
  const [perfil, setPerfil] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState('posts');
  const [metrics, setMetrics] = useState({ posts: 0, seguidores: 0, seguindo: 0 });
  const [isFollowing, setIsFollowing] = useState(false);

  // Determina se é o próprio perfil do usuário logado
  const perfilId = id || usuario?.id;
  const isDono = usuario?.id === perfilId;

  useEffect(() => {
    async function carregarPerfil() {
      if (!perfilId) return;
      setCarregando(true);

      try {
        // Busca dados do perfil
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', perfilId)
          .single();

        if (error) throw error;
        setPerfil(data);

        // Contar posts do usuário
        const { count: postCount } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', perfilId);

        setMetrics(prev => ({ ...prev, posts: postCount || 0 }));
      } catch (err) {
        console.error('Erro ao carregar perfil:', err.message);
      } finally {
        setCarregando(false);
      }
    }
    carregarPerfil();
  }, [perfilId]);

  const toggleFollow = () => setIsFollowing(!isFollowing);

  if (carregando) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[600px] mx-auto md:pt-4">
      
      {/* 1. TOP BAR DO PERFIL */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50 sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <span className="text-[16px] font-bold text-gray-950 tracking-tight">
          @{perfil?.handle || perfil?.nome?.toLowerCase().replace(/\s+/g, '') || 'usuario'}
        </span>
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
            <div className="flex flex-col">
              <span className="text-[16px] font-bold text-gray-950">{metrics?.posts || 0}</span>
              <span className="text-[12px] text-gray-400">posts</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[16px] font-bold text-gray-950">{metrics?.seguidores || 0}</span>
              <span className="text-[12px] text-gray-400">seguidores</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[16px] font-bold text-gray-950">{metrics?.seguindo || 0}</span>
              <span className="text-[12px] text-gray-400">seguindo</span>
            </div>
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
              onClick={() => navigate('/perfil/editar')} 
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

      {/* CONTAINER DE CONTEÚDO */}
      <div className="space-y-4">
        {abaAtiva === 'posts' ? (
          <>
            {/* Blocos Placeholder de Post */}
            <div className="w-full h-32 bg-gray-50/50 border border-gray-100 rounded-[1.5rem] transition-all"></div>
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