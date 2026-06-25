import React from 'react';
import { User, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Lista fixa de professores para exibição na sidebar
const professores = [
  { id: 1, nome: 'professor', cor: 'text-gray-400' },
  { id: 2, nome: 'professor', cor: 'text-gray-400' },
  { id: 3, nome: 'professor', cor: 'text-amber-500' },
  { id: 4, nome: 'professor', cor: 'text-gray-400' },
  { id: 5, nome: 'professor', cor: 'text-gray-400' },
];

// Lista de anúncios de exemplo
const anunciosExemplo = [
  {
    id: 1,
    titulo: 'Prova adiada',
    descricao: 'A prova de Banco de Dados foi remarcada para 15/05.',
  },
  {
    id: 2,
    titulo: 'Material disponível',
    descricao: 'Slides da aula de Engenharia de Software já estão no portal.',
  },
  {
    id: 3,
    titulo: 'Aula extra',
    descricao: 'Plantão de dúvidas de TCC nesta sexta às 14h.',
  },
];

export const Anuncios = () => {
  const { ehProfessor } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">

      {/* LINHA DE AVATARES DOS PROFESSORES */}
      <div className="flex items-center justify-center gap-3">
        {professores.map((prof) => (
          <div key={prof.id} className="flex flex-col items-center gap-1">
            <div className="w-11 h-11 bg-gray-50 rounded-full border border-gray-100 flex items-center justify-center">
              <User size={20} className={prof.cor} />
            </div>
            <span className="text-[10px] text-gray-400 font-medium">{prof.nome}</span>
          </div>
        ))}
      </div>

      {/* SEÇÃO DE ANÚNCIOS */}
      <div>
        {/* Cabeçalho */}
        <div className="text-center mb-4">
          <h3 className="text-[12px] font-bold text-gray-950 tracking-[0.15em] uppercase">
            ANÚNCIOS
          </h3>
          <p className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase mt-0.5">
            ANÚNCIOS DOS PROFESSORES
          </p>
        </div>

        {/* Lista de anúncios */}
        <div className="space-y-1 divide-y divide-gray-50">
          {anunciosExemplo.map((anuncio) => (
            <div key={anuncio.id} className="py-3 px-1">
              <h4 className="text-[13px] font-bold text-gray-800">{anuncio.titulo}</h4>
              <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{anuncio.descricao}</p>
            </div>
          ))}
        </div>

        {/* Botão do professor para criar aviso */}
        {ehProfessor && (
          <button 
            onClick={() => navigate('/criar-aviso')}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-600 text-[11px] font-bold py-2.5 rounded-xl transition-colors cursor-pointer border border-gray-100"
          >
            <Plus size={14} />
            <span>Novo aviso</span>
          </button>
        )}
      </div>

    </div>
  );
};