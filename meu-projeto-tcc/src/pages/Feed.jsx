import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, GraduationCap, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Anuncios } from '../components/Anuncios';
import { PostCard } from '../components/PostCard';

function FeedSkeleton() {
  return (
    <div className="space-y-4">
      {[0, 1, 2].map((item) => (
        <div key={item} className="ui-card p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="skeleton h-11 w-11 rounded-full" />
            <div className="space-y-2">
              <div className="skeleton h-3 w-32 rounded" />
              <div className="skeleton h-3 w-20 rounded" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="skeleton h-5 w-3/4 rounded" />
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-5/6 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Feed() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);

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

  const postsExemplo = useMemo(() => ([
    {
      id: 'ex1',
      author_handle: '@ana.design',
      title: 'Checklist para apresentação do TCC',
      content: 'Organizei um roteiro rápido para revisar problema, objetivos, metodologia e próximos passos antes da banca.',
      image_url: null,
      has_image_placeholder: true,
      likes_count: 24,
      comments_count: 8,
      reposts_count: 3,
      created_at: new Date().toISOString(),
    },
    {
      id: 'ex2',
      author_handle: '@prof.helena',
      title: 'Plantão de dúvidas nesta sexta',
      content: 'Atendimento das 14h às 16h no laboratório 03. Tragam perguntas sobre modelagem, referências e cronograma.',
      image_url: null,
      has_image_placeholder: false,
      likes_count: 18,
      comments_count: 5,
      reposts_count: 2,
      created_at: new Date().toISOString(),
    },
  ]), []);

  const listaDePostagens = posts.length > 0 ? posts : postsExemplo;
  const visiblePosts = listaDePostagens.slice(0, visibleCount);

  useEffect(() => {
    const onScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 420;
      if (nearBottom) {
        setVisibleCount((current) => Math.min(current + 4, listaDePostagens.length));
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [listaDePostagens.length]);

  return (
    <div className="grid w-full grid-cols-1 gap-6 pb-24 lg:grid-cols-[minmax(0,720px)_320px] xl:grid-cols-[minmax(0,760px)_340px]">
      <section className="min-w-0 space-y-5">
        <div className="surface-panel rounded-lg p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-[#94A3B8]">
                <GraduationCap size={18} />
                <span className="text-[13px] font-semibold uppercase tracking-[0.14em]">Feed acadêmico</span>
              </div>
              <h2 className="text-[24px] font-bold leading-tight text-[#F8FAFC]">
                Atualizações da comunidade
              </h2>
              <p className="mt-1 max-w-xl text-[14px] leading-relaxed text-[#94A3B8]">
                Posts, avisos e materiais em uma linha do tempo mais clara e fácil de escanear.
              </p>
            </div>
            <button onClick={() => navigate('/criar-post')} className="btn-primary px-4 text-sm">
              <Plus size={17} />
              Nova publicação
            </button>
          </div>
        </div>

        {carregando ? (
          <FeedSkeleton />
        ) : listaDePostagens.length === 0 ? (
          <div className="ui-card flex min-h-[280px] flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-[#0F172A] text-[#3B82F6]">
              <BookOpen size={26} />
            </div>
            <h2 className="text-[20px] font-bold text-[#F8FAFC]">Nenhuma publicação ainda</h2>
            <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-[#94A3B8]">
              Seja a primeira pessoa a compartilhar materiais, dúvidas ou atualizações do curso.
            </p>
            <button onClick={() => navigate('/criar-post')} className="btn-primary mt-5 px-4 text-sm">
              <Plus size={17} />
              Publicar agora
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {visiblePosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
            {visibleCount < listaDePostagens.length && (
              <div className="py-4 text-center text-[13px] font-medium text-[#94A3B8]">
                Carregando mais publicações...
              </div>
            )}
          </div>
        )}
      </section>

      <div className="hidden min-w-0 lg:block">
        <div className="sticky top-24">
          <Anuncios />
        </div>
      </div>
    </div>
  );
}
