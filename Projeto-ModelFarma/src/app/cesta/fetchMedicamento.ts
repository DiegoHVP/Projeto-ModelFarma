import { getApiUrl } from "../../component/featchAPI/getApiUrl";
export async function fetchMedicamento(id: number) {
  const apiUrl = getApiUrl();  
  try {
      const response = await fetch(`${apiUrl}/medicamento/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) throw new Error("Erro ao buscar medicamento.");
  
      const Medicamento  = await response.json();
      return Medicamento;
    } catch (error) {
      console.error("Erro ao buscar dados da API", error);
      return null;
    }
  }
  