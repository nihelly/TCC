import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Feed from './pages/Feed';
import Configuracoes from './pages/Configuracoes'; 
import Perfil from './pages/Perfil';
import Busca from './pages/Busca';
import { MainLayout } from './layouts/MainLayout';
import { RotaProtegida } from './components/RotaProtegida';

// Importação do CSS com Tailwind v4
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota Pública: Tela de Login (não usa a Sidebar) */}
        <Route path="/login" element={<Login />} />

        {/* Rotas Protegidas: Todas essas telas ganham a Sidebar e o Header automaticamente */}
        <Route
          path="/*"
          element={
            <RotaProtegida>
              <MainLayout>
                <Routes>
                  {/* Rota do Feed Principal */}
                  <Route path="/feed" element={<Feed />} />
                  
                  {/* Nova Rota: Área de Configurações em Accordion */}
                  <Route path="/configuracoes" element={<Configuracoes />} />
                  
                  {/* Rota do Perfil (Próxima etapa) */}
                  <Route path="/perfil" element={<Perfil />} />
                  
                  {/* Rota de Pesquisa */}
                  <Route path="/busca" element={<Busca />} />
                  
                  {/* Redirecionamento Padrão Interno */}
                  <Route path="/" element={<Navigate to="/feed" replace />} />
                </Routes>
              </MainLayout>
            </RotaProtegida>
          }
        />

        {/* Fallback de Segurança: Se digitar qualquer URL maluca, joga pro login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;