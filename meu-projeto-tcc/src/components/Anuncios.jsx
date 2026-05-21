import React from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth'; // O hook que criamos anteriormente

export const Anuncios = () => {
  const { ehProfessor } = useAuth(); // Verifica o papel do usuário

  return (
    <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-400 text-xs tracking-widest uppercase">
          Anúncios dos Professores
        </h3>
        
        {/* BOTÃO EXCLUSIVO DO PROFESSOR */}
        {ehProfessor && (
          <button className="p-1.5 bg-black text-white rounded-lg hover:scale-105 transition-transform cursor-pointer">
            <Plus size={16} />
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <h4 className="font-bold text-sm">Prova adiada</h4>
          <p className="text-xs text-gray-500 mt-1">A prova de Banco de Dados foi remarcada para 15/05.</p>
        </div>
        {/* Outros anúncios... */}
      </div>
    </div>
  );
};