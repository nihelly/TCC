import React, { useEffect, useState } from 'react';
import { ArrowLeft, Heart, MessageCircle, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function Notificacoes() {
  const navigate = useNavigate();
  const [notificacoes, setNotificacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarNotificacoes() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error) setNotificacoes(data);
      setCarregando(false);
    }
    carregarNotificacoes();
  }, []);

  return (
    <div className="w-full max-w-[720px] mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/feed')} className="p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-xl transition-all cursor-pointer">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-[15px] font-bold text-gray-950 tracking-widest uppercase">NOTIFICAÇÕES</h1>
        </div>
        <div className="text-gray-400"><Sparkles size={18} strokeWidth={1.5} /></div>
      </div>

      {carregando ? (
        <div className="text-center text-gray-400 text-xs py-10">A carregar avisos...</div>
      ) : notificacoes.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-[2rem] p-8 text-center text-gray-400 text-[13px]">
          Tudo limpo por aqui! Não tem notificações recentes. 
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden divide-y divide-gray-50 shadow-[0_4px_20px_rgba(0,0,0,0.003)]">
          {notificacoes.map((notif) => (
            <div key={notif.id} className="p-5 flex items-center justify-between hover:bg-gray-50/40 transition-colors">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-[12px] font-bold text-gray-700">
                    {notif.actor_handle.substring(1,3).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm border border-gray-100 flex items-center justify-center">
                    <Heart size={12} className="text-red-500 fill-red-500" />
                  </div>
                </div>
                <div className="text-[13px] text-gray-600">
                  <span className="font-bold text-gray-900 mr-1">{notif.actor_handle}</span>
                  {notif.content}
                </div>
              </div>
              <span className="text-[11px] text-gray-400 font-light">
                {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}