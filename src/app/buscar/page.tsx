"use client"
import React, { useState, useEffect } from 'react';
import CardMedicamentoBusca from '../../../component/cardBuscarMed';



const BuscarMedicamento = () => {

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



  const [loading, setLoading] = useState(false);
  const [med, setMed] = useState<Medicamento[]>([]);
  const [error, setError] = useState('');


  const buscarMedicamento = async (busca_med: string) => {
    
    setLoading(true);
    try {
      
      const response = await fetch(`http://localhost:8000/medicamento/?nome=${busca_med}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Erro ao buscar med. Por favor, tente novamente.');
      }

      const data = await response.json();
      //Pegou os dados
      setMed(data.Medicamentos);
      setError('');
    } catch (error) {
     
      setError('Erro ao buscar med. Por favor, tente novamente.');
      console.error('Erro:', error);
      setMed([]);
    
    } finally {
      setLoading(false);
    }
    
  };


  useEffect(() => {
    // Titulo padrão
    document.title = "Nenhum medicamento encontrado";
    
    // cria um object de consulta da url local
    const localurl = new URLSearchParams(window.location.search);
    
    // verifica se existe get em 'nome' na url local e pega o valor passado 
    const busca = localurl.get("nome"); 
    
    // Se existe valor em get
    if (busca) {
      document.title = `Busca por ${busca}`; //atualiza titulo
      buscarMedicamento(busca); //faça a busca
    }
  }, []); 
      
  
  return (<>
      {loading && <p>Carregando...</p>}
      {error && <p>{error}</p>}
      <div className='mt-4 mb-4 text-center'> 
        <h4>Resultados:</h4>
      </div>

      {/* Se tem medicamentos */}
      {med !== undefined && med.length > 0 ? (
        <div>
          <ul>
            {med.map((medicamento) => (   
              <li key={medicamento.id} className='mt-2 mb-2 pt-2 pb-2'>
                <CardMedicamentoBusca medicamento = {medicamento}/>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        /* Se não tem medicamentos */
        !loading && <div className="card mb-5">
        <div className="row no-gutters">
          <div className="card-body">
            <h5 className="card-title text-center">Nenhum medicamento encontrado</h5>
          </div>
        </div>
        </div>
      )}
    </>
  );
}


export default BuscarMedicamento;