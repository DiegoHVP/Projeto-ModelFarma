import { useState, useEffect } from "react";
import { getApiUrl } from "../../../component/featchAPI/getApiUrl";

export function useMedicamento(id: number) {
  const [med, setMed] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = getApiUrl();
  useEffect(() => {
    async function fetchMedicamento() {
      setLoading(true);
      try {
        const response = await fetch(`${apiUrl}/medicamento/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar medicamento. Por favor, tente novamente.");
        }

        const data = await response.json();
        setMed(data);
       
      } catch (error) {
        console.error("Erro ao buscar dados da API ", error);
        setError("Erro ao carregar detalhes do medicamento.");
      } finally {
        setLoading(false);
      }
    }

    fetchMedicamento();
  }, [id]);
  return { med, loading, error };
}
