"use client";

import React, { useState, useEffect } from "react";
import { fetchMedicamento } from "@/app/detailMed/[id]/fetchMedicamento";
import DetailMedClient from "@/app/detailMed/[id]/DetailMedClient";
import { generateStaticParams } from "@/app/detailMed/[id]/generateStaticParams";

// Dados mock para desenvolvimento
const mockData = {
  Medicamento: {
    id: 1,
    nome: "Paracetamol",
    vencimento: "2025-12-31",
    preco: 19.99,
    quantidade: 100,
    alergias: "N/A",
    faixa_etaria: "Adulto",
    mg_ml: "500mg",
    unidade: "comprimido",
    farmacia_id: 1,
    similares: 2,
    genericos: 1,
    reabastecer: false
  }
};

export default function DetailMedPage({ params }: { params: { id: string } }) {
  const [med, setMed] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // busca os dados
    async function fetchData() {
      setLoading(true);
      try {
        const medicamento = await fetchMedicamento(parseInt(params.id));
        setMed(medicamento);
      } catch (error) {
        console.error("Erro ao buscar dados da API, usando dados mock:", error);
        setMed(mockData.Medicamento); // Usando dados mockados
        setError(null); // Limpa o erro para exibir dados mockados
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.id]);

  // Enquanto busca
  if (loading) {
    return (
      <div className="container my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  // Se deu Error, apresente
  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  // Sem medicamento
  if (!med) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger" role="alert">
          Medicamento não encontrado.
        </div>
      </div>
    );
  }

  // Apresentar Medicamento
  return <DetailMedClient med={med} />;
}
