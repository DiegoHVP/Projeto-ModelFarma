"use client"
import { useState } from 'react';
import "bootstrap/dist/css/bootstrap.css";

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
  length: number;
}

export default function BuscarMedicamento() {



  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);
  const [med, setMed] = useState<Medicamento[]>([]);
  const [error, setError] = useState('');

  const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNome(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      
        const response = await fetch(`http://localhost:8000/medicamento?nome=${nome}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar med. Por favor, tente novamente.');
      }
      const data = await response.json();
      if(data){
        setMed(data.Medicamentos);
        setError('');
        } else {
            setMed(data);
        }

    } catch (error) {

        setError('Erro ao buscar med. Por favor, tente novamente.');
        console.error('Erro:', error);
        setMed([]);
    
    } finally {

      setLoading(false);
    
    }
  };

  return (
  <div>
    <div>
      <form className='d-flex bd-highlight p-0 m-0 ' onSubmit={handleSubmit}>
        <input type="search" className='form-control flex-fill' placeholder='Ex: Dipirona' value={nome} onChange={handleNomeChange} />
        <button type="submit" className='btn btn-outline-success'>Buscar</button>
      </form>
      
      {loading && <p>Carregando...</p>}

      {error && <p>{error}</p>}
      
      {med!=undefined ? (
        <div>
          <ul>
            {med.map((med) => (   
                <li key={med.id}>
                    {med.nome} - Preço: R${med.preco}
                </li>
            ))}
          </ul>
        </div>
      ) : (
        !loading && <p>Nenhum medicamento encontrado.</p>
      )}
  </div>
  </div>);
}
