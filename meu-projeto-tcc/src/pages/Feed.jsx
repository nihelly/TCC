import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Repeat2, User, MoreHorizontal, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Anuncios } from '../components/Anuncios';

export default function Feed() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarPosts() {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPosts(data || []);
      } catch (err) {
        console.error('Erro ao carregar posts:', err.message);
      } finally {
        setCarregando(false);
      }
    }
    carregarPosts();
  }, []);

  // Auxiliar para gerar o tempo decorrido amigável (2min, 5h, 1d)
  const formatarTempo = (dataString) => {
    const diffMs = new Date() - new Date(dataString);
    const diffMin = Math.floor(diffMs / (1000 * 60));
    if (diffMin < 60) return `${diffMin || 1}min`;
    const diffHoras = Math.floor(diffMin / 60);
    if (diffHoras < 24) return `${diffHoras}h`;
    return `${Math.floor(diffHoras / 24)}d`;
  };

  return (
    <div className="w-full max-w-[1100px] mx-auto flex gap-8 animate-in fade-in duration-300">
      
      {/* COLUNA PRINCIPAL - POSTS */}
      <div className="flex-1 max-w-[650px] space-y-6">
        {/* Cabeçalho do Feed */}
        <div className="flex items-center justify-between">
          <h1 className="text-[14px] font-bold text-gray-950 tracking-widest uppercase">
            FEED
          </h1>
          <button
            onClick={() => navigate('/criar-post')}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-[12px] font-bold hover:bg-gray-900 transition-colors cursor-pointer shadow-sm"
          >
            <Plus size={14} />
            <span>Nova publicação</span>
          </button>
        </div>

        {/* Conteúdo do Feed */}
        {carregando ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-[2rem] p-12 text-center text-gray-400 text-[13px]">
            Nenhuma publicação por aqui ainda. Seja o primeiro a postar!
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white border border-gray-100 rounded-[1.8rem] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              {/* Header do Post */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-50 rounded-full border border-gray-100 flex items-center justify-center">
                    <User size={18} className="text-gray-300" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] text-gray-600 font-medium">{post.author_handle || '@usuario'}</span>
                    <span className="text-[10px] text-gray-400">{formatarTempo(post.created_at)}</span>
                  </div>
                </div>
                <MoreHorizontal size={18} className="text-gray-300 cursor-pointer" />
              </div>

              {/* Título e Conteúdo */}
              <div className="px-1">
                {post.title && (
                  <h2 className="text-[13px] font-bold text-gray-800 uppercase tracking-tight mb-2">
                    {post.title}
                  </h2>
                )}
                
                {post.content && (
                  <p className="text-[13px] text-gray-600 mb-4 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>
                )}

                {/* Imagem do post (se houver) */}
                {post.image_url && (
                  <div className="w-full rounded-[1.5rem] overflow-hidden border border-gray-100 mb-4">
                    <img src={post.image_url} alt="Imagem do post" className="w-full object-cover" />
                  </div>
                )}
              </div>

              {/* Footer / Interações */}
              <div className="flex items-center gap-4 mt-2 px-1">
                <div className="flex items-center gap-1.5 text-gray-400 text-[12px] hover:text-red-500 cursor-pointer transition-colors">
                  <Heart size={16} /> <span>{post.likes_count || 0}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400 text-[12px] hover:text-blue-500 cursor-pointer transition-colors">
                  <MessageCircle size={16} /> <span>{post.comments_count || 0}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400 text-[12px] hover:text-green-500 cursor-pointer transition-colors">
                  <Repeat2 size={16} /> <span>{post.reposts_count || 0}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* COLUNA LATERAL - ANÚNCIOS (Visível apenas em telas grandes) */}
      <div className="hidden lg:block w-[320px] flex-shrink-0">
        <div className="sticky top-8 space-y-6">
          <Anuncios />
        </div>
      </div>

    </div>
  );
}
