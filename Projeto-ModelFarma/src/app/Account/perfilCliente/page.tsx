'use client'
import React, { useEffect, useState } from "react";
import DisplayDetalhesCliente from "./DisplayDetalhesCliente";
import CompraCard from "./compraCard";
import { Cliente } from "../../../../types/Cliente"; // Caminho para a interface Cliente
import Cookies from 'js-cookie';
import { getApiUrl } from "../../../component/getApiUrl";

const Page = () => {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [compras, setCompras] = useState<any[]>([]);
  const apiUrl = getApiUrl();

  useEffect(() => {
    const fetchCliente = async () => {
      const token = Cookies.get('token');
      if (token) {
        try {
          const response = await fetch(`${apiUrl}/cliente/me/`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data: Cliente = await response.json();
            setCliente(data);
            fetchCompras(data.id); // Carregar compras após obter cliente
          } else {
            alert('Erro ao obter informações do usuário.');
          }
        } catch (error) {
          console.error('Erro na requisição:', error);
          alert('Erro ao obter informações do usuário.');
        }
      }
    };

    const fetchCompras = async (clienteId: number) => {
      try {
        const response = await fetch(`${apiUrl}/compra/me/${clienteId}`, {
          method: 'GET'
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Compras:", data.Compras);
          setCompras(data.Compras); // Ajuste para lidar com a lista de compras
        } else {
          alert('Erro ao obter compras do cliente.');
        }
      } catch (error) {
        console.error('Erro na requisição de compras:', error);
        alert('Erro ao obter compras do cliente.');
      }
    };

    fetchCliente();
  }, [apiUrl]);

  return (
    <div>
      {cliente ? (
        <>
          <DisplayDetalhesCliente cliente={cliente} />
          <h2 style={{ textAlign: "center" }}>Compras Realizadas</h2>
          <div className="compras-list">
            {compras.length > 0 ? (
              compras.map((compra) => (
                <CompraCard key={compra.id} compra={compra} />
              ))
            ) : (
              <p>Nenhuma compra realizada.</p>
            )}
          </div>
        </>
      ) : (
        <p>Carregando informações do cliente...</p>
      )}
    </div>
  );
};

export default Page;
