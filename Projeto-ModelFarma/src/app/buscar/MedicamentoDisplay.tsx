import React from'react';
import { Medicamento } from '../../../types/Medicamentos';
import CardMedicamentoBusca from '../../component/cardBuscarMed';

interface Props {
  medicamentos: Medicamento[];
  loading: boolean;
  error: string;
}

const MedicamentoDisplay: React.FC<Props> = ({ medicamentos, loading, error }) => {
  return (
    <>
      {loading && <p>Carregando...</p>}
      {error && <p>{error}</p>}
      <div className='mt-4 mb-4 text-center'><h4>Resultados:</h4></div>

      {medicamentos !== undefined? (
        <ul>
          {medicamentos.map((medicamento) => (
            <li key={medicamento.id} className='mt-2 mb-2 pt-2 pb-2 list-unstyled '><CardMedicamentoBusca medicamento={medicamento} /></li>
          ))}
        </ul>
      ) : (
        !loading && (
          <div className="card mb-5">
            <div className="row no-gutters">
                <div className="card-body">
                    <h5 className="card-title text-center">Nenhum medicamento encontrado</h5>
                </div>
            </div>
        </div>
        )
      )}
    </>
  );
};

export default MedicamentoDisplay;
