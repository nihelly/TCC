import React, { useEffect, useState } from 'react';
import { Edit3, FileText, MessageCircle, Settings, User } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';

function initials(nome = 'Usuario') {
  return nome
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export default function Perfil() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { usuario } = useAuth();

  const [perfil, setPerfil] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState('posts');
  const [metrics, setMetrics] = useState({ posts: 0, seguidores: 0, seguindo: 0 });
  const [isFollowing, setIsFollowing] = useState(false);

  const perfilId = id || usuario?.id;
  const isDono = usuario?.id === perfilId;

  useEffect(() => {
    async function carregarPerfil() {
      if (!perfilId) return;
      setCarregando(true);

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', perfilId)
          .single();

        if (error) throw error;
        setPerfil(data);

        const { count: postCount } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', perfilId);

        setMetrics((prev) => ({ ...prev, posts: postCount || 0 }));
      } catch (err) {
        console.error('Erro ao carregar perfil:', err.message);
      } finally {
        setCarregando(false);
      }
    }
    carregarPerfil();
  }, [perfilId]);

  if (carregando) {
    return (
      <div className="mx-auto max-w-[760px]">
        <div className="ui-card p-6">
          <div className="mb-6 flex items-center gap-4">
            <div className="skeleton h-20 w-20 rounded-full" />
            <div className="space-y-3">
              <div className="skeleton h-5 w-48 rounded" />
              <div className="skeleton h-4 w-64 rounded" />
            </div>
          </div>
          <div className="skeleton h-28 rounded-lg" />
        </div>
      </div>
    );
  }

  const nome = perfil?.nome || 'Usuário EduConnect';
  const handle = perfil?.handle || nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '');

  return (
    <div className="mx-auto w-full max-w-[820px] space-y-5 pb-24">
      <section className="ui-card overflow-hidden">
        <div className="h-28 border-b border-[rgba(148,163,184,0.12)] bg-[linear-gradient(135deg,rgba(59,130,246,0.22),rgba(34,197,94,0.08))]" />
        <div className="p-5 sm:p-6">
          <div className="-mt-16 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-[#1A2234] bg-[#0F172A] shadow-xl">
                {perfil?.avatar_url ? (
                  <img src={perfil.avatar_url} alt={nome} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[24px] font-bold text-[#E2E8F0]">
                    {initials(nome)}
                  </div>
                )}
                <span className="absolute bottom-2 right-2 h-4 w-4 rounded-full border-2 border-[#1A2234] bg-[#22C55E]" title="Online" />
              </div>
              <div className="pb-1">
                <h1 className="text-[24px] font-bold text-[#F8FAFC]">{nome}</h1>
                <p className="text-[14px] font-medium text-[#94A3B8]">@{handle}</p>
              </div>
            </div>

            <div className="flex gap-2">
              {isDono ? (
                <>
                  <button onClick={() => navigate('/perfil/editar')} className="btn-primary px-4 text-sm">
                    <Edit3 size={16} />
                    Editar
                  </button>
                  <button onClick={() => navigate('/configuracoes')} className="btn-secondary px-4 text-sm" aria-label="Configurações">
                    <Settings size={16} />
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setIsFollowing(!isFollowing)} className={isFollowing ? 'btn-secondary px-4 text-sm' : 'btn-primary px-4 text-sm'}>
                    {isFollowing ? 'Seguindo' : 'Seguir'}
                  </button>
                  <button onClick={() => navigate('/mensagens')} className="btn-secondary px-4 text-sm">
                    <MessageCircle size={16} />
                    Mensagem
                  </button>
                </>
              )}
            </div>
          </div>

          <p className="mt-5 max-w-2xl whitespace-pre-line text-[15px] leading-relaxed text-[#CBD5E1]">
            {perfil?.biografia || 'Nenhuma apresentação disponível ainda.'}
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { label: 'Posts', value: metrics.posts || 0 },
              { label: 'Seguidores', value: metrics.seguidores || 0 },
              { label: 'Seguindo', value: metrics.seguindo || 0 },
            ].map((metric) => (
              <div key={metric.label} className="rounded-lg border border-[rgba(148,163,184,0.12)] bg-[#0F172A]/70 p-3 text-center">
                <div className="text-[20px] font-bold text-[#F8FAFC]">{metric.value}</div>
                <div className="text-[12px] font-medium text-[#94A3B8]">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ui-card">
        <div className="flex border-b border-[rgba(148,163,184,0.12)] p-2">
          {[
            { id: 'posts', label: 'Posts' },
            { id: 'reposts', label: 'Reposts' },
          ].map((aba) => (
            <button
              key={aba.id}
              onClick={() => setAbaAtiva(aba.id)}
              className={`focus-ring flex-1 rounded-lg px-4 py-2.5 text-[13px] font-bold transition-colors ${
                abaAtiva === aba.id
                  ? 'bg-[#1A2234] text-[#F8FAFC]'
                  : 'text-[#94A3B8] hover:bg-[#0F172A] hover:text-[#F8FAFC]'
              }`}
            >
              {aba.label}
            </button>
          ))}
        </div>

        <div className="flex min-h-[220px] flex-col items-center justify-center p-8 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-[#0F172A] text-[#3B82F6]">
            {abaAtiva === 'posts' ? <FileText size={25} /> : <User size={25} />}
          </div>
          <h2 className="text-[20px] font-bold text-[#F8FAFC]">
            {abaAtiva === 'posts' ? 'Nenhuma publicação por aqui' : 'Nenhum repost compartilhado'}
          </h2>
          <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-[#94A3B8]">
            {abaAtiva === 'posts'
              ? 'Quando houver posts deste perfil, eles aparecerão organizados nesta área.'
              : 'Reposts ajudam a destacar materiais relevantes para a comunidade.'}
          </p>
        </div>
      </section>
    </div>
  );
}
