import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

// O segredo está neste "export function" aqui embaixo:
export function useAuth() {
  const [usuario, setUsuario] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const buscarPerfil = useCallback(async (id) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setPerfil(data);
    } catch (err) {
      console.error("Erro ao buscar perfil:", err.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    // 1. Pega a sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUsuario(session?.user ?? null);
      if (session?.user) {
        buscarPerfil(session.user.id);
      } else {
        setCarregando(false);
      }
    });

    // 2. Escuta mudanças (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuario(session?.user ?? null);
      if (session?.user) {
        buscarPerfil(session.user.id);
      } else {
        setPerfil(null);
        setCarregando(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [buscarPerfil]);

  // Retornamos um objeto com tudo o que o App precisa
  return { 
    usuario, 
    perfil, 
    carregando, 
    ehProfessor: perfil?.papel === 'professor' 
  };
}
