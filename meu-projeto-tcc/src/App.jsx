import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

// Importação dos Layouts
import { MainLayout } from './layouts/MainLayout';

// Importação das Páginas
import Login from './pages/Login';
import FluxoSenha from './pages/FluxoSenha';
import Feed from './pages/Feed';
import CriarPost from './pages/CriarPost';
import Mensagens from './pages/Mensagens';
import Notificacoes from './pages/Notificacoes';
import CriarAviso from './pages/CriarAviso';
import Perfil from './pages/Perfil';
import EditarPerfil from './pages/EditarPerfil';

// Componente simples de simulação de proteção de rota
const RotaProtegida = ({ children }) => {
  return <MainLayout>{children}</MainLayout>;
};

export default function App() {
  return (
    <Router>
      {/* Provedor global das notificações flutuantes (Toast) */}
      <Toaster position="top-right" richColors closeButton />

      <Routes>
        {/* ==================== ROTAS PÚBLICAS ==================== */}
        <Route path="/login" element={<Login />} />
        <Route path="/fluxo-senha" element={<FluxoSenha />} />
        

        {/* ==================== ROTAS PROTEGIDAS ==================== */}
        {/* Feed Principal */}
        <Route 
          path="/feed" 
          element={
            <RotaProtegida>
              <Feed />
            </RotaProtegida>
          } 
        />

        {/* ADICIONADO: Rota para o seu próprio Perfil (Sem ID na URL) */}
        <Route 
          path="/perfil" 
          element={
            <RotaProtegida>
              <Perfil />
            </RotaProtegida>
          } 
        />

        {/* Página de Perfil de outro usuário (Com ID na URL) */}
        <Route 
          path="/perfil/:id" 
          element={
            <RotaProtegida>
              <Perfil />
            </RotaProtegida>
          } 
        />

        {/* Nova Página de Criação de Postagem */}
        <Route 
          path="/criar-post" 
          element={
            <RotaProtegida>
              <CriarPost />
            </RotaProtegida>
          } 
        />    
<Route 
  path="/criar-aviso" 
  element={
    <RotaProtegida>
      <CriarAviso />
    </RotaProtegida>
  } 
/>
        <Route 
          path="/mensagens" 
          element={
            <RotaProtegida>
              <Mensagens />
            </RotaProtegida>
          } 
        />
        
        <Route 
          path="/notificacoes" 
          element={
            <RotaProtegida>
              <Notificacoes />
            </RotaProtegida>
          } 
        />
        <Route 
  path="/perfil/editar" 
  element={
    <RotaProtegida>
      <EditarPerfil />
    </RotaProtegida>
  } 
/>

        {/* Fallback de rotas: Qualquer caminho inválido joga para o login ou feed */}
        <Route path="*" element={<Navigate to="/login" replace />} />
        
      </Routes>
    </Router>
  );
}