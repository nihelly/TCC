import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const lidarComLogin = async (e) => {
    e.preventDefault(); // Impede a página de recarregar
    setCarregando(true);

    // Tenta autenticar
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: senha,
    });

    if (error) {
      alert("Erro ao entrar: " + error.message);
      setCarregando(false);
    } else {
      console.log("Usuário logado:", data.user);
      navigate('/feed'); // Se der certo, vai para o feed
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 w-full max-w-[420px] flex flex-col items-center">
        
        <Globe size={40} className="mb-6 text-gray-900" />

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Seja bem-vindo à Conecta!</h1>
        <p className="text-gray-400 text-sm mb-8 text-center px-4">
          Por favor, insira suas credenciais institucionais para acessar o portal.
        </p>

        <form onSubmit={lidarComLogin} className="w-full">
          <Input 
            label="E-mail institucional"
            placeholder="aluno@conecta.com"
            valor={email}
            aoMudar={setEmail}
          />
          
          <Input 
            label="Senha"
            tipo="password"
            placeholder="••••••••"
            valor={senha}
            aoMudar={setSenha}
          />

          <div className="flex justify-between px-1 mb-8">
            <button type="button" className="text-[10px] text-gray-400 hover:text-black transition-colors underline">Esqueci minha senha</button>
            <button type="button" className="text-[10px] text-gray-400 hover:text-black transition-colors underline">Acesso restrito</button>
          </div>

          <Button carregando={carregando}>Entrar</Button>
        </form>
      </div>
    </div>
  );
};

export default Login;