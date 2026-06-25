import React from 'react';
import { CalendarDays, FileText, Megaphone, Plus, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const professores = [
  { id: 1, nome: 'Helena Souza', iniciais: 'HS', status: 'online' },
  { id: 2, nome: 'Rafael Lima', iniciais: 'RL', status: 'offline' },
  { id: 3, nome: 'Bianca Torres', iniciais: 'BT', status: 'online' },
  { id: 4, nome: 'Daniel Costa', iniciais: 'DC', status: 'offline' },
];

const anunciosExemplo = [
  {
    id: 1,
    categoria: 'Provas',
    titulo: 'Prova de Banco de Dados remarcada',
    descricao: 'Nova data confirmada para 15/05, no laboratório 03.',
    data: '15 mai',
    professor: 'Prof. Helena Souza',
    prioridade: 'alta',
    icon: ShieldAlert,
  },
  {
    id: 2,
    categoria: 'Materiais',
    titulo: 'Slides de Engenharia de Software',
    descricao: 'Material da aula 08 disponível no portal acadêmico.',
    data: 'Hoje',
    professor: 'Prof. Rafael Lima',
    prioridade: 'normal',
    icon: FileText,
  },
  {
    id: 3,
    categoria: 'Eventos',
    titulo: 'Plantão de dúvidas de TCC',
    descricao: 'Atendimento sexta às 14h para revisão de projeto.',
    data: 'Sex',
    professor: 'Prof. Bianca Torres',
    prioridade: 'normal',
    icon: CalendarDays,
  },
];

export const Anuncios = () => {
  const { ehProfessor } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="space-y-4">
      <section className="ui-card p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-[14px] font-bold text-[#F8FAFC]">Professores</h2>
            <p className="text-[12px] text-[#94A3B8]">Equipe ativa no campus</p>
          </div>
          <span className="rounded-md bg-[#0F172A] px-2 py-1 text-[11px] font-semibold text-[#94A3B8]">
            {professores.filter((prof) => prof.status === 'online').length} online
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {professores.map((prof) => (
            <div key={prof.id} className="flex flex-col items-center gap-2" title={prof.nome}>
              <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(148,163,184,0.16)] bg-[#0F172A] text-[12px] font-bold text-[#E2E8F0]">
                {prof.iniciais}
                <span className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#1A2234] ${prof.status === 'online' ? 'bg-[#22C55E]' : 'bg-[#64748B]'}`} />
              </div>
              <span className="max-w-full truncate text-[10px] font-medium text-[#94A3B8]">
                {prof.iniciais}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="ui-card p-4">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <div className="mb-1 flex items-center gap-2 text-[#F8FAFC]">
              <Megaphone size={16} strokeWidth={2} />
              <h2 className="text-[14px] font-bold">Mural institucional</h2>
            </div>
            <p className="text-[12px] leading-relaxed text-[#94A3B8]">
              Avisos, provas, materiais e eventos do curso.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {anunciosExemplo.map((anuncio) => {
            const Icon = anuncio.icon;
            return (
              <article key={anuncio.id} className="rounded-lg border border-[rgba(148,163,184,0.12)] bg-[#0F172A]/70 p-3 transition-colors hover:border-[rgba(59,130,246,0.34)]">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-bold ${
                    anuncio.prioridade === 'alta'
                      ? 'bg-[#F59E0B]/12 text-[#FBBF24]'
                      : 'bg-[#1A2234] text-[#94A3B8]'
                  }`}>
                    <Icon size={13} />
                    {anuncio.categoria}
                  </span>
                  <time className="text-[11px] font-semibold text-[#94A3B8]">{anuncio.data}</time>
                </div>
                <h3 className="text-[14px] font-bold leading-snug text-[#F8FAFC]">{anuncio.titulo}</h3>
                <p className="mt-1 text-[12px] leading-relaxed text-[#94A3B8]">{anuncio.descricao}</p>
                <p className="mt-3 text-[11px] font-semibold text-[#CBD5E1]">{anuncio.professor}</p>
              </article>
            );
          })}
        </div>

        {ehProfessor && (
          <button
            onClick={() => navigate('/criar-aviso')}
            className="btn-primary mt-4 w-full text-sm"
          >
            <Plus size={16} />
            Novo aviso
          </button>
        )}
      </section>
    </aside>
  );
};
