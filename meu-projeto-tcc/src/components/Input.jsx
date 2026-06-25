import React from 'react';

export const Input = ({ label, tipo = 'text', placeholder, valor, aoMudar }) => {
  const inputId = label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="mb-4 flex w-full flex-col gap-1.5">
      <label htmlFor={inputId} className="ml-1 text-[12px] font-bold uppercase tracking-[0.08em] text-[#94A3B8]">
        {label}
      </label>
      <input
        id={inputId}
        name={inputId}
        type={tipo}
        value={valor}
        onChange={(e) => aoMudar(e.target.value)}
        placeholder={placeholder}
        required
        className="field px-4 py-3 text-sm"
      />
    </div>
  );
};
