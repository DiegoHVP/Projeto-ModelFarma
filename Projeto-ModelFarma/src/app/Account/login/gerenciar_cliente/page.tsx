'use client'
import React, { useState, useEffect } from 'react';
import { Cliente } from '../../../../../types/Cliente';
import { getApiUrl } from '../../../../component/featchAPI/getApiUrl';


const ListarClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [message, setMessage] = useState('');
  const [upLista, setUpLista] = useState<boolean>(false);
  const apiUrl = getApiUrl();
  const buscarClientes = async () => {
    try {
      const response = await fetch(`${apiUrl}/cliente/`);

      if (response.ok) {
        const data = await response.json();

        if (data.message) {
          setMessage(data.message);
        } else {
          setClientes(data);
          
        }
      } else {
        console.error('Erro ao buscar clientes:', response.statusText);
        setMessage('Erro ao buscar clientes. Verifique o console para detalhes.'); // Informative user message
      }
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      setMessage('Erro ao buscar clientes. Verifique o console para detalhes.'); // Informative user message
    }
  };

  
  useEffect(() => {
    document.title = "Gerenciar Clientes";
    buscarClientes();
  }, []);

  if (upLista){
    buscarClientes();
    setUpLista(false);
  }
  
  const deletarCliente = async (id: any) => {
    const confirmacao = window.confirm("Tem certeza que deseja apagar este cliente?");

    if (confirmacao) {
      try {
        const response = await fetch(`${apiUrl}/cliente/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setUpLista(true);

        if (!response.ok) {
          throw new Error(
            'Erro ao excluir medicamento. Por favor, tente novamente.'
          );
        }
      } catch {
        console.error('Error ao tentar excluir cliente');
      }
    }
  };

  
  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Lista de Clientes</h1>
      
      
      {message && <p className="text-center text-danger">{message}</p>}
      
      
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Nome</th>
            <th scope="col">CPF</th>
            <th scope="col">Telefone</th>
            <th scope="col">Email</th>
            <th scope="col">Ações</th>
          </tr>
        </thead>
        <tbody>
          
          
          {/* Se nao tem clientes */}

          {!clientes || clientes?.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center">
                Não há clientes cadastrados.
              </td>
            </tr>
          ) : (
            /*Se tem*/
            clientes.map((cliente: Cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.nome} {cliente.sobrenome}</td>
                <td>{cliente.cpf}</td>
                <td>{cliente.telefone}</td>
                <td>{cliente.email}</td>
                <td>
                  
                  <button
                    className="btn btn-danger"
                    onClick={() => deletarCliente(cliente.id)}>
                    Excluir
                  </button>
                
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}


export default ListarClientes