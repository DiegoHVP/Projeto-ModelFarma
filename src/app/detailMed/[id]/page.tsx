"use client";

import React, { useState, useEffect } from "react";
import { fetchMedicamento } from "@/app/detailMed/[id]/fetchMedicamento";
import DetailMedClient from "@/app/detailMed/[id]/DetailMedClient";

export default function DetailMedPage({ params }: { params: { id: string } }) {
  const [med, setMed] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const medicamento = await fetchMedicamento(parseInt(params.id));
        setMed(medicamento);
      } catch (error) {
        setError("Erro ao carregar detalhes do medicamento.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger" role="alert">
          {error}
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

  return <DetailMedClient med={med} />;
}
