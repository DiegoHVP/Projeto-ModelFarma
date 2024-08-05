// src/app/detailMed/[id]/DetailMedClient.tsx

import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

interface Medicamento {
  id: number;
  nome: string;
  vencimento: string;
  preco: number;
  quantidade: number;
  alergias: string[];
  faixa_etaria: string;
  mg_ml: string;
  unidade: string;
  farmacia_id: number;
  similares: string[];
  genericos: string[];
  reabastecer: boolean;
}

interface DetailMedClientProps {
  med: Medicamento;
}

export default function DetailMedClient({ med }: DetailMedClientProps) {
  return (
    <div className="container my-5">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title">{med.nome}</h2>
          <div className="row">
            <div className="col-md-6">
              <p className="card-text">Vencimento: {med.vencimento}</p>
              <p className="card-text">Preço: R$ {med.preco}</p>
              <p className="card-text">Unidades (por caixa): {med.unidade}</p>
              <p className="card-text">Alergias: {med.alergias}</p>
              <p className="card-text">Faixa etária: {med.faixa_etaria}</p>
              <p className="card-text">Dosagem: {med.mg_ml}</p>
              <p className="card-text">Farmácia ID: {med.farmacia_id}</p>
            </div>
            <div className="col-md-6">
              <h3 className="card-subtitle mb-3">Similares</h3>
              {med.similares? (
                <ul className="list-group">
                  {med.similares.map((similar, index) => (
                    <li key={index} className="list-group-item">
                      {similar}
                    </li>
                  ))}
                </ul>
              ) : (
                <h6>Nenhum similar encontrado</h6>
              )}

              <h3 className="card-subtitle mb-3 mt-4">Genéricos</h3>
              {med.genericos ? (
                <ul className="list-group">
                  {med.genericos.map((generico, index) => (
                    <li key={index} className="list-group-item">
                      {generico}
                    </li>
                  ))}
                </ul>
              ) : (
                <h6>Nenhuma alternativa genérica encontrada</h6>
              )}

              {med.reabastecer && (
                <div className="alert alert-warning mt-4" role="alert">
                  Este medicamento precisa ser reabastecido.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
