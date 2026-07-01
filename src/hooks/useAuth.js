import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useAuth() {
  const [usuario, setUsuario] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [carregando, setCarregando] = useState(true);

  async function buscarPerfil(id, userEmail) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        // Se o perfil não for encontrado, criamos um automático com base nos metadados ou e-mail
        if (error.code === 'PGRST116' || error.message.includes('JSON')) {
          const defaultNome = userEmail ? userEmail.split('@')[0] : 'Usuário AcadNet';
          const defaultMatricula = String(Math.floor(100000 + Math.random() * 900000));
          
          const newProfile = {
            id: id,
            nome: defaultNome,
            matricula: defaultMatricula,
            papel: 'aluno', // Papel padrão
            bio: 'Estudante do AcadNet.',
            avatar_url: null,
            created_at: new Date().toISOString()
          };

          const { data: createdData, error: createError } = await supabase
            .from('profiles')
            .insert(newProfile)
            .select()
            .single();

          if (createError) throw createError;
          setPerfil(createdData);
        } else {
          throw error;
        }
      } else {
        setPerfil(data);
      }
    } catch (err) {
      console.error("Erro ao buscar/criar perfil no Supabase:", err.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    // 1. Pega a sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUsuario(session?.user ?? null);
      if (session?.user) {
        buscarPerfil(session.user.id, session.user.email);
      } else {
        setCarregando(false);
      }
    });

    // 2. Escuta mudanças (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuario(session?.user ?? null);
      if (session?.user) {
        buscarPerfil(session.user.id, session.user.email);
      } else {
        setPerfil(null);
        setCarregando(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Retornamos um objeto com tudo o que o App precisa
  return { 
    usuario, 
    perfil, 
    carregando, 
    ehProfessor: perfil?.papel === 'professor' 
  };
}