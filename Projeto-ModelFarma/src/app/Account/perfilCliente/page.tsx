'use client'
import React, { useEffect, useState } from "react";
import DisplayDetalhesCliente from "./DisplayDetalhesCliente";
import { Cliente } from "../../../../types/Cliente"; // Caminho para a interface Cliente
import Cookies from 'js-cookie';

const Page = () => {
  const [cliente, setCliente] = useState<Cliente | null>(null);

  useEffect(() => {
    const fetchCliente = async () => {
      const token = Cookies.get('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:8000/cliente/me/', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data: Cliente = await response.json();
            setCliente(data);
          } else {
            alert('Erro ao obter informações do usuário.');
          }
        } catch (error) {
          console.error('Erro na requisição:', error);
          alert('Erro ao obter informações do usuário.');
        }
      }
    };

    fetchCliente();
  }, []);

  return (
    <div>
      {cliente ? (
        <DisplayDetalhesCliente cliente={cliente} />
      ) : (
        <p>Carregando informações do cliente...</p>
      )}
    </div>
  );
};

export default Page;
