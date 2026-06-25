import React from 'react';

export const Button = ({ children, tipo = "submit", carregando = false }) => {
  return (
    <button
      type={tipo}
      disabled={carregando}
      className="btn-primary w-full px-4 text-sm disabled:opacity-50"
    >
      {carregando ? "Carregando..." : children}
    </button>
  );
};
