import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner';
import GeometricBackground from '../components/GeometricBackground';
import logoDark from '../assets/logo-educonnect-dark.png';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  const lidarComLogin = async (e) => {
    e.preventDefault();

    if (!email || !senha) {
      toast.warning('Atenção', { description: 'Preencha todos os campos para entrar.' });
      return;
    }

    setCarregando(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error) throw error;

      toast.success('Bem-vindo de volta ao EduConnect!');
      navigate('/feed');
    } catch (error) {
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
    <div className="app-shell relative flex min-h-screen items-center justify-center p-4">
      <GeometricBackground />
      <main className="relative z-10 grid w-full max-w-[980px] overflow-hidden rounded-lg border border-[rgba(148,163,184,0.14)] bg-[#111827]/84 shadow-2xl backdrop-blur-xl lg:grid-cols-[1fr_440px]">
        <section className="hidden min-h-[560px] flex-col justify-between border-r border-[rgba(148,163,184,0.14)] p-10 lg:flex">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-[rgba(148,163,184,0.14)] bg-[#0B0F19]">
              <img src={logoDark} alt="EduConnect" className="h-9 w-9 object-contain" />
            </span>
            <div>
              <h1 className="text-[24px] font-bold leading-tight text-[#F8FAFC]">EduConnect</h1>
              <p className="text-[14px] text-[#94A3B8]">Rede acadêmica do curso</p>
            </div>
          </div>

          <div className="max-w-md">
            <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#3B82F6]">
              Plataforma institucional
            </p>
            <h2 className="text-[32px] font-bold leading-tight text-[#F8FAFC]">
              Avisos, materiais e conversas acadêmicas em um só lugar.
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[#94A3B8]">
              Um ambiente mais claro para acompanhar disciplinas, professores, publicações e mensagens.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            {['Avisos', 'Materiais', 'Mensagens'].map((item) => (
              <div key={item} className="rounded-lg border border-[rgba(148,163,184,0.14)] bg-[#0B0F19]/60 p-3 text-[13px] font-semibold text-[#CBD5E1]">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="p-6 sm:p-10">
          <div className="mb-8 flex items-center justify-center lg:hidden">
            <img src={logoDark} alt="EduConnect" className="h-16 w-16 object-contain" />
          </div>

          <div className="mb-8">
            <h2 className="text-[24px] font-bold text-[#F8FAFC]">Entrar na sua conta</h2>
            <p className="mt-1 text-[14px] text-[#94A3B8]">Use seu e-mail institucional para continuar.</p>
          </div>

          <form onSubmit={lidarComLogin} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="emailInput" className="text-[13px] font-semibold text-[#CBD5E1]">
                E-mail institucional
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" size={18} />
                <input
                  id="emailInput"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome@instituicao.edu"
                  className="field py-3 pl-10 pr-4 text-sm"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="senhaInput" className="text-[13px] font-semibold text-[#CBD5E1]">
                Senha
              </label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" size={18} />
                <input
                  id="senhaInput"
                  name="senha"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Sua senha"
                  className="field py-3 pl-10 pr-4 text-sm"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 text-[13px]">
              <button type="button" className="font-semibold text-[#94A3B8] transition-colors hover:text-[#F8FAFC]" onClick={() => navigate('/fluxo-senha')}>
                Esqueci minha senha
              </button>
              <span className="text-[#64748B]">Acesso restrito ao curso</span>
            </div>

            <button type="submit" disabled={carregando} className="btn-primary w-full px-4 text-sm disabled:opacity-50">
              {carregando ? 'Entrando...' : 'Entrar'}
              <ArrowRight size={17} />
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
