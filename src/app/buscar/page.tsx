'use client'
import { useState } from 'react';

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

export default function BuscarMedicamento({pagina}: any) {
  const [nome, setNome] = useState('');
  const [erro, setErro] = useState('');
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);

  const handleNomeChange = (e: any) => {
    setNome(e.value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault(); // Evita o comportamento padrão de submissão do formulário
    try {
      let response;
      response = await fetch(`http://localhost:8000/medicamento?nome=${nome}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      setMedicamentos(data.Medicamentos); // Atualiza o estado dos medicamentos com os dados da resposta

    } catch (error) {
      setErro('Erro ao buscar medicamentos. Por favor, tente novamente.');
      console.error('Erro:', error);
      setMedicamentos([]);
    }
  };
  if(medicamentos){
  return (
    <div>
      <h1>Buscar Medicamento</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Nome do Medicamento:
          <input type="text" value={nome} onChange={handleNomeChange} />
        </label>
        <button type="submit">Buscar</button> {/* Botão de submit do formulário */}
      </form>
      {erro && <p>{erro}</p>}
      {medicamentos.length > 0 && medicamentos ? (
        <div>
          <h2>Medicamentos encontrados:</h2>
          <ul>
            {medicamentos.map((medicamento) => (
              <li key={medicamento.id}>
                {medicamento.nome} - Preço: R${medicamento.preco}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Nenhum medicamento encontrado.</p>
      )}
    </div>
  );}
  else {
    return
    {(pagina)};
  }
}
