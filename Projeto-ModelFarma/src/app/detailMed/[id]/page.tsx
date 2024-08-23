"use client"
import React from "react";
import { useMedicamento } from "@/app/detailMed/[id]/useMedicamento";
import DetailMedClient from "./DetailMedClient"

export default function DetailMedPage({ params }: { params: { id: string } }) {
  const { med, loading, error } = useMedicamento(parseInt(params.id));
  
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
