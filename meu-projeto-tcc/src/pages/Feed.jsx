import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Repeat2, User, MoreHorizontal } from 'lucide-react';
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

  // Posts de exemplo para quando o banco estiver vazio
  const postsExemplo = [
    {
      id: 'ex1',
      author_handle: '@aluno.exemplo',
      title: 'TÍTULO',
      content: '',
      image_url: null,
      has_image_placeholder: true,
      likes_count: 100,
      comments_count: 100,
      reposts_count: 100,
      body_label: '(corpo da postagem)',
    },
    {
      id: 'ex2',
      author_handle: '@aluno.exemplo',
      title: 'TÍTULO',
      content: 'Bom dia!',
      image_url: null,
      has_image_placeholder: false,
      likes_count: 100,
      comments_count: 100,
      reposts_count: 100,
      body_label: '(corpo da postagem)',
    },
  ];

  const listaDePostagens = posts.length > 0 ? posts : postsExemplo;

  return (
    <div className="w-full flex gap-8">
      
      {/* ═══════ COLUNA PRINCIPAL — POSTS ═══════ */}
      <div className="flex-1 max-w-[650px] space-y-4">

        {/* Estado de carregamento */}
        {carregando ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          listaDePostagens.map((post) => (
            <div key={post.id} className="bg-white border border-gray-100 rounded-[1.5rem] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
              
              {/* Header do Post: Avatar + Handle + Menu */}
              <div className="flex items-center justify-between px-5 pt-4 pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-50 rounded-full border border-gray-100 flex items-center justify-center flex-shrink-0">
                    <User size={16} className="text-gray-300" />
                  </div>
                  <span className="text-[13px] text-gray-500 font-medium">{post.author_handle || '@aluno.exemplo'}</span>
                </div>
                <button className="text-gray-300 hover:text-gray-500 transition-colors cursor-pointer p-1">
                  <MoreHorizontal size={18} />
                </button>
              </div>

              {/* Título */}
              <div className="px-5 pb-2">
                <h2 className="text-[14px] font-bold text-gray-900 uppercase tracking-tight">
                  {post.title || 'TÍTULO'}
                </h2>
              </div>

              {/* Imagem ou placeholder de imagem */}
              {(post.image_url || post.has_image_placeholder) && (
                <div className="mx-5 mb-3">
                  {post.image_url ? (
                    <div className="w-full rounded-xl overflow-hidden border border-gray-100">
                      <img src={post.image_url} alt="Imagem do post" className="w-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-full h-[180px] bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center">
                      <span className="text-[11px] text-gray-300 italic">imagem</span>
                    </div>
                  )}
                </div>
              )}

              {/* Conteúdo textual */}
              {post.content && (
                <div className="px-5 pb-2">
                  <p className="text-[13px] text-gray-600 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>
                </div>
              )}

              {/* Footer: Interações + Label do corpo */}
              <div className="flex items-center justify-between px-5 pb-4 pt-1">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-gray-400 text-[12px] hover:text-red-500 cursor-pointer transition-colors">
                    <Heart size={15} strokeWidth={1.5} /> 
                    <span className="text-blue-500 font-medium">{post.likes_count || 0}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400 text-[12px] hover:text-blue-500 cursor-pointer transition-colors">
                    <MessageCircle size={15} strokeWidth={1.5} /> 
                    <span>{post.comments_count || 0}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400 text-[12px] hover:text-green-500 cursor-pointer transition-colors">
                    <Repeat2 size={15} strokeWidth={1.5} /> 
                    <span>{post.reposts_count || 0}</span>
                  </div>
                </div>

                {/* Label "corpo da postagem" no canto direito */}
                {post.body_label && (
                  <span className="text-[11px] text-gray-300 italic">
                    {post.body_label}
                  </span>
                )}
              </div>

            </div>
          ))
        )}
      </div>

      {/* ═══════ COLUNA LATERAL DIREITA — PROFESSORES + ANÚNCIOS ═══════ */}
      <div className="hidden lg:block w-[280px] flex-shrink-0">
        <div className="sticky top-[72px] space-y-4">
          <Anuncios />
        </div>
      </div>

    </div>
  );
}
