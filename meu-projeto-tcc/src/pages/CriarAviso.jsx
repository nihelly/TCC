import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Megaphone, Send } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner';

export default function CriarAviso() {
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [materia, setMateria] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [verificandoPapel, setVerificandoPapel] = useState(true);
  const [usuarioPerfil, setUsuarioPerfil] = useState(null);

  useEffect(() => {
    async function verificarPermissao() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/login');
          return;
        }

        const { data: perfil, error } = await supabase
          .from('profiles')
          .select('nome, papel')
          .eq('id', user.id)
          .single();

        if (error || !perfil || perfil.papel !== 'professor') {
          toast.error('Acesso negado: apenas professores podem criar avisos.');
          navigate('/feed');
          return;
        }

        setUsuarioPerfil(perfil);
      } catch (err) {
        console.error(err);
        navigate('/feed');
      } finally {
        setVerificandoPapel(false);
      }
    }
    verificarPermissao();
  }, [navigate]);

  async function handlePublicarAviso(e) {
    e.preventDefault();

    if (!titulo.trim() || !conteudo.trim() || !materia.trim()) {
      return toast.error('Preencha todos os campos do aviso.');
    }

    try {
      setEnviando(true);
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('posts')
        .insert([
          {
            user_id: user.id,
            title: titulo.trim(),
            content: conteudo.trim(),
            materia: materia.trim(),
            is_aviso: true,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      toast.success('Aviso publicado no mural.');
      navigate('/feed');
    } catch (err) {
      console.error(err);
      toast.error('Falha ao publicar aviso no sistema.');
    } finally {
      setEnviando(false);
    }
  }

  if (verificandoPapel) {
    return (
      <div className="mx-auto max-w-[680px]">
        <div className="ui-card p-8 text-center text-[14px] text-[#94A3B8]">
          Validando credenciais docentes...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[760px] space-y-6 pb-24">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="focus-ring flex h-10 w-10 items-center justify-center rounded-lg text-[#94A3B8] transition-colors hover:bg-[#111827] hover:text-[#F8FAFC]"
          aria-label="Voltar"
        >
          <ArrowLeft size={19} />
        </button>
        <div>
          <div className="mb-1 flex items-center gap-2 text-[#3B82F6]">
            <Megaphone size={18} />
            <span className="text-[13px] font-semibold uppercase tracking-[0.14em]">Mural institucional</span>
          </div>
          <h1 className="text-[24px] font-bold text-[#F8FAFC]">Novo aviso aos alunos</h1>
          <p className="text-[14px] text-[#94A3B8]">Publicando como {usuarioPerfil?.nome}</p>
        </div>
      </div>

      <form onSubmit={handlePublicarAviso} className="ui-card space-y-5 p-5 sm:p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-[13px] font-semibold text-[#CBD5E1]">Disciplina</label>
            <input
              type="text"
              placeholder="Ex: Banco de Dados"
              value={materia}
              onChange={(e) => setMateria(e.target.value)}
              className="field px-4 py-3 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-semibold text-[#CBD5E1]">Categoria</label>
            <select className="field px-4 py-3 text-sm" defaultValue="Avisos">
              <option>Avisos</option>
              <option>Provas</option>
              <option>Materiais</option>
              <option>Eventos</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-semibold text-[#CBD5E1]">Título do aviso</label>
          <input
            type="text"
            placeholder="Ex: Prova adiada"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="field px-4 py-3 text-sm font-semibold"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-semibold text-[#CBD5E1]">Conteúdo</label>
          <textarea
            rows={6}
            placeholder="Digite os detalhes do comunicado para os alunos..."
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            className="field resize-none px-4 py-3 text-sm leading-relaxed"
          />
        </div>

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary px-5 text-sm">
            Cancelar
          </button>
          <button type="submit" disabled={enviando} className="btn-primary px-5 text-sm disabled:opacity-50">
            {enviando ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} />}
            {enviando ? 'Publicando...' : 'Publicar aviso'}
          </button>
        </div>
      </form>
    </div>
  );
}
