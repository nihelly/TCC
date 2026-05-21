import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importações de Páginas
import Login from './pages/Login';
import Feed from './pages/Feed';
import Configuracoes from './pages/Configuracoes';
import Perfil from './pages/Perfil';
import Busca from './pages/Busca';
import FluxoSenha from './pages/FluxoSenha'; // Importando a nova página por etapas

// Importações de Layouts e Segurança
import { MainLayout } from './layouts/MainLayout';
import { RotaProtegida } from './components/RotaProtegida';
import { Toaster } from 'sonner';

import './index.css';

function App() {
  return (
    <>
      <Toaster position="bottom-right" richColors closeButton />
      
      <Router>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/fluxo-senha" element={<FluxoSenha />} />

          {/* Grupo de Rotas Protegidas */}
          <Route
            path="/*"
            element={
              <RotaProtegida>
                <MainLayout>
                  <Routes>
                    <Route path="/feed" element={<Feed />} />
                    <Route path="/configuracoes" element={<Configuracoes />} />
                    <Route path="/perfil" element={<Perfil />} />
                    <Route path="/busca" element={<Busca />} />
                    <Route path="/" element={<Navigate to="/feed" replace />} />
                  </Routes>
                </MainLayout>
              </RotaProtegida>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;