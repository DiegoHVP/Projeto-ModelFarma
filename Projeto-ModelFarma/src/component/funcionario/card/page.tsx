"use client";
import React, { useState } from "react";
import Link from "next/link";
import { getApiUrl } from "../../featchAPI/getApiUrl";
import { Medicamento } from "../../../../types/Medicamentos";

const CardMedicamento = ({ medicamento, setUpLista }: { medicamento: Medicamento; setUpLista: (updated: boolean) => void }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const apiUrl = getApiUrl();

  const excluirMed = async () => {
    const confirmacao = window.confirm("Tem certeza que deseja excluir este medicamento?");
    
    if (confirmacao) {
      setLoading(true);
      
      try {
        const response = await fetch(`${apiUrl}/medicamento/${medicamento.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          }
        });
        if (!response.ok) {
          throw new Error("Erro ao excluir medicamento. Por favor, tente novamente.");
        }
        setUpLista(true);
        
      } catch (error) {
        setError("Erro ao excluir medicamento. Por favor, tente novamente.");
        console.log("Erro:", error);
    
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="card mx-auto" style={{maxWidth: 1100}}>
      <div className="row no-gutters">
        <div className="col-md-4">
          <div className="card-body">
            <h5 className="card-title">{medicamento.nome}</h5>
            <p className="card-text">Preço: R${medicamento.preco.toFixed(2)}</p>
            <p className="card-text">Vencimento: {medicamento.vencimento}</p>
            <p className="card-text">Quantidade em estoque: {medicamento.quantidade}</p>
          </div>
        </div>
        
        <div className="col-md-4 text-center">
          <div className="card-body">
            <p className="card-text">Faixa Etária: {medicamento.faixa_etaria}</p>
            <p className="card-text">Unidade (por caixa): {medicamento.unidade}</p>
            <p className="card-text">mg/ml: {medicamento.mg_ml}</p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card-body d-flex flex-column justify-content-between align-items-center">    
            <Link href={`/detailMed/${medicamento.id}`}>
              <button className="btn btn-primary mb-2">Detalhes</button>
            </Link>
            <button className="btn btn-warning mb-2">Editar</button>
            <button className="btn btn-danger" onClick={excluirMed} disabled={loading}>
              {loading ? "Excluindo..." : "Excluir"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardMedicamento;
