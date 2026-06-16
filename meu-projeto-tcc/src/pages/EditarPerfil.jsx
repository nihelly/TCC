import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Loader2, Check, X } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner';

export default function EditarPerfil() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState(null);

  // Estados do formulário
  const [nome, setNome] = useState('');
  const [handle, setHandle] = useState('');
  const [biografia, setBiografia] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // 1. Efeito para carregar os dados atuais do utilizador
  useEffect(() => {
    async function obterDadosAtuais() {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/login');
          return;
        }
        setUserId(user.id);

        const { data: perfil, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (perfil) {
          setNome(perfil.nome || '');
          setHandle(perfil.handle || '');
          setBiografia(perfil.biografia || '');
          setAvatarUrl(perfil.avatar_url || '');
          setPreviewUrl(perfil.avatar_url || '');
        }
      } catch (err) {
        console.error(err);
        toast.error('Erro ao carregar dados de edição.');
      } finally {
        setLoading(false);
      }
    }
    obterDadosAtuais();
  }, [navigate]);

  // 2. Manipular a seleção da imagem local para preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('A imagem deve ter no máximo 2MB.');
        return;
      }
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // 3. Função para salvar as alterações (Bate exatamente com a tua lógica de gravação)
  async function handleSalvar(e) {
    e.preventDefault();
    const handleLimpo = handle.trim().replace('@', '').toLowerCase();
    
    if (!nome.trim()) return toast.error('O nome não pode ficar vazio.');
    if (!handleLimpo) return toast.error('O seu @ não pode ficar vazio.');

    try {
      setSaving(true);

      // 1. Validar se o @ já existe em outra conta
      const { data: exist } = await supabase
        .from('profiles')
        .select('id')
        .eq('handle', handleLimpo)
        .neq('id', userId)
        .maybeSingle();

      if (exist) return toast.error('Esse @ já está em uso por outro utilizador.');

      let novaAvatarUrl = avatarUrl;

      // 2. Upload da imagem para o Supabase Storage
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, imageFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        novaAvatarUrl = publicUrl;
      }

      // 3. Atualizar dados na tabela 'profiles'
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          nome: nome.trim(),
          handle: handleLimpo,
          biografia: biografia.trim(),
          avatar_url: novaAvatarUrl,
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      toast.success('Perfil atualizado com sucesso!');
      
      // Redireciona de volta para o perfil atualizado
      navigate(`/perfil/${userId}`, { replace: true });
    } catch (err) {
      console.error(err);
      toast.error('Erro ao guardar as alterações.');
    } finally {
      setSaving(false);
    }
  }

  // 4. Estado visual de carregamento inicial
  if (loading) {
    return <div className="text-center py-20 text-gray-400 text-sm">A carregar editor de perfil...</div>;
  }

  // 5. Renderização da Interface do Editor
  return (
    <div className="w-full max-w-[600px] mx-auto space-y-8">
      {/* Barra de Topo do Editor */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <button 
          type="button"
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-[12px] font-bold text-gray-500 hover:text-black transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} /> VOLTAR
        </button>
        <h1 className="text-[13px] font-bold text-gray-950 tracking-widest uppercase">EDITAR PERFIL</h1>
        <div className="w-16"></div>
      </div>

      <form onSubmit={handleSalvar} className="space-y-6">
        
        {/* FOTO DE PERFIL */}
        <div className="flex flex-col items-center space-y-3">
          <div className="relative group w-28 h-28">
            <div className="w-full h-full bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center text-gray-400 overflow-hidden shadow-inner">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[30px] font-bold text-gray-300">
                  {handle ? `@${handle.substring(0, 2).toUpperCase()}` : '?'}
                </span>
              )}
            </div>
            
            <label 
              htmlFor="avatar-upload" 
              className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold"
            >
              <Camera size={18} className="mb-1" />
              ALTERAR FOTO
            </label>
            <input 
              id="avatar-upload" 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              className="hidden" 
            />
          </div>
          <p className="text-[11px] text-gray-400">Clique na imagem para fazer upload (Máx. 2MB)</p>
        </div>

        {/* INPUTS DE TEXTO */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-700 tracking-wider uppercase">Nome no Ecossistema</label>
            <input 
              type="text" 
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Prof. Dr. Roberto"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-medium text-gray-800 outline-none focus:border-black transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-700 tracking-wider uppercase">Identificador (@)</label>
            <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[13px]">
              <span className="text-gray-400 font-bold">@</span>
              <input 
                type="text" 
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="roberto.docente"
                className="bg-transparent outline-none w-full font-medium text-gray-800"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-700 tracking-wider uppercase">Biografia Académica</label>
            <textarea 
              value={biografia}
              onChange={(e) => setBiografia(e.target.value)}
              rows={4}
              placeholder="Conte um pouco sobre a sua atuação, disciplinas ou linha de investigação..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-[12px] text-gray-700 outline-none resize-none focus:border-black transition-colors"
            />
          </div>
        </div>

        {/* BOTÕES DE CONTROLO */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <button 
            type="button"
            onClick={() => navigate(-1)}
            disabled={saving}
            className="flex items-center gap-1 bg-gray-100 text-gray-600 px-5 py-2.5 rounded-xl text-[12px] font-bold hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50"
          >
            <X size={14} /> Cancelar
          </button>
          
          <button 
            type="submit"
            disabled={saving}
            className="flex items-center gap-1 bg-black text-white px-6 py-2.5 rounded-xl text-[12px] font-bold hover:bg-gray-800 transition-colors cursor-pointer shadow-sm disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 size={14} className="animate-spin" /> A Guardar...
              </>
            ) : (
              <>
                <Check size={14} /> Guardar Alterações
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}