import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Send, UploadCloud, X } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner';

export default function CriarPost() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [titulo, setTitulo] = useState('');
  const [corpo, setCorpo] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [enviandoImagem, setEnviandoImagem] = useState(false);

  const handleUploadImagem = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Arquivo inválido', { description: 'Selecione uma imagem PNG, JPG ou JPEG.' });
      return;
    }

    setEnviandoImagem(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID?.() || Math.random()}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('posts-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('posts-images')
        .getPublicUrl(filePath);

      setImagemUrl(data.publicUrl);
      toast.success('Imagem carregada com sucesso!');
    } catch (error) {
      toast.error('Erro no upload', { description: error.message });
    } finally {
      setEnviandoImagem(false);
    }
  };

  const handleCriarPostagem = async (e) => {
    e.preventDefault();

    if (!titulo.trim()) {
      toast.warning('Título obrigatório', { description: 'Dê um título para a sua publicação.' });
      return;
    }

    setCarregando(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado.');

      const { error } = await supabase
        .from('posts')
        .insert([
          {
            title: titulo,
            content: corpo,
            image_url: imagemUrl || null,
            user_id: user.id,
            author_handle: user.email ? `@${user.email.split('@')[0]}` : '@usuario',
            created_at: new Date().toISOString(),
          }
        ]);

      if (error) throw error;

      toast.success('Publicado com sucesso!');
      navigate('/feed');
    } catch (error) {
      toast.error('Erro ao publicar', { description: error.message });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[760px] space-y-6 pb-24">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="focus-ring flex h-10 w-10 items-center justify-center rounded-lg text-[#94A3B8] transition-colors hover:bg-[#111827] hover:text-[#F8FAFC]"
            aria-label="Voltar"
          >
            <ArrowLeft size={19} />
          </button>
          <div>
            <h1 className="text-[24px] font-bold text-[#F8FAFC]">Criar publicação</h1>
            <p className="text-[14px] text-[#94A3B8]">Compartilhe materiais, dúvidas ou atualizações com a turma.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleCriarPostagem} className="space-y-5">
        <section className="ui-card space-y-5 p-5 sm:p-6">
          <div className="space-y-2">
            <label htmlFor="tituloPost" className="text-[13px] font-semibold text-[#CBD5E1]">
              Título da publicação
            </label>
            <input
              id="tituloPost"
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Resumos de IHC para a P2"
              className="field px-4 py-3 text-sm"
              maxLength={80}
            />
            <p className="text-right text-[12px] text-[#64748B]">{titulo.length}/80</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="corpoPost" className="text-[13px] font-semibold text-[#CBD5E1]">
              Conteúdo
            </label>
            <textarea
              id="corpoPost"
              value={corpo}
              onChange={(e) => setCorpo(e.target.value)}
              placeholder="Escreva detalhes, links, referências ou orientações..."
              rows={6}
              className="field resize-none px-4 py-3 text-sm leading-relaxed"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-semibold text-[#CBD5E1]">
              Imagem de apoio
            </label>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUploadImagem}
              accept="image/*"
              className="hidden"
            />

            {!imagemUrl ? (
              <button
                type="button"
                disabled={enviandoImagem}
                onClick={() => fileInputRef.current?.click()}
                className="focus-ring flex min-h-[170px] w-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[rgba(148,163,184,0.28)] bg-[#0F172A]/62 p-6 text-center transition-colors hover:border-[#3B82F6] disabled:opacity-60"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#111827] text-[#3B82F6]">
                  {enviandoImagem ? <Loader2 size={22} className="animate-spin" /> : <UploadCloud size={22} />}
                </span>
                <span className="text-[14px] font-semibold text-[#CBD5E1]">
                  {enviandoImagem ? 'Fazendo upload...' : 'Clique para selecionar uma imagem'}
                </span>
                <span className="text-[12px] text-[#94A3B8]">PNG ou JPG até 5MB</span>
              </button>
            ) : (
              <div className="relative overflow-hidden rounded-lg border border-[rgba(148,163,184,0.14)] bg-[#0F172A]">
                <img src={imagemUrl} alt="Preview do post" className="h-[260px] w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImagemUrl('')}
                  className="focus-ring absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#0B0F19]/86 text-white transition-colors hover:bg-[#EF4444]"
                  aria-label="Remover imagem"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        </section>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary px-5 text-sm">
            Cancelar
          </button>
          <button type="submit" disabled={carregando || enviandoImagem} className="btn-primary px-5 text-sm disabled:opacity-50">
            {carregando ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} />}
            {carregando ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      </form>
    </div>
  );
}
