import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Mail, Plus, Heart, MessageCircle, Repeat2, MoreHorizontal, User, Megaphone } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner';

export default function Feed() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [meuPerfil, setMeuPerfil] = useState(null); // Guarda o papel (aluno/professor) do logado
  
  const [professores, setProfessores] = useState([]);
  const [anuncios, setAnuncios] = useState([]); // Agora busca do banco
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function inicializarFeed() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/login');
          return;
        }
        setCurrentUser(user);
        
        // 1. Busca o perfil do usuário logado para descobrir o seu "papel"
        const { data: perfilLogado } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (perfilLogado) setMeuPerfil(perfilLogado);

        // 2. Dispara todas as buscas paralelas
        await Promise.all([
          buscarPosts(user.id),
          buscarProfessores(),
          buscarAnuncios() // Busca os anúncios reais
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setCarregando(false);
      }
    }
    inicializarFeed();
  }, [navigate]);

  async function buscarPosts(userId) {
    const { data: postsData, error } = await supabase
      .from('posts')
      .select('*, likes(user_id)')
      .order('created_at', { ascending: false });

    if (error) return toast.error('Erro ao carregar feed');

    const meusLikes = [];
    const postsFormatados = postsData.map(post => {
      const curtidoPorMim = post.likes?.some(like => like.user_id === userId);
      if (curtidoPorMim) meusLikes.push(post.id);
      
      return { ...post, likes_count: post.likes?.length || 0 };
    });

    setPosts(postsFormatados);
    setLikedPosts(meusLikes);
  }

  async function buscarProfessores() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('papel', 'professor')
      .limit(4);

    if (!error && data && data.length > 0) {
      setProfessores(data);
    } else {
      setProfessores([
        { id: 'mock1', nome: 'Docente 1' },
        { id: 'mock2', nome: 'Docente 2' }
      ]);
    }
  }

  async function buscarAnuncios() {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3); // Pega os 3 recados mais recentes

    if (!error && data) setAnuncios(data);
  }

  const handleLike = async (post) => {
    if (!currentUser) return;
    const jaCurtido = likedPosts.includes(post.id);

    if (jaCurtido) {
      const { error } = await supabase.from('likes').delete().eq('post_id', post.id).eq('user_id', currentUser.id);
      if (!error) {
        setLikedPosts(prev => prev.filter(id => id !== post.id));
        setPosts(prev => prev.map(p => p.id === post.id ? { ...p, likes_count: p.likes_count - 1 } : p));
      }
    } else {
      const { error } = await supabase.from('likes').insert([{ post_id: post.id, user_id: currentUser.id }]);
      if (!error) {
        setLikedPosts(prev => [...prev, post.id]);
        setPosts(prev => prev.map(p => p.id === post.id ? { ...p, likes_count: p.likes_count + 1 } : p));
      }
    }
  };

  if (carregando) return <div className="text-center py-20 text-gray-400 text-sm">A carregar o ecossistema AcadNet...</div>;

  return (
    <div className="w-full max-w-[1200px] mx-auto space-y-6">
      
      {/* HEADER DO FEED */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-5">
        <h1 className="text-[19px] font-bold text-gray-950 tracking-wider">INÍCIO</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/notificacoes')} className="p-2 text-gray-700 hover:text-black hover:bg-gray-50 rounded-xl transition-all cursor-pointer">
            <Bell size={20} strokeWidth={1.8} />
          </button>
          <button onClick={() => navigate('/mensagens')} className="p-2 text-gray-700 hover:text-black hover:bg-gray-50 rounded-xl transition-all cursor-pointer">
            <Mail size={20} strokeWidth={1.8} />
          </button>
          <button onClick={() => navigate('/criar-post')} className="p-2 text-gray-700 hover:text-black hover:bg-gray-50 rounded-xl transition-all cursor-pointer">
            <Plus size={20} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* COLUNA DE POSTAGENS */}
        <div className="lg:col-span-2 space-y-4">
          {posts.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-[2rem] p-8 text-center text-gray-400 text-[13px]">
              Nenhuma publicação por aqui ainda. Seja o primeiro a partilhar algo! 🙌
            </div>
          ) : (
            posts.map((post) => (
              <article key={post.id} className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.005)] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-[12px] font-bold text-gray-500">
                      {post.author_handle.substring(1,3).toUpperCase()}
                    </div>
                    <span className="text-[13px] font-medium text-gray-700">{post.author_handle}</span>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 p-1"><MoreHorizontal size={18} /></button>
                </div>

                <div className="space-y-2">
                  <h2 className="text-[14px] font-bold text-gray-950 tracking-tight">{post.title}</h2>
                  {post.image_url && (
                    <div className="w-full h-[260px] rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
                      <img src={post.image_url} alt="Post" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex justify-between items-end pt-1">
                    <div></div>
                    <span className="text-[12px] text-gray-500 font-light leading-relaxed">{post.content}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-2 border-t border-gray-50 text-[12px] text-gray-400 font-medium">
                  <button onClick={() => handleLike(post)} className={`flex items-center gap-1.5 transition-colors cursor-pointer hover:text-red-500 ${likedPosts.includes(post.id) ? 'text-red-500 font-bold' : ''}`}>
                    <Heart size={16} strokeWidth={1.8} className={likedPosts.includes(post.id) ? 'fill-red-500' : ''} />
                    <span>{post.likes_count}</span>
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors cursor-pointer">
                    <MessageCircle size={16} strokeWidth={1.8} />
                    <span>0</span>
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-green-500 transition-colors cursor-pointer">
                    <Repeat2 size={16} strokeWidth={1.8} />
                    <span>0</span>
                  </button>
                </div>
              </article>
            ))
          )}
        </div>

        {/* CARD LATERAL (PROFESSORES & AVISOS) */}
        <div className="bg-white border border-gray-100 rounded-[2rem] p-6 flex flex-col space-y-6 shadow-[0_4px_20px_rgba(0,0,0,0.005)]">
          
          <div className="flex items-center justify-around pb-5 border-b border-gray-100">
            {professores.map((prof) => (
              <div key={prof.id} className="flex flex-col items-center gap-1.5 group cursor-pointer" title={prof.nome}>
                <div className="w-11 h-11 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-gray-400 group-hover:border-gray-300 transition-all">
                  {prof.avatar_url ? (
                    <img src={prof.avatar_url} alt={prof.nome} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User size={20} strokeWidth={1.5} />
                  )}
                </div>
                <span className="text-[10px] text-gray-400 font-light group-hover:text-gray-600 transition-colors">
                  docente
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            
            {/* CABEÇALHO DO MURAL AJUSTADO */}
            <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <Megaphone size={14} className="text-gray-900" />
                <h3 className="text-[11px] font-bold tracking-wider text-gray-900 uppercase">
                  Mural de Avisos
                </h3>
              </div>
              
              {/* Exibe o botão '+ CRIAR' perfeitamente alinhado se for professor */}
              {meuPerfil?.papel === 'professor' && (
                <button 
                  onClick={() => navigate('/criar-aviso')}
                  className="flex items-center gap-1 text-[10px] font-bold bg-black text-white px-3 py-1.5 rounded-xl hover:bg-gray-800 transition-colors cursor-pointer shadow-sm"
                >
                  <Plus size={11} strokeWidth={2.5} />
                  <span>CRIAR</span>
                </button>
              )}
            </div>

            {/* LISTA DE AVISOS REAIS */}
            <div className="space-y-3">
              {anuncios.map((anuncio) => (
                <div key={anuncio.id} className="bg-[#fcfcfc] border border-gray-100 rounded-2xl p-4 space-y-1">
                  <h4 className="text-[12px] font-bold text-gray-950 tracking-tight">{anuncio.titulo}</h4>
                  <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1">
                    {anuncio.professor_nome} • <span className="text-gray-400 font-normal">{anuncio.materia}</span>
                  </div>
                </div>
              ))}
              {anuncios.length === 0 && (
                <p className="text-[11px] text-gray-400 text-center py-2">Sem avisos no momento.</p>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}