import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Moon, 
  Accessibility, 
  LogOut, 
  ChevronDown, 
  ChevronUp, 
  Key, 
  ToggleLeft, 
  ToggleRight, 
  EyeOff, 
  UserCheck,
  Type,
  Globe
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Configuracoes() {
  const navigate = useNavigate();
  // Estados para controlar qual aba está aberta (sistema de Accordion)
  const [abaAberta, setAbaAberta] = useState(null);
  
  // Estados para os botões de Alternância (Toggles)
  const [verificacaoDuasEtapas, setVerificacaoDuasEtapas] = useState(false);
  const [contaPrivada, setContaPrivada] = useState(false);
  const [ocultarAtividade, setOcultarAtividade] = useState(false);
  const [modoNocturno, setModoNocturno] = useState(false);
  const [altoContraste, setAltoContraste] = useState(false);
  
  // Estado para o tamanho da fonte selecionada
  const [tamanhoFonte, setTamanhoFonte] = useState('media');

  const alternarAba = (nomeAba) => {
    setAbaAberta(abaAberta === nomeAba ? null : nomeAba);
  };

  const lidarComSair = async () => {
    const confirmar = window.confirm("Deseja realmente sair da conta?");
    if (confirmar) {
      await supabase.auth.signOut();
      navigate('/');
    }
  };

  return (
    <div className="max-w-[700px] mx-auto pt-4 pb-20 px-4 animate-in fade-in duration-500">
      {/* Título Superior */}
      <h1 className="text-center text-[11px] font-bold tracking-[0.3em] text-gray-800 uppercase mb-10">
        Configurações
      </h1>

      <div className="space-y-4">
        
        {/* ================= SEÇÃO: SEGURANÇA ================= */}
        <div className="bg-white rounded-[1.5rem] shadow-[0_2px_12px_rgba(0,0,0,0.01)] border border-gray-100 overflow-hidden transition-all">
          <button 
            onClick={() => alternarAba('seguranca')}
            className={`w-full flex items-center justify-between p-5 text-left transition-colors ${abaAberta === 'seguranca' ? 'bg-gray-50/50' : 'hover:bg-gray-50/30'}`}
          >
            <div className="flex items-center gap-3 text-gray-800 font-semibold text-[13px]">
              <Shield size={18} className="text-gray-500" />
              <span>Segurança</span>
            </div>
            {abaAberta === 'seguranca' ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
          </button>
          
          {abaAberta === 'seguranca' && (
            <div className="p-6 bg-white border-t border-gray-50 space-y-5 animate-in slide-in-from-top-2 duration-200">
              {/* Alterar Senha */}
              <div className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-3 text-gray-600">
                  <Key size={16} className="text-gray-400" />
                  <span>Alterar senha</span>
                </div>
                <button 
                  onClick={() => navigate('/fluxo-senha')}
                  className="bg-gray-50 hover:bg-gray-100 border border-gray-100 px-4 py-1.5 rounded-xl font-bold text-gray-700 text-[11px] transition-colors"
                >
                  alterar
                </button>
              </div>

              {/* Verificação em duas etapas */}
              <div className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-3 text-gray-600">
                  <Lock size={16} className="text-gray-400" />
                  <span>Verificação em duas etapas</span>
                </div>
                <button onClick={() => setVerificacaoDuasEtapas(!verificacaoDuasEtapas)} className="text-gray-300 hover:text-gray-400 transition-colors">
                  {verificacaoDuasEtapas ? <ToggleRight size={32} className="text-black" /> : <ToggleLeft size={32} />}
                </button>
              </div>

              {/* E-mail de recuperação */}
              <div className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-3 text-gray-600">
                  <span className="text-gray-400 font-bold text-base px-0.5">@</span>
                  <span>E-mail de recuperação</span>
                </div>
                <input 
                  type="email" 
                  placeholder="seu@email.com" 
                  className="bg-gray-50/70 border border-gray-100 rounded-xl px-4 py-2 text-[12px] text-gray-600 outline-none w-52 focus:bg-white focus:border-gray-300 transition-all text-right"
                />
              </div>
            </div>
          )}
        </div>

        {/* ================= SEÇÃO: PRIVACIDADE ================= */}
        <div className="bg-white rounded-[1.5rem] shadow-[0_2px_12px_rgba(0,0,0,0.01)] border border-gray-100 overflow-hidden transition-all">
          <button 
            onClick={() => alternarAba('privacidade')}
            className={`w-full flex items-center justify-between p-5 text-left transition-colors ${abaAberta === 'privacidade' ? 'bg-gray-50/50' : 'hover:bg-gray-50/30'}`}
          >
            <div className="flex items-center gap-3 text-gray-800 font-semibold text-[13px]">
              <Lock size={18} className="text-gray-500" />
              <span>Privacidade</span>
            </div>
            {abaAberta === 'privacidade' ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
          </button>
          
          {abaAberta === 'privacidade' && (
            <div className="p-6 bg-white border-t border-gray-50 space-y-5 animate-in slide-in-from-top-2 duration-200">
              {/* Conta Privada */}
              <div className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-3 text-gray-600">
                  <EyeOff size={16} className="text-gray-400" />
                  <span>Conta privada</span>
                </div>
                <button onClick={() => setContaPrivada(!contaPrivada)} className="text-gray-300 hover:text-gray-400 transition-colors">
                  {contaPrivada ? <ToggleRight size={32} className="text-black" /> : <ToggleLeft size={32} />}
                </button>
              </div>

              {/* Ocultar minha atividade */}
              <div className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-3 text-gray-600">
                  <UserCheck size={16} className="text-gray-400" />
                  <span>Ocultar minha atividade</span>
                </div>
                <button onClick={() => setOcultarAtividade(!ocultarAtividade)} className="text-gray-300 hover:text-gray-400 transition-colors">
                  {ocultarAtividade ? <ToggleRight size={32} className="text-black" /> : <ToggleLeft size={32} />}
                </button>
              </div>

              {/* Quem pode me mencionar */}
              <div className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-3 text-gray-600">
                  <Accessibility size={16} className="text-gray-400" />
                  <span>Quem pode me mencionar</span>
                </div>
                <select className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-1.5 text-[12px] text-gray-600 outline-none cursor-pointer hover:bg-gray-100 transition-colors">
                  <option>Todos</option>
                  <option>Apenas Seguidores</option>
                  <option>Ninguém</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* ================= SEÇÃO: MODO NOTURNO ================= */}
        <div className="bg-white rounded-[1.5rem] shadow-[0_2px_12px_rgba(0,0,0,0.01)] border border-gray-100 overflow-hidden transition-all">
          <button 
            onClick={() => alternarAba('modoNocturno')}
            className={`w-full flex items-center justify-between p-5 text-left transition-colors ${abaAberta === 'modoNocturno' ? 'bg-gray-50/50' : 'hover:bg-gray-50/30'}`}
          >
            <div className="flex items-center gap-3 text-gray-800 font-semibold text-[13px]">
              <Moon size={18} className="text-gray-500" />
              <span>modo noturno</span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={(e) => {
                  e.stopPropagation(); // Evita abrir o accordion ao clicar apenas no toggle
                  setModoNocturno(!modoNocturno);
                }} 
                className="text-gray-300 hover:text-gray-400 transition-colors"
              >
                {modoNocturno ? <ToggleRight size={32} className="text-black" /> : <ToggleLeft size={32} />}
              </button>
              {abaAberta === 'modoNocturno' ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </div>
          </button>
          
          {abaAberta === 'modoNocturno' && (
            <div className="p-5 bg-white border-t border-gray-50 animate-in slide-in-from-top-2 duration-200">
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Alterna entre o tema claro e escuro do EduConnect. Sua preferência fica salva neste dispositivo.
              </p>
            </div>
          )}
        </div>

        {/* ================= SEÇÃO: ACESSIBILIDADE ================= */}
        <div className="bg-white rounded-[1.5rem] shadow-[0_2px_12px_rgba(0,0,0,0.01)] border border-gray-100 overflow-hidden transition-all">
          <button 
            onClick={() => alternarAba('acessibilidade')}
            className={`w-full flex items-center justify-between p-5 text-left transition-colors ${abaAberta === 'acessibilidade' ? 'bg-gray-50/50' : 'hover:bg-gray-50/30'}`}
          >
            <div className="flex items-center gap-3 text-gray-800 font-semibold text-[13px]">
              <Accessibility size={18} className="text-gray-500" />
              <span>Acessibilidade</span>
            </div>
            {abaAberta === 'acessibilidade' ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
          </button>
          
          {abaAberta === 'acessibilidade' && (
            <div className="p-6 bg-white border-t border-gray-50 space-y-6 animate-in slide-in-from-top-2 duration-200">
              {/* Alto Contraste */}
              <div className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-3 text-gray-600">
                  <Accessibility size={16} className="text-gray-400" />
                  <span>Alto-contraste</span>
                </div>
                <button onClick={() => setAltoContraste(!altoContraste)} className="text-gray-300 hover:text-gray-400 transition-colors">
                  {altoContraste ? <ToggleRight size={32} className="text-black" /> : <ToggleLeft size={32} />}
                </button>
              </div>

              {/* Tamanho da Fonte */}
              <div className="space-y-3">
                <span className="text-[11px] text-gray-400 font-medium block">Tamanho da fonte</span>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'pequena', label: 'pequena' },
                    { id: 'media', label: 'média' },
                    { id: 'grande', label: 'grande' }
                  ].map((fonte) => (
                    <button
                      key={fonte.id}
                      onClick={() => setTamanhoFonte(fonte.id)}
                      className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all
                        ${tamanhoFonte === fonte.id 
                          ? 'border-black bg-white text-black font-semibold shadow-sm' 
                          : 'border-gray-100 bg-gray-50/50 text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                      <Type size={fonte.id === 'pequena' ? 12 : fonte.id === 'media' ? 15 : 18} />
                      <span className="text-[10px]">{fonte.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Idioma */}
              <div className="flex items-center justify-between text-[13px] pt-2 border-t border-gray-50">
                <div className="flex items-center gap-3 text-gray-600">
                  <Globe size={16} className="text-gray-400" />
                  <span>Idioma</span>
                </div>
                <select className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-1.5 text-[12px] text-gray-600 outline-none cursor-pointer hover:bg-gray-100 transition-colors">
                  <option>Português (BR)</option>
                  <option>English</option>
                  <option>Español</option>
                </select>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Botão Sair da Conta */}
      <div className="mt-12 flex justify-center">
        <button 
          onClick={lidarComSair}
          className="flex items-center gap-2 text-red-500 font-semibold text-[13px] hover:text-red-600 hover:underline transition-all"
        >
          <span>sair da conta</span>
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );
}