'use client'
import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Cliente } from "../../../../types/Cliente";

interface DetailClienteProps {
  cliente: Cliente;
}

const DisplayDetalhesCliente = ({ cliente }: DetailClienteProps) => {
  
  useEffect(() => {
    document.title = `Cliente: ${cliente.nome} ${cliente.sobrenome}`;
  }, [cliente]);

  return (
    <div className="container my-4">
      <div className="card" style={{ maxWidth: '800px', margin: 'auto' }}>
        <div className="card-body">
          <h2 className="card-title mb-4">{cliente.nome} {cliente.sobrenome}</h2>
          <div className="row">
            <div className="col-md-6 mb-3">
              <p><strong>CPF:</strong> {cliente.cpf}</p>
              <p><strong>Telefone:</strong> {cliente.telefone}</p>
              <p><strong>Email:</strong> {cliente.email}</p>
            </div>
            <div className="col-md-6 mb-3">
              <p><strong>Alergias:</strong> {cliente.alergias || "Nenhuma alergia registrada"}</p>
              <p><strong>Farmácia Cadastrada:</strong> {cliente.cadastro_farmacia}</p>
              <p><strong>Forma de Pagamento:</strong> {cliente.forma_pagamento}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DisplayDetalhesCliente;
