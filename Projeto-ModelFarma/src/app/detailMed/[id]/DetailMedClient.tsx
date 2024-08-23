import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useMedicamento } from "./useMedicamento";
import Link from 'next/link';
import { Medicamento } from "../../../../types/Medicamentos";


interface DetailMedClientProps {
  med: Medicamento;
}

export default function DetailMedClient({ med }: DetailMedClientProps) {
  useEffect( () => {
    document.title = `Medicamento: ${med.nome}` 
  })
  
  
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
              <p className="card-text">Alergias: {med.alergias?.join(", ")}</p>
              <p className="card-text">Faixa etária: {med.faixa_etaria}</p>
              <p className="card-text">Dosagem: {med.mg_ml}</p>
              <p className="card-text">Farmácia ID: {med.farmacia_id}</p>
            </div>
            <div className="col-md-6">
              <h3 className="card-subtitle mb-3">Similares</h3>
              {/* Verifica se há medicamentos similares */}
              {Array.isArray(med.similares) && med.similares.length > 0 ? (
                <ul className="list-group">
                  {med.similares.map((indexSimilar) => {
                    const { med: similarMed } = useMedicamento(Number(indexSimilar));
                    return similarMed ? (
                      <li key={indexSimilar} className="list-group-item">
                        <Link href={`http://localhost:3000/detailMed/${indexSimilar}`}>
                          {similarMed.nome}
                        </Link>
                      </li>
                    ) : null;
                  })}
                </ul>
              ) : (
                <h6>Nenhum similar encontrado</h6>
              )}

              <h3 className="card-subtitle mb-3 mt-4">Genéricos</h3>
              {/* Verifica se há medicamentos genéricos */}
              {Array.isArray(med.genericos) && med.genericos.length > 0 ? (
                <ul className="list-group">
                  {med.genericos.map((indexGenerico) => {
                    const { med: genericoMed } = useMedicamento(Number(indexGenerico));
                    return genericoMed ? (
                      <li key={indexGenerico} className="list-group-item">
                        <Link href={`http://localhost:3000/detailMed/${indexGenerico}`}>
                          {genericoMed.nome}
                        </Link>
                      </li>
                    ) : null;
                  })}
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
