import { useState, useEffect } from "react";

export function useMedicamento(id: number) {
  const [med, setMed] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMedicamento() {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/medicamento/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar medicamento. Por favor, tente novamente.");
        }

        const data = await response.json();
        setMed(data.Medicamento);
       
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
