import React, { useState, useEffect, useRef } from 'react';
import { Search, Megaphone, Hash } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function Buscar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  
  // Estados de dados vindos do Supabase
  const [anuncios, setAnuncios] = useState([]);
  const [hashtagsMaisUsadas, setHashtagsMaisUsadas] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  
  const dropdownRef = useRef(null);

  // 1. Carrega dados iniciais (Anúncios e extração de Hashtags dos posts reais)
  useEffect(() => {
    async function carregarDadosIniciais() {
      // Busca Anúncios oficiais
      const { data: dataAnuncios } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });
      if (dataAnuncios) setAnuncios(dataAnuncios);

      // Busca todos os posts para extrair as hashtags reais
      const { data: dataPosts } = await supabase.from('posts').select('content');
      if (dataPosts) {
        const contagemTags = {};
        
        // Expressão regular para capturar hashtags válidas
        dataPosts.forEach(post => {
          if (post.content) {
            const tags = post.content.match(/#[\w-]+/g);
            if (tags) {
              tags.forEach(tag => {
                const tagFormatada = tag.toLowerCase();
                contagemTags[tagFormatada] = (contagemTags[tagFormatada] || 0) + 1;
              });
            }
          }
        });

        // Transforma o objeto de contagem em um array ordenado pelos mais usados
        const tagsOrdenadas = Object.keys(contagemTags)
          .map(tag => ({ nome: tag, quantidade: contagemTags[tag] }))
          .sort((a, b) => b.quantidade - a.quantidade)
          .slice(0, 8); // Pega as top 8 igual ao seu design

        setHashtagsMaisUsadas(tagsOrdenadas);
      }
    }

    carregarDadosIniciais();
  }, []);

  // 2. Sistema de Busca Dinâmica de Usuários (Dispara ao digitar)
  useEffect(() => {
    const termo = searchTerm.trim();
    if (!termo) {
      queueMicrotask(() => setUsuariosFiltrados([]));
      return;
    }

    async function buscarUsuarios() {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`nome.ilike.%${searchTerm}%,matricula.ilike.%${searchTerm}%`)
        .limit(5);

      if (!error && data) {
        setUsuariosFiltrados(data);
      }
    }

    // Debounce simples para evitar requisições excessivas a cada letra
    const delayDebounce = setTimeout(() => {
      buscarUsuarios();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  // Fecha o menu de sugestões se clicar fora dele
  useEffect(() => {
    function cliqueFora(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMostrarDropdown(false);
      }
    }
    document.addEventListener('mousedown', cliqueFora);
    return () => document.removeEventListener('mousedown', cliqueFora);
  }, []);

  // Auxiliar para gerar o tempo decorrido amigável (2h, 5h, 1d)
  const formatarTempo = (dataString) => {
    const diffMs = new Date() - new Date(dataString);
    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHoras < 24) return `${diffHoras || 1}h`;
    return `${Math.floor(diffHoras / 24)}d`;
  };

  return (
    <div className="w-full max-w-[840px] mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* TÍTULO DA PÁGINA */}
      <div>
        <h1 className="text-[14px] font-bold text-gray-950 tracking-widest uppercase">
          BUSCAR
        </h1>
      </div>

      {/* BARRA DE PESQUISA COM O DROPDOWN INTELIGENTE */}
      <div className="relative" ref={dropdownRef}>
        <div className="flex items-center gap-3 bg-[#fcfcfc] border border-gray-100 rounded-full px-5 py-3.5 focus-within:bg-white focus-within:border-blue-400 transition-all shadow-sm">
          <Search size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar posts, pessoas, tags..." 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setMostrarDropdown(true);
            }}
            onFocus={() => setMostrarDropdown(true)}
            className="bg-transparent border-none outline-none text-[13px] text-gray-700 w-full placeholder-gray-400"
          />
        </div>

        {/* RESULTADOS DA PESQUISA (Aparece apenas quando ativo/digitando) */}
        {mostrarDropdown && (searchTerm.trim() !== '') && (
          <div className="absolute top-[115%] left-0 w-full bg-white border border-gray-100 rounded-[2rem] shadow-xl z-50 p-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
            
            {/* Termos sugeridos baseados na escrita */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors text-[13px]">
                <Search size={14} className="text-gray-400" />
                <span>{searchTerm}</span>
              </div>
            </div>

            {/* Separador caso existam usuários */}
            {usuariosFiltrados.length > 0 && <hr className="border-gray-50" />}

            {/* Lista de Usuários Encontrados */}
            <div className="space-y-1">
              {usuariosFiltrados.map((user) => (
                <div 
                  key={user.id} 
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 rounded-2xl cursor-pointer transition-colors"
                >
                  <div className="w-9 h-9 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-[11px] font-bold text-gray-600">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.nome} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      user.nome.substring(0, 2).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-gray-950 leading-none mb-0.5">{user.nome}</h4>
                    <span className="text-[11px] text-gray-400 font-light capitalize">
                      @{user.nome.toLowerCase().replace(/\s+/g, '')} · {user.papel}
                    </span>
                  </div>
                </div>
              ))}
              
              {usuariosFiltrados.length === 0 && (
                <p className="text-[11px] text-gray-400 text-center py-2">Nenhum usuário correspondente encontrado.</p>
              )}
            </div>

          </div>
        )}
      </div>

      {/* SEÇÃO: ANÚNCIOS DOS PROFESSORES */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-gray-900 px-1">
          <Megaphone size={16} strokeWidth={2} />
          <h2 className="text-[12px] font-bold tracking-wider uppercase">ANÚNCIOS DOS PROFESSORES</h2>
        </div>

        <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden divide-y divide-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.002)]">
          {anuncios.map((anuncio) => (
            <div key={anuncio.id} className="p-5 flex justify-between items-start hover:bg-gray-50/30 transition-colors">
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-gray-400 tracking-wide uppercase">
                  {anuncio.professor_nome} · <span className="text-gray-500">{anuncio.materia}</span>
                </div>
                <h3 className="text-[13.5px] font-bold text-gray-950 tracking-tight">
                  {anuncio.titulo}
                </h3>
              </div>
              <span className="text-[11px] text-gray-400 font-light">
                {formatarTempo(anuncio.created_at)}
              </span>
            </div>
          ))}
          {anuncios.length === 0 && (
            <p className="text-sm text-gray-400 p-6 text-center">Nenhum anúncio postado recentemente.</p>
          )}
        </div>
      </div>

      {/* SEÇÃO: # MAIS UTILIZADAS */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-gray-900 px-1">
          <Hash size={16} strokeWidth={2} />
          <h2 className="text-[12px] font-bold tracking-wider uppercase"># MAIS UTILIZADAS</h2>
        </div>

        <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.002)] flex flex-wrap gap-2.5">
          {hashtagsMaisUsadas.map((tag, index) => (
            <button 
              key={index}
              onClick={() => {
                setSearchTerm(tag.nome);
                setMostrarDropdown(true);
              }}
              className="flex items-center gap-2 bg-[#fcfcfc] border border-gray-100 hover:border-gray-300 text-gray-700 px-4 py-2 rounded-full text-[12px] font-medium transition-all cursor-pointer shadow-sm"
            >
              <span className="text-gray-900 font-semibold">{tag.nome}</span>
              <span className="text-gray-400 font-light text-[11px]">{tag.quantidade}</span>
            </button>
          ))}
          {hashtagsMaisUsadas.length === 0 && (
            <p className="text-xs text-gray-400 w-full text-center py-2">
              Inclua hashtags (ex: #react) nos conteúdos dos seus posts para que elas apareçam computadas aqui!
            </p>
          )}
        </div>
      </div>

    </div>
  );
}
