"use client";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";


export default function DetailMed({ params }: { params: { id: string } }) {
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

  const [loading, setLoading] = useState<boolean>(false);
  const [med, setMed] = useState<Medicamento>();
  const [pathID, setPathID] = useState("");

  useEffect(() => {
    if (params && params.id) {
      setPathID(params.id);
    }
  }, [params]);

  const buscaDetalhes = async (id: number) => {
    setLoading(true);
    console.log(id);
    try {
      const response = await fetch(`http://localhost:8000/medicamento/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar med. Por favor, tente novamente.");
      }
      const data = await response.json();
      setMed(data.Medicamento);
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pathID) {
      buscaDetalhes(parseInt(pathID)); // Chamada da função aqui
    }
  }, [pathID]); // Dependência adicionada

  if (loading) {
    return (
      <div className="container my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (!med) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger" role="alert">
          Medicamento não encontrado.
        </div>
      </div>
    );
  }

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
              {med.similares ? (
                <ul className="list-group">
                  {med.similares.map((similar, index) => (
                    <li key={index} className="list-group-item">
                      {similar}
                    </li>
                  ))}

                </ul>
              ):(<h6>Nenhum similar encontrado</h6>)}

              <h3 className="card-subtitle mb-3 mt-4">Genéricos</h3>
              {med.genericos ? (
                <ul className="list-group">
                  {med.genericos.map((generico, index) => (
                    <li key={index} className="list-group-item">
                      {generico}
                    </li>
                  ))}
                </ul>
              ): (<h6>Nenhum altenativa generica encontrada</h6>)}

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