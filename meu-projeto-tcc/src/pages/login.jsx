import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner'; // Importar ferramenta de alertas

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  const lidarComLogin = async (e) => {
    e.preventDefault();
    
    // Validação simples antes de chamar o banco
    if (!email || !senha) {
      toast.warning('Atenção', { description: 'Por favor, preencha todos os campos.' });
      return;
    }

    setCarregando(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: senha,
      });

      if (error) throw error;

      {/* COMPLIMENTO/CUMPRIMENTO AO ENTRAR COM SUCESSO */}
      toast.message('Bem-vindo de volta ao Conecta!', );
      
      navigate('/feed');
    } catch (error) {
      {/* SITUAÇÃO DE ERRO NO LOGIN */}
      toast.error('Falha na autenticação', {
        description: error.message === 'Invalid login credentials' 
          ? 'E-mail institucional ou senha incorretos.' 
          : 'Não foi possível conectar. Verifique seus dados de acesso.',
      });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center p-4">
      {/* DESIGN FIEL À FOTO ENVIADA */}
      <div className="w-full max-w-[440px] bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgba(0,0,0,0.015)] border border-gray-100 p-10 flex flex-col items-center">
        
        {/* Ícone do Globo Superior */}
        <div className="text-gray-800 mb-6">
          <Globe size={42} strokeWidth={1.5} />
        </div>

        {/* Textos Principais */}
        <h1 className="text-[20px] font-bold text-gray-950 text-center mb-1 tracking-tight">
          Seja bem-vindo à Conecta!
        </h1>
        <p className="text-[12px] text-gray-400 text-center mb-8 font-light">
          por favor, insira a senha.
        </p>

        {/* Formulário com IDs de Acessibilidade corrigidos */}
        <form onSubmit={lidarComLogin} className="w-full space-y-5">
          {/* E-mail */}
          <div className="space-y-1.5">
            <label htmlFor="emailInput" className="text-[12px] font-semibold text-gray-700 pl-1 block">
              E-mail institucional
            </label>
            <input
              id="emailInput"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplo@gmail.com"
              className="w-full bg-[#fcfcfc] border border-gray-100 rounded-2xl py-3 px-4 text-[13px] text-gray-700 outline-none focus:bg-white focus:border-black transition-all"
            />
          </div>

          {/* Senha */}
          <div className="space-y-1.5">
            <label htmlFor="senhaInput" className="text-[12px] font-semibold text-gray-700 pl-1 block">
              Senha
            </label>
            <input
              id="senhaInput"
              name="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#fcfcfc] border border-gray-100 rounded-2xl py-3 px-4 text-[13px] text-gray-700 outline-none focus:bg-white focus:border-black transition-all"
            />
          </div>

          {/* Links Inferiores */}
          <div className="flex items-center justify-between text-[11px] text-gray-400 font-light px-1 pt-1">
            <span className="cursor-pointer hover:text-gray-600 hover:underline transition-all" 
            onClick={() => navigate('/fluxo-senha')}>
              Esqueci minha senha
            </span>
            <span className="cursor-pointer hover:text-gray-600 hover:underline transition-all">
              Acesso restrito ao curso
            </span>
          </div>

          {/* Botão com Borda Preta Estilo Mockup */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-white border border-black hover:bg-gray-50 text-gray-900 font-medium py-3 rounded-2xl text-[13px] transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}