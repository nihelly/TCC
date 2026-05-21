import React, { useState, useEffect } from 'react';
import { PostCard } from '../components/PostCard';
import { User, CheckCircle2 } from 'lucide-react';

const Feed = () => {
  const [notificacao, setNotificacao] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setNotificacao(false), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
  
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1100px] mx-auto pt-4">
      
      {/* Esquerda: Posts */}
      <div className="lg:col-span-8">
        <PostCard autor="aluno.exemplo" titulo="TÍTULO" temImagem={true} />
        <PostCard autor="aluno.exemplo" titulo="TÍTULO" conteudo="Bom dia!" />
      </div>

      {/* Direita: Sidebar */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Avatares Professores */}
        <div className="bg-white border border-gray-100 rounded-[2rem] p-5 flex justify-between items-center shadow-sm">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-gray-50 rounded-full border border-gray-100 flex items-center justify-center">
                <User size={22} className="text-gray-300" />
              </div>
              <span className="text-[10px] text-gray-400">professor</span>
            </div>
          ))}
        </div>

        {/* Card Anúncios */}
        <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm">
          <div className="text-center mb-6">
            <span className="text-[10px] font-bold text-gray-300 tracking-[0.2em] uppercase block mb-1">Anúncios</span>
            <span className="text-[10px] font-bold text-gray-400 tracking-[0.1em] uppercase">Anúncios dos Professores</span>
          </div>
          
          <div className="space-y-3">
            {[
              { t: 'Prova adiada', d: 'A prova de Banco de Dados foi remarcada para 15/05.' },
              { t: 'Material disponível', d: 'Slides da aula de Engenharia de Software já estão no portal.' },
              { t: 'Aula extra', d: 'Plantão de dúvidas de TCC nesta sexta às 14h.' }
            ].map((anuncio, idx) => (
              <div key={idx} className="p-4 bg-[#fcfcfc] border border-gray-50 rounded-xl">
                <h5 className="font-bold text-[12px] text-gray-700">{anuncio.t}</h5>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">{anuncio.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;