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
    <div className="container my-5">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title">{cliente.nome} {cliente.sobrenome}</h2>
          <div className="row">
            <div className="col-md-6">
              <p className="card-text">CPF: {cliente.cpf}</p>
              <p className="card-text">Telefone: {cliente.telefone}</p>
              <p className="card-text">Email: {cliente.email}</p>
              <p className="card-text">Alergias: {cliente.alergias || "Nenhuma alergia registrada"}</p>
              <p className="card-text">Farmácia Cadastrada: {cliente.cadastro_farmacia}</p>
              <p className="card-text">Forma de Pagamento: {cliente.forma_pagamento}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
    
}

export default DisplayDetalhesCliente;