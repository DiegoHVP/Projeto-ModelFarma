'use client'
import { useMedicamento } from "@/app/detailMed/[id]/useMedicamento";
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'; // Certifique-se de que o Bootstrap está instalado e importado

interface CompraCardProps {
  compra: {
    id: number;
    data_compra: string;
    quantidade: number;
    preco_total: number;
    medicamentos: { medicamento_id: number; quantidade: number }[];
  };
}

const CompraCard: React.FC<CompraCardProps> = ({ compra }) => {
  // Calcular o valor total dos medicamentos
  const calcularTotalMedicamentos = () => {
    return compra?.medicamentos?.reduce((total, med) => {
      const medicamento = useMedicamento(med.medicamento_id).med;
      return total + (medicamento?.preco || 0) * med.quantidade;
    }, 0);
  };

  const valorTotalMedicamentos = calcularTotalMedicamentos();

  return (
    <div className="card mb-4" style={{ maxWidth: '800px', margin: 'auto' }}>
      <div className="card-body">
        <h5 className="card-title">Compra #{compra?.id}</h5>
        <h6 className="card-subtitle mb-2 text-muted">Data: {compra?.data_compra}</h6>
        <p className="card-text">Quantidade total de itens: {compra?.quantidade}</p>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Medicamentos</th>
                <th scope="col">Quantidade</th>
                <th scope="col">Preço unid.</th>
              </tr>
            </thead>
            <tbody>
              {compra?.medicamentos?.map((med) => {
                const medicamento = useMedicamento(med?.medicamento_id)?.med;
                return (
                  <tr>
                    <td>{medicamento?.nome || 'Desconhecido'}</td>
                    <td className="text-center">{med?.quantidade}</td>
                    <td className="text-center">R${(medicamento?.preco || 0).toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2} className="text-end"><strong>Valor Total:</strong></td>
                <td><strong>R${valorTotalMedicamentos?.toFixed(2)}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompraCard;
