import React from 'react';
import Link from 'next/link';


export default function CardMedicamentoBusca({ medicamento} : {medicamento: any}) {
  
  
  return (
    <div className="card">
      <div className="row no-gutters">
        
        {/* Coluna para o nome e informações gerais */}
        <div className="col-md-4">
          <div className="card-body">
          <Link href={`/detailMed/${medicamento.id}`}>
            <h5 className="card-title">{medicamento.nome}</h5>
            </Link>
            <p className="card-text">Preço: R${medicamento.preco}</p>
            <p className="card-text">Vencimento: {medicamento.vencimento}</p>
          </div>
        </div>
        
        {/* Coluna para quantidade e unidades */}
        <div className="col-md-4 text-center">
          <div className="card-body">
            <p className="card-text">Faixa Etária: {medicamento.faixa_etaria}</p>
            <p className="card-text">Unidade (por caixa): {medicamento.unidade}</p>
            <p className="card-text">mg/ml: {medicamento.mg_ml}</p>
          </div>
        </div>
        
        {/* Coluna para os botões */}
        <div className="col-md-4">
          <div className="card-body d-flex flex-column justify-content-between align-items-center">
            <button className="btn btn-primary mb-2">Adicionar à Cesta</button>
            <button className="btn btn-success">Comprar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
