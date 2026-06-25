import React from 'react';
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Repeat2 } from 'lucide-react';

function getInitials(handle = 'Aluno') {
  const cleaned = handle.replace('@', '').replace(/[._-]/g, ' ').trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'AC';
  return parts.slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

function formatHandle(handle) {
  if (!handle) return '@aluno';
  return handle.startsWith('@') ? handle : `@${handle}`;
}

export const PostCard = ({ post }) => {
  const author = formatHandle(post.author_handle || post.autor || 'aluno.exemplo');
  const initials = getInitials(author);
  const createdAt = post.created_at
    ? new Date(post.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    : 'Hoje';

  return (
    <article className="ui-card ui-card-hover overflow-hidden">
      <div className="flex items-start justify-between gap-4 border-b border-[rgba(148,163,184,0.12)] px-5 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-[rgba(148,163,184,0.18)] bg-[#0F172A] text-sm font-bold text-[#E2E8F0]">
            {post.avatar_url ? (
              <img src={post.avatar_url} alt={author} className="h-full w-full rounded-full object-cover" />
            ) : (
              initials
            )}
            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#1A2234] bg-[#22C55E]" title="Online" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h3 className="truncate text-[14px] font-bold text-[#F8FAFC]">{author}</h3>
              <span className="text-[12px] text-[#64748B]">•</span>
              <span className="text-[12px] font-medium text-[#94A3B8]">{createdAt}</span>
            </div>
            <p className="truncate text-[12px] text-[#94A3B8]">Comunidade acadêmica</p>
          </div>
        </div>

        <button className="focus-ring flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-[#94A3B8] transition-colors hover:bg-[#0F172A] hover:text-[#F8FAFC]" aria-label="Mais opções">
          <MoreHorizontal size={19} />
        </button>
      </div>

      <div className="space-y-4 px-5 py-5 sm:px-6">
        <div className="space-y-2">
          <h2 className="text-[20px] font-bold leading-snug text-[#F8FAFC]">
            {post.title || post.titulo || 'Publicação acadêmica'}
          </h2>
          {post.content && (
            <p className="whitespace-pre-line text-[16px] leading-relaxed text-[#CBD5E1]">
              {post.content}
            </p>
          )}
        </div>

        {(post.image_url || post.has_image_placeholder || post.temImagem) && (
          <div className="overflow-hidden rounded-lg border border-[rgba(148,163,184,0.14)] bg-[#0F172A]">
            {post.image_url ? (
              <img src={post.image_url} alt="Imagem da publicação" className="max-h-[420px] w-full object-cover" />
            ) : (
              <div className="flex aspect-[16/8] min-h-[180px] items-center justify-center bg-[linear-gradient(135deg,rgba(59,130,246,0.08),rgba(34,197,94,0.05))]">
                <span className="rounded-md border border-[rgba(148,163,184,0.14)] bg-[#111827]/70 px-3 py-1 text-[12px] font-semibold text-[#94A3B8]">
                  Material visual
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[rgba(148,163,184,0.12)] px-5 py-3 sm:px-6">
        <div className="flex items-center gap-1">
          {[
            { icon: Heart, label: 'Curtidas', count: post.likes_count || 0 },
            { icon: MessageCircle, label: 'Comentários', count: post.comments_count || 0 },
            { icon: Repeat2, label: 'Reposts', count: post.reposts_count || 0 },
          ].map(({ icon: Icon, label, count }) => (
            <button
              key={label}
              className="focus-ring flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[13px] font-semibold text-[#94A3B8] transition-colors hover:bg-[#0F172A] hover:text-[#F8FAFC]"
              aria-label={label}
              title={label}
            >
              <Icon size={16} strokeWidth={1.8} />
              <span>{count}</span>
            </button>
          ))}
        </div>
        <button className="focus-ring flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[13px] font-semibold text-[#94A3B8] transition-colors hover:bg-[#0F172A] hover:text-[#F8FAFC]" title="Salvar">
          <Bookmark size={16} strokeWidth={1.8} />
          <span>Salvar</span>
        </button>
      </footer>
    </article>
  );
};
