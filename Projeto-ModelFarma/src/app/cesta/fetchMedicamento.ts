export async function fetchMedicamento(id: number) {
    try {
      const response = await fetch(`http://localhost:8000/medicamento/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) throw new Error("Erro ao buscar medicamento.");
  
      const { Medicamento } = await response.json();
      return Medicamento;
    } catch (error) {
      console.error("Erro ao buscar dados da API", error);
      return null;
    }
  }
  