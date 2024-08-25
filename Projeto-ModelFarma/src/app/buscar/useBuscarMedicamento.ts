import { useState, useEffect } from'react';
import { Medicamento } from '../../../types/Medicamentos';
import { getApiUrl } from '../../component/getApiUrl';


export const useBuscarMedicamento = () => {
  const [loading, setLoading] = useState(false);
  const [med, setMed] = useState<Medicamento[]>([]);
  const [error, setError] = useState('');
  const apiUrl = getApiUrl();

  const buscarMedicamento = async (busca_med: string) => {
    setLoading(true);
    console.log(`${apiUrl}/medicamento/?nome=${busca_med}`)
    try {
      const response = await fetch(`${apiUrl}/medicamento/?nome=${busca_med}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Erro ao buscar med. Por favor, tente novamente.');
      }

      const data = await response.json();
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
    const localurl = new URLSearchParams(window.location.search);
    const busca = localurl.get("nome");
    
    if (busca) {
      document.title = `Busca por ${busca}`;
      buscarMedicamento(busca);
    } else {
      document.title = "Nenhum medicamento encontrado";
    }
  }, []);

  return { loading, med, error};
};
