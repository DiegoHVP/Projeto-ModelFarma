"use client";
import React from'react';
import { useBuscarMedicamento } from './useBuscarMedicamento';
import MedicamentoDisplay from './MedicamentoDisplay';

const BuscarMedicamento: React.FC = () => {
  const { loading, med, error} = useBuscarMedicamento();

  return (
    <>
    
      {/* A lógica de busca pode ser adicionada aqui se necessário */}
      <MedicamentoDisplay
      medicamentos={med}
      loading={loading}
      error={error} />
      
    </>
  );
};

export default BuscarMedicamento;
