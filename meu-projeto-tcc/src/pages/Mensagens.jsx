import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner';

export default function Mensagens() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [usuarios, setUsuarios] = useState([]); // Lista de usuários para conversar
  const [destinatario, setDestinatario] = useState(null); // Usuário selecionado
  const [mensagens, setMensagens] = useState([]);
  const [novoTexto, setNovoTexto] = useState('');

  useEffect(() => {
    async function carregarDados() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setMe(user);

      // Carrega perfis fictícios ou outros usuários do sistema (Exemplo listando contas livres)
      // Ajuste este select conforme a sua tabela de perfis de utilizadores, se houver.
      setUsuarios([
        { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', nome: 'Prof. Helena Souza', handle: '@profhelena', iniciais: 'HS' },
        { id: 'cccccccc-cccc-cccc-cccc-cccccccccccc', nome: 'Marcos Lima (Aluno)', handle: '@marcosl', iniciais: 'ML' }
      ]);
    }
    carregarDados();
  }, []);

  // Busca o histórico de mensagens trocadas com o usuário selecionado
  useEffect(() => {
    if (!me || !destinatario) return;

    async function buscarMensagens() {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${me.id},receiver_id.eq.${destinatario.id}),and(sender_id.eq.${destinatario.id},receiver_id.eq.${me.id})`)
        .order('created_at', { ascending: true });

      if (!error) setMensagens(data);
    }

    buscarMensagens();

    // Sincronização em tempo real (Realtime) do chat
    const channel = supabase
      .channel('chat-realtime')
      .on('postgres_changes', { event: 'INSERT', table: 'messages' }, (payload) => {
        const nova = payload.new;
        if (
          (nova.sender_id === me.id && nova.receiver_id === destinatario.id) ||
          (nova.sender_id === destinatario.id && nova.receiver_id === me.id)
        ) {
          setMensagens(prev => [...prev, nova]);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [me, destinatario]);

  const handleEnviar = async (e) => {
    e.preventDefault();
    if (!novoTexto.trim() || !me || !destinatario) return;

    const { error } = await supabase
      .from('messages')
      .insert([
        { sender_id: me.id, receiver_id: destinatario.id, content: novoTexto }
      ]);

    if (error) {
      toast.error('Erro ao enviar mensagem');
    } else {
      setNovoTexto('');
    }
  };

  return (
    <div className="w-full max-w-[1100px] mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/feed')} className="p-2 text-gray-400 hover:text-black rounded-xl cursor-pointer">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-[15px] font-bold text-gray-950 tracking-widest uppercase">MENSAGENS</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 bg-white border border-gray-100 rounded-[2rem] shadow-[0_4px_25px_rgba(0,0,0,0.005)] overflow-hidden h-[580px]">
        {/* LISTA DE CONTATOS */}
        <div className="border-r border-gray-100 flex flex-col bg-[#fcfcfc]/50 p-2 space-y-1">
          <span className="text-[10px] font-bold text-gray-400 px-3 py-2 tracking-wider block">CONTACTOS DISPONÍVEIS</span>
          {usuarios.map(u => (
            <button
              key={u.id}
              onClick={() => setDestinatario(u)}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all cursor-pointer ${
                destinatario?.id === u.id ? 'bg-gray-100 text-gray-900 font-bold' : 'hover:bg-gray-50'
              }`}
            >
              <div className="w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">{u.iniciais}</div>
              <div>
                <h3 className="text-[12px] font-bold text-gray-900 leading-none">{u.nome}</h3>
                <span className="text-[10px] text-gray-400 font-light">{u.handle}</span>
              </div>
            </button>
          ))}
        </div>

        {/* JANELA DO CHAT */}
        <div className="md:col-span-2 flex flex-col bg-white">
          {destinatario ? (
            <>
              <div className="px-6 py-4 border-b border-gray-100 bg-white">
                <h2 className="text-[13px] font-bold text-gray-900">{destinatario.nome}</h2>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#fcfcfc]/30">
                {mensagens.map(msg => (
                  <div key={msg.id} className={`flex flex-col max-w-[70%] ${msg.sender_id === me.id ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                    <div className={`px-4 py-2.5 rounded-[1.4rem] text-[12.5px] ${msg.sender_id === me.id ? 'bg-black text-white rounded-tr-sm' : 'bg-gray-100 text-gray-800 rounded-tl-sm'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleEnviar} className="p-4 border-t border-gray-100 bg-white flex items-center gap-3">
                <input
                  type="text"
                  value={novoTexto}
                  onChange={(e) => setNovoTexto(e.target.value)}
                  placeholder="Escreva a sua mensagem aqui..."
                  className="flex-1 bg-[#fcfcfc] border border-gray-100 rounded-2xl px-4 py-3 text-[12.5px] outline-none"
                />
                <button type="submit" className="p-3 bg-black hover:bg-gray-900 text-white rounded-xl shadow-sm cursor-pointer"><Send size={15} /></button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-400 gap-2">
              <MessageSquare size={32} strokeWidth={1.5} className="text-gray-300" />
              <p className="text-[13px]">Selecione um contacto à esquerda para iniciar o chat privado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
